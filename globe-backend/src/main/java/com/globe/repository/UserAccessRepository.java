package com.globe.repository;

import com.globe.model.UserAccess;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserAccessRepository extends JpaRepository<UserAccess, Long> {
    Optional<UserAccess> findByEmail(String email);
}
