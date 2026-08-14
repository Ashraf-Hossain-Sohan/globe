package com.globe.repository;

import com.globe.model.CompanySetting;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompanySettingRepository extends JpaRepository<CompanySetting, Long> {
    List<CompanySetting> findByCompanyCode(String companyCode);
}
