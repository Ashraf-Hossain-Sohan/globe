package com.globe.controller;

import com.globe.model.UserAccess;
import com.globe.repository.UserAccessRepository;
import com.globe.service.AuditLogService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final UserAccessRepository userAccessRepo;
    private final AuditLogService auditLogService;

    public AuthController(AuthenticationManager authManager,
                          UserAccessRepository userAccessRepo,
                          AuditLogService auditLogService) {
        this.authManager = authManager;
        this.userAccessRepo = userAccessRepo;
        this.auditLogService = auditLogService;
    }

    /* ── Login ─────────────────────────────────────── */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            // Store in session
            HttpSession session = httpRequest.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

            UserAccess user = userAccessRepo.findByEmail(request.email()).orElse(null);
            String userName = user != null ? user.getName() : request.email();

            // Log login event
            auditLogService.log("LOGIN", null, null,
                    "User logged in: " + userName, request.email(), userName);

            return ResponseEntity.ok(buildUserMap(user));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid email or password"));
        }
    }

    /* ── Logout ────────────────────────────────────── */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = "unknown";
        String name = "Unknown";

        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            email = auth.getName();
            UserAccess user = userAccessRepo.findByEmail(email).orElse(null);
            name = user != null ? user.getName() : email;
        }

        // Log logout event before clearing context
        auditLogService.log("LOGOUT", null, null,
                "User logged out: " + name, email, name);

        // Invalidate session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    /* ── Current User ──────────────────────────────── */
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        UserAccess user = userAccessRepo.findByEmail(auth.getName()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        return ResponseEntity.ok(buildUserMap(user));
    }

    /* ── Helpers ────────────────────────────────────── */
    private Map<String, Object> buildUserMap(UserAccess user) {
        Map<String, Object> map = new LinkedHashMap<>();
        if (user != null) {
            map.put("id", user.getId());
            map.put("name", user.getName());
            map.put("email", user.getEmail());
            map.put("role", user.getRole());
            map.put("companyAccess", user.getCompanyAccess());
        }
        return map;
    }

    record LoginRequest(String email, String password) {}
}
