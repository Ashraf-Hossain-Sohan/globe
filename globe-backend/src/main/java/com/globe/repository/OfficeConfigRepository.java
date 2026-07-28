package com.globe.repository;

import com.globe.model.OfficeConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OfficeConfigRepository extends JpaRepository<OfficeConfig, Long> {
    Optional<OfficeConfig> findByCompany(String company);
}
