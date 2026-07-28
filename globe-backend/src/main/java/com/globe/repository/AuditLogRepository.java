package com.globe.repository;

import com.globe.model.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    /* ── Filtered + paginated query ─────────────────── */
    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:userEmail IS NULL OR a.userEmail = :userEmail) AND " +
           "(:dateFrom IS NULL OR a.timestamp >= :dateFrom) AND " +
           "(:dateTo IS NULL OR a.timestamp <= :dateTo) AND " +
           "(:search IS NULL OR LOWER(a.description) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(a.userName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           " OR LOWER(a.userEmail) LIKE LOWER(CONCAT('%', :search, '%')))" +
           " ORDER BY a.timestamp DESC")
    Page<AuditLog> findFiltered(
            @Param("action") String action,
            @Param("entityType") String entityType,
            @Param("userEmail") String userEmail,
            @Param("dateFrom") LocalDateTime dateFrom,
            @Param("dateTo") LocalDateTime dateTo,
            @Param("search") String search,
            Pageable pageable
    );

    /* ── Stats queries ──────────────────────────────── */
    long countByAction(String action);

    long countByTimestampAfter(LocalDateTime after);

    @Query("SELECT COUNT(DISTINCT a.userEmail) FROM AuditLog a WHERE a.action = 'LOGIN' AND a.timestamp >= :after")
    long countDistinctUsersLoggedInAfter(@Param("after") LocalDateTime after);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.action = 'LOGIN' AND a.timestamp >= :after")
    long countLoginsAfter(@Param("after") LocalDateTime after);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.action IN ('CREATE', 'UPDATE', 'DELETE') AND a.timestamp >= :after")
    long countChangesAfter(@Param("after") LocalDateTime after);

    /* ── Distinct values for filter dropdowns ───────── */
    @Query("SELECT DISTINCT a.userEmail FROM AuditLog a ORDER BY a.userEmail")
    List<String> findDistinctUserEmails();

    @Query("SELECT DISTINCT a.entityType FROM AuditLog a WHERE a.entityType IS NOT NULL ORDER BY a.entityType")
    List<String> findDistinctEntityTypes();
}
