package com.globe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

@Entity
@Table(name = "user_access")
public class UserAccess implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password; // BCrypt hashed

    @NotBlank
    @Column(nullable = false)
    private String role; // e.g., "admin", "editor", "viewer"

    @Column(length = 1000)
    private String companyAccess; // Comma-separated list of company codes, e.g. "XSRS,365F,EA,PD"

    @Column(length = 20)
    private String theme = "light";

    /* ── Constructors ──────────────────────────────── */
    public UserAccess() {}

    public UserAccess(String name, String email, String password, String role, String companyAccess) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.companyAccess = companyAccess;
    }

    /* ── Getters & Setters ─────────────────────────── */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getCompanyAccess() { return companyAccess; }
    public void setCompanyAccess(String companyAccess) { this.companyAccess = companyAccess; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
