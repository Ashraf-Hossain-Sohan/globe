package com.globe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "user_access")
public class UserAccess {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Column(nullable = false)
    private String role; // e.g., "admin", "editor", "viewer"

    @Column(length = 1000)
    private String companyAccess; // Comma-separated list of company codes, e.g. "XSRS,365F,EA,PD"

    /* ── Constructors ──────────────────────────────── */
    public UserAccess() {}

    public UserAccess(String email, String role, String companyAccess) {
        this.email = email;
        this.role = role;
        this.companyAccess = companyAccess;
    }

    /* ── Getters & Setters ─────────────────────────── */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCompanyAccess() { return companyAccess; }
    public void setCompanyAccess(String companyAccess) { this.companyAccess = companyAccess; }
}
