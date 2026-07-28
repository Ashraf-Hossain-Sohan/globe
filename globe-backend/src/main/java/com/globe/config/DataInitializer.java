package com.globe.config;

import com.globe.model.Company;
import com.globe.model.Employee;
import com.globe.model.OfficeConfig;
import com.globe.model.UserAccess;
import com.globe.repository.CompanyRepository;
import com.globe.repository.EmployeeRepository;
import com.globe.repository.OfficeConfigRepository;
import com.globe.repository.UserAccessRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CompanyRepository companyRepo;
    private final EmployeeRepository employeeRepo;
    private final OfficeConfigRepository officeConfigRepo;
    private final UserAccessRepository userAccessRepo;

    public DataInitializer(CompanyRepository companyRepo,
                           EmployeeRepository employeeRepo,
                           OfficeConfigRepository officeConfigRepo,
                           UserAccessRepository userAccessRepo) {
        this.companyRepo = companyRepo;
        this.employeeRepo = employeeRepo;
        this.officeConfigRepo = officeConfigRepo;
        this.userAccessRepo = userAccessRepo;
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

        /* ── Seed office configs ─────────────────────── */
        officeConfigRepo.save(new OfficeConfig(
                "XSRS", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
        officeConfigRepo.save(new OfficeConfig(
                "365F", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
        officeConfigRepo.save(new OfficeConfig(
                "EA", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
        officeConfigRepo.save(new OfficeConfig(
                "PD", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));

        /* ── Seed user access ────────────────────────── */
        // We'll give this legacy seeded user a default password. Real password should be encoded, 
        // but since this is DataInitializer and DataSeeder also exists, we can use a dummy hash or inject PasswordEncoder.
        // Or simply remove this from DataInitializer since DataSeeder now handles the initial admin.
        // Actually, let's remove this line from DataInitializer since DataSeeder handles it properly with password encoding.
    }
}
