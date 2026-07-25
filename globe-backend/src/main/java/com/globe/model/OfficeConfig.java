package com.globe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalTime;

@Entity
@Table(name = "office_configs")
public class OfficeConfig {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String company; // company code

    @NotNull
    @Column(nullable = false)
    private LocalTime workStartTime;

    @NotNull
    @Column(nullable = false)
    private LocalTime workEndTime;

    @NotNull
    @Column(nullable = false)
    private Integer gracePeriodMinutes;

    @NotBlank
    @Column(nullable = false)
    private String workDays; // comma-separated day-of-week numbers: "1,2,3,4,5" (Mon=1..Sun=7)

    /* ── Constructors ──────────────────────────────── */
    public OfficeConfig() {}

    public OfficeConfig(String company, LocalTime workStartTime, LocalTime workEndTime,
                        Integer gracePeriodMinutes, String workDays) {
        this.company = company;
        this.workStartTime = workStartTime;
        this.workEndTime = workEndTime;
        this.gracePeriodMinutes = gracePeriodMinutes;
        this.workDays = workDays;
    }

    /* ── Getters & Setters ─────────────────────────── */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public LocalTime getWorkStartTime() { return workStartTime; }
    public void setWorkStartTime(LocalTime workStartTime) { this.workStartTime = workStartTime; }

    public LocalTime getWorkEndTime() { return workEndTime; }
    public void setWorkEndTime(LocalTime workEndTime) { this.workEndTime = workEndTime; }

    public Integer getGracePeriodMinutes() { return gracePeriodMinutes; }
    public void setGracePeriodMinutes(Integer gracePeriodMinutes) { this.gracePeriodMinutes = gracePeriodMinutes; }

    public String getWorkDays() { return workDays; }
    public void setWorkDays(String workDays) { this.workDays = workDays; }
}
