package com.globe.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_action", columnList = "action"),
    @Index(name = "idx_audit_entity_type", columnList = "entityType"),
    @Index(name = "idx_audit_user_email", columnList = "userEmail")
})
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String action; // LOGIN, LOGOUT, CREATE, UPDATE, DELETE

    @Column(length = 50)
    private String entityType; // Employee, Company, UserAccess, Attendance, OfficeConfig

    @Column(length = 50)
    private String entityId;

    @Column(length = 500)
    private String description;

    @Column(nullable = false)
    private String userEmail;

    @Column(length = 100)
    private String userName;

    @Column(length = 50)
    private String ipAddress;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    /* ── Constructors ──────────────────────────────── */
    public AuditLog() {}

    public AuditLog(String action, String entityType, String entityId,
                    String description, String userEmail, String userName, String ipAddress) {
        this.action = action;
        this.entityType = entityType;
        this.entityId = entityId;
        this.description = description;
        this.userEmail = userEmail;
        this.userName = userName;
        this.ipAddress = ipAddress;
        this.timestamp = LocalDateTime.now();
    }

    /* ── Getters & Setters ─────────────────────────── */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }

    public String getEntityId() { return entityId; }
    public void setEntityId(String entityId) { this.entityId = entityId; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
