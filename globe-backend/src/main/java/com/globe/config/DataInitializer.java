package com.globe.config;

import com.globe.model.Company;
import com.globe.model.Employee;
import com.globe.repository.CompanyRepository;
import com.globe.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CompanyRepository companyRepo;
    private final EmployeeRepository employeeRepo;

    public DataInitializer(CompanyRepository companyRepo, EmployeeRepository employeeRepo) {
        this.companyRepo = companyRepo;
        this.employeeRepo = employeeRepo;
    }

    @Override
    public void run(String... args) {
        /* ── Seed companies ──────────────────────────── */
        companyRepo.save(new Company("XSRS IT", "XSRS", "#60a5fa", "IT Services & Software Consulting"));
        companyRepo.save(new Company("365 Frames", "365F", "#fb923c", "Commercial Photography & Cinematography"));
        companyRepo.save(new Company("EverAfter", "EA", "#f87171", "Wedding Shoot Specialist"));
        companyRepo.save(new Company("PrintDesk", "PD", "#4ade80", "3D Printing & Desk Organization"));

        /* ── Seed employees (matching screenshot) ──── */
        employeeRepo.save(new Employee(
                "Nabil Azmal Sajid", "COO", "Podcast",
                "365F", "active", 2025, 0.0
        ));
    }
}
