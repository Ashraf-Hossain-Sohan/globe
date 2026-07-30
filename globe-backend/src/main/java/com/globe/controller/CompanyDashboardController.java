package com.globe.controller;

import com.globe.model.DashboardMetricsDTO;
import com.globe.service.CompanyDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CompanyDashboardController {

    private final CompanyDashboardService dashboardService;

    public CompanyDashboardController(CompanyDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/{companyCode}")
    public ResponseEntity<DashboardMetricsDTO> getDashboardData(
            @PathVariable String companyCode,
            @RequestParam(required = false) Integer months) {
        DashboardMetricsDTO dto = dashboardService.getDashboardMetrics(companyCode, months);
        return ResponseEntity.ok(dto);
    }
}
