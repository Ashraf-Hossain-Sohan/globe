package com.globe.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "global_entries")
public class GlobalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    private String description;

    private BigDecimal amount;

    @NotBlank(message = "Category is required")
    @Column(nullable = false)
    private String category;

    @NotBlank(message = "Company is required")
    @Column(nullable = false)
    private String company;

    @NotNull(message = "Entry date is required")
    @Column(nullable = false)
    private LocalDate entryDate;

    @Column(nullable = false, updatable = false)
    private String recordedBy;

    // Constructors
    public GlobalEntry() {}

    public GlobalEntry(String title, String description, BigDecimal amount, String category, String company, LocalDate entryDate, String recordedBy) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.company = company;
        this.entryDate = entryDate;
        this.recordedBy = recordedBy;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }
    public void setCategory(String category) {
        this.category = category;
    }

    public String getCompany() {
        return company;
    }
    public void setCompany(String company) {
        this.company = company;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }
    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public String getRecordedBy() {
        return recordedBy;
    }
    public void setRecordedBy(String recordedBy) {
        this.recordedBy = recordedBy;
    }
}
