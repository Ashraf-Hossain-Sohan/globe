package com.globe.config;

import com.globe.model.UserAccess;
import com.globe.repository.UserAccessRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserAccessRepository userAccessRepo;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserAccessRepository userAccessRepo, PasswordEncoder passwordEncoder) {
        this.userAccessRepo = userAccessRepo;
        this.passwordEncoder = passwordEncoder;
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
    }
}
