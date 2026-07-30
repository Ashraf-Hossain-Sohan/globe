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
        if (companyRepo.count() == 0) {
            companyRepo.save(new Company("XSRS IT", "XSRS", "#60a5fa", "IT Services & Software Consulting"));
            companyRepo.save(new Company("365 Frames", "365F", "#fb923c", "Commercial Photography & Cinematography"));
            companyRepo.save(new Company("EverAfter", "EA", "#f87171", "Wedding Shoot Specialist"));
            companyRepo.save(new Company("PrintDesk", "PD", "#4ade80", "3D Printing & Desk Organization"));
        }

        /* ── Seed employees ──── */
        if (employeeRepo.count() == 0) {
            // 365F Employees
            employeeRepo.save(new Employee("Nabil Azmal Sajid", "COO", "Podcast", "365F", "active", 2024, 0.0));
            employeeRepo.save(new Employee("Tanzid", "Cinematographer", "Production", "365F", "active", 2024, 60000.0));
            
            // XSRS Employees
            employeeRepo.save(new Employee("Ashraf Hossain", "CEO", "Management", "XSRS", "active", 2023, 120000.0));
            employeeRepo.save(new Employee("Rafi", "HR Manager", "Human Resources", "XSRS", "active", 2025, 55000.0));
            employeeRepo.save(new Employee("Sarah Chen", "Senior Developer", "Engineering", "XSRS", "active", 2024, 95000.0));
            
            // EA Employees
            employeeRepo.save(new Employee("Michael Chang", "Lead Photographer", "Creative", "EA", "active", 2023, 75000.0));
            employeeRepo.save(new Employee("Jessica Smith", "Event Coordinator", "Operations", "EA", "active", 2025, 50000.0));
            
            // PD Employees
            employeeRepo.save(new Employee("David Miller", "3D Print Technician", "Production", "PD", "active", 2025, 45000.0));
            employeeRepo.save(new Employee("Emma Wilson", "Operations Lead", "Management", "PD", "active", 2024, 65000.0));
        }

        /* ── Seed office configs ─────────────────────── */
        if (officeConfigRepo.count() == 0) {
            officeConfigRepo.save(new OfficeConfig(
                    "XSRS", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
            officeConfigRepo.save(new OfficeConfig(
                    "365F", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
            officeConfigRepo.save(new OfficeConfig(
                    "EA", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
            officeConfigRepo.save(new OfficeConfig(
                    "PD", LocalTime.of(10, 0), LocalTime.of(18, 0), 5, "1,2,3,4,5"));
        }
    }
}
