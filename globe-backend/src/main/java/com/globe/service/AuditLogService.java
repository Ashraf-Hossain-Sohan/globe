package com.globe.service;

import com.globe.model.AuditLog;
import com.globe.repository.AuditLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepo;

    public AuditLogService(AuditLogRepository auditLogRepo) {
        this.auditLogRepo = auditLogRepo;
    }

    /**
     * Log an audit event using the currently authenticated user.
     */
    public void log(String action, String entityType, String entityId, String description) {
        String email = "system";
        String name = "System";

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            email = auth.getName();
            // Name is stored as the auth details or we just use the email
            Object details = auth.getDetails();
            if (details instanceof String) {
                name = (String) details;
            } else {
                name = email;
            }
        }

        log(action, entityType, entityId, description, email, name);
    }

    /**
     * Log an audit event with explicit user info (used for login/logout where
     * the security context may not yet be set).
     */
    public void log(String action, String entityType, String entityId,
                    String description, String userEmail, String userName) {
        String ip = getClientIp();
        AuditLog entry = new AuditLog(action, entityType, entityId,
                description, userEmail, userName, ip);
        auditLogRepo.save(entry);
    }

    private String getClientIp() {
        try {
            ServletRequestAttributes attrs =
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null) {
                HttpServletRequest request = attrs.getRequest();
                String forwarded = request.getHeader("X-Forwarded-For");
                if (forwarded != null && !forwarded.isBlank()) {
                    return forwarded.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception ignored) {}
        return "unknown";
    }
}
