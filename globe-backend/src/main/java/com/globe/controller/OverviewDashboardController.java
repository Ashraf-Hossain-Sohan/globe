package com.globe.controller;

import com.globe.model.OverviewMetricsDTO;
import com.globe.service.OverviewDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard/overview")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OverviewDashboardController {

    private final OverviewDashboardService dashboardService;

    public OverviewDashboardController(OverviewDashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<OverviewMetricsDTO> getOverviewData(
            @RequestParam(required = false) Integer months) {
        OverviewMetricsDTO dto = dashboardService.getGroupOverview(months);
        return ResponseEntity.ok(dto);
    }
}
