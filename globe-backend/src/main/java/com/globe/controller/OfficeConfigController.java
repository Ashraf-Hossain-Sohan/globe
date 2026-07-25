package com.globe.controller;

import com.globe.model.OfficeConfig;
import com.globe.repository.OfficeConfigRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/office-config")
public class OfficeConfigController {

    private final OfficeConfigRepository configRepo;

    public OfficeConfigController(OfficeConfigRepository configRepo) {
        this.configRepo = configRepo;
    }

    /* ── Get config for a company ─────────────────── */
    @GetMapping
    public ResponseEntity<?> getConfig(@RequestParam(required = false) String company) {
        if (company != null && !company.isBlank()) {
            return configRepo.findByCompany(company)
                    .map(c -> ResponseEntity.ok((Object) c))
                    .orElse(ResponseEntity.notFound().build());
        }
        return ResponseEntity.ok(configRepo.findAll());
    }

    /* ── Get all configs ──────────────────────────── */
    @GetMapping("/all")
    public List<OfficeConfig> getAll() {
        return configRepo.findAll();
    }

    /* ── Update config ────────────────────────────── */
    @PutMapping
    public ResponseEntity<OfficeConfig> update(@Valid @RequestBody OfficeConfig updated) {
        return configRepo.findByCompany(updated.getCompany()).map(existing -> {
            existing.setWorkStartTime(updated.getWorkStartTime());
            existing.setWorkEndTime(updated.getWorkEndTime());
            existing.setGracePeriodMinutes(updated.getGracePeriodMinutes());
            existing.setWorkDays(updated.getWorkDays());
            return ResponseEntity.ok(configRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }
}
