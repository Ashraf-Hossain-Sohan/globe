package com.globe.controller;

import com.globe.model.UserAccess;
import com.globe.repository.UserAccessRepository;
import com.globe.service.AuditLogService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user-access")
public class UserAccessController {

    private final UserAccessRepository userAccessRepo;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;

    public UserAccessController(UserAccessRepository userAccessRepo,
                                AuditLogService auditLogService,
                                PasswordEncoder passwordEncoder) {
        this.userAccessRepo = userAccessRepo;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;
    }

    /* ── List all user access ───────────────────────── */
    @GetMapping
    public List<UserAccess> getAll() {
        return userAccessRepo.findAll();
    }

    /* ── Get single user access ─────────────────────── */
    @GetMapping("/{id}")
    public ResponseEntity<UserAccess> getById(@PathVariable Long id) {
        return userAccessRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── Create user access ─────────────────────────── */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody UserAccess userAccess) {
        if (userAccessRepo.findByEmail(userAccess.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "User access rule with this email already exists"));
        }
        // Hash the password if provided, otherwise set a default
        if (userAccess.getPassword() == null || userAccess.getPassword().isBlank()) {
            userAccess.setPassword(passwordEncoder.encode("changeme"));
        } else {
            userAccess.setPassword(passwordEncoder.encode(userAccess.getPassword()));
        }
        UserAccess saved = userAccessRepo.save(userAccess);
        auditLogService.log("CREATE", "UserAccess", String.valueOf(saved.getId()),
                "Created User Access: " + saved.getName() + " (" + saved.getEmail() + ") as " + saved.getRole());
        return ResponseEntity.ok(saved);
    }

    /* ── Update user access ─────────────────────────── */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UserAccess updated) {
        return userAccessRepo.findById(id).map(existing -> {
            // Check email uniqueness if email is changing
            if (!existing.getEmail().equalsIgnoreCase(updated.getEmail()) &&
                userAccessRepo.findByEmail(updated.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body((Object) Map.of("error", "User access rule with this email already exists"));
            }
            existing.setName(updated.getName());
            existing.setEmail(updated.getEmail());
            existing.setRole(updated.getRole());
            existing.setCompanyAccess(updated.getCompanyAccess());
            // Only update password if a new one is provided
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(updated.getPassword()));
            }
            UserAccess saved = userAccessRepo.save(existing);
            auditLogService.log("UPDATE", "UserAccess", String.valueOf(saved.getId()),
                    "Updated User Access: " + saved.getName() + " (" + saved.getEmail() + ")");
            return ResponseEntity.ok((Object) saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ── Delete user access ─────────────────────────── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return userAccessRepo.findById(id).map(existing -> {
            auditLogService.log("DELETE", "UserAccess", String.valueOf(id),
                    "Deleted User Access: " + existing.getName() + " (" + existing.getEmail() + ")");
            userAccessRepo.deleteById(id);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
