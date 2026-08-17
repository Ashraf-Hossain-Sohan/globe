package com.globe.config;

import com.globe.model.UserAccess;
import com.globe.model.Company;
import com.globe.repository.UserAccessRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import org.springframework.core.annotation.Order;

@Component
@Order(2)
public class DataSeeder implements CommandLineRunner {

    private final UserAccessRepository userAccessRepo;
    private final PasswordEncoder passwordEncoder;
    private final com.globe.repository.CompanyRepository companyRepo;

    public DataSeeder(UserAccessRepository userAccessRepo, PasswordEncoder passwordEncoder, com.globe.repository.CompanyRepository companyRepo) {
        this.userAccessRepo = userAccessRepo;
        this.passwordEncoder = passwordEncoder;
        this.companyRepo = companyRepo;
    }

    @Override
    public void run(String... args) {
        // Seed default admin if no users exist
        if (userAccessRepo.count() == 0) {
            UserAccess admin = new UserAccess(
                    "Ashraf Hossain",
                    "ashraf@globe.com",
                    passwordEncoder.encode("admin123"),
                    "admin",
                    "XSRS,365F,EA,PD"
            );
            userAccessRepo.save(admin);
            System.out.println("✅ Default admin user seeded: ashraf@globe.com / admin123");
        }

        // Seed HR user Rafi if not exists
        if (userAccessRepo.findByEmail("rafi@globe.com").isEmpty()) {
            UserAccess hr = new UserAccess(
                    "Rafi",
                    "rafi@globe.com",
                    passwordEncoder.encode("hr123"),
                    "hr",
                    "XSRS,365F,EA,PD"
            );
            userAccessRepo.save(hr);
            System.out.println("✅ HR user seeded: rafi@globe.com / hr123");
        }

        // Seed default companies
        if (companyRepo.count() == 0) {
            companyRepo.save(new Company("XSRS IT", "XSRS", "#60a5fa", "IT Services & Software Consulting"));
            companyRepo.save(new Company("365 Frames", "365F", "#fb923c", "Commercial Photography & Cinematography"));
            companyRepo.save(new Company("EverAfter", "EA", "#f87171", "Wedding Shoot Specialist"));
            companyRepo.save(new Company("PrintDesk", "PD", "#4ade80", "3D Printing & Desk Organization"));
            System.out.println("✅ Default companies seeded.");
        }
    }
}
