package com.globe.controller;

import com.globe.model.CompanySetting;
import com.globe.repository.CompanySettingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SettingsController {

    private final CompanySettingRepository settingRepository;

    public SettingsController(CompanySettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @GetMapping
    public ResponseEntity<List<CompanySetting>> getAllSettings(@RequestParam(required = false) String companyCode) {
        if (companyCode != null && !companyCode.isEmpty() && !companyCode.equals("All")) {
            return ResponseEntity.ok(settingRepository.findByCompanyCode(companyCode));
        }
        return ResponseEntity.ok(settingRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<CompanySetting> saveSetting(@RequestBody CompanySetting setting) {
        return ResponseEntity.ok(settingRepository.save(setting));
    }
}
