package com.globe.controller;

import com.globe.model.AuditLog;
import com.globe.repository.AuditLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogRepository auditLogRepo;

    public AuditLogController(AuditLogRepository auditLogRepo) {
        this.auditLogRepo = auditLogRepo;
    }

    /* ── List logs (paginated + filtered) ───────────── */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String action,
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String userEmail,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(required = false) String search
    ) {
        LocalDateTime from = dateFrom != null ? LocalDate.parse(dateFrom).atStartOfDay() : null;
        LocalDateTime to = dateTo != null ? LocalDate.parse(dateTo).atTime(LocalTime.MAX) : null;

        String actionParam = (action != null && !action.isBlank()) ? action : null;
        String entityParam = (entityType != null && !entityType.isBlank()) ? entityType : null;
        String userParam = (userEmail != null && !userEmail.isBlank()) ? userEmail : null;
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        Page<AuditLog> result = auditLogRepo.findFiltered(
                actionParam, entityParam, userParam, from, to, searchParam,
                PageRequest.of(page, size)
        );

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", result.getContent());
        response.put("totalElements", result.getTotalElements());
        response.put("totalPages", result.getTotalPages());
        response.put("currentPage", result.getNumber());
        response.put("size", result.getSize());

        return ResponseEntity.ok(response);
    }

    /* ── Stats for dashboard cards ──────────────────── */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalLogs", auditLogRepo.count());
        stats.put("loginsToday", auditLogRepo.countLoginsAfter(todayStart));
        stats.put("changesToday", auditLogRepo.countChangesAfter(todayStart));
        stats.put("activeUsersToday", auditLogRepo.countDistinctUsersLoggedInAfter(todayStart));

        return ResponseEntity.ok(stats);
    }

    /* ── Filter options ─────────────────────────────── */
    @GetMapping("/filters")
    public ResponseEntity<Map<String, Object>> filters() {
        Map<String, Object> filters = new LinkedHashMap<>();
        filters.put("users", auditLogRepo.findDistinctUserEmails());
        filters.put("entityTypes", auditLogRepo.findDistinctEntityTypes());
        filters.put("actions", List.of("LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE"));
        return ResponseEntity.ok(filters);
    }
}
