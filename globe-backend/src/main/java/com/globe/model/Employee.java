package com.globe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "employees")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String name;

    @NotBlank
    private String role;

    private String department;

    @NotBlank
    @Column(nullable = false)
    private String company;

    @NotBlank
    @Column(nullable = false)
    private String status; // "active" or "inactive"

    @NotNull
    private Integer sinceYear;

    private Double salary;

    /* ── Constructors ──────────────────────────────── */
    public Employee() {}

    public Employee(String name, String role, String department,
                    String company, String status, Integer sinceYear, Double salary) {
        this.name = name;
        this.role = role;
        this.department = department;
        this.company = company;
        this.status = status;
        this.sinceYear = sinceYear;
        this.salary = salary;
    }

    /* ── Getters & Setters ─────────────────────────── */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getSinceYear() { return sinceYear; }
    public void setSinceYear(Integer sinceYear) { this.sinceYear = sinceYear; }

    public Double getSalary() { return salary; }
    public void setSalary(Double salary) { this.salary = salary; }
}
