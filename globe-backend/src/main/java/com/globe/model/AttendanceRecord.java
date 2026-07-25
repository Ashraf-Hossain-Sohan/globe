package com.globe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "attendance_records")
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Long employeeId;

    @NotBlank
    @Column(nullable = false)
    private String employeeName;

    @NotBlank
    @Column(nullable = false)
    private String company; // company code, e.g. "XSRS"

    @NotNull
    @Column(nullable = false)
    private LocalDate date;

    private LocalTime clockIn;

    private LocalTime clockOut;

    @NotBlank
    @Column(nullable = false)
    private String status; // "present", "absent", "late", "half-day"

    private String notes;

    /* ── Constructors ──────────────────────────────── */
    public AttendanceRecord() {}

    public AttendanceRecord(Long employeeId, String employeeName, String company,
                            LocalDate date, LocalTime clockIn, LocalTime clockOut,
                            String status, String notes) {
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.company = company;
        this.date = date;
        this.clockIn = clockIn;
        this.clockOut = clockOut;
        this.status = status;
        this.notes = notes;
    }

    /* ── Getters & Setters ─────────────────────────── */
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getEmployeeId() { return employeeId; }
    public void setEmployeeId(Long employeeId) { this.employeeId = employeeId; }

    public String getEmployeeName() { return employeeName; }
    public void setEmployeeName(String employeeName) { this.employeeName = employeeName; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public LocalTime getClockIn() { return clockIn; }
    public void setClockIn(LocalTime clockIn) { this.clockIn = clockIn; }

    public LocalTime getClockOut() { return clockOut; }
    public void setClockOut(LocalTime clockOut) { this.clockOut = clockOut; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
