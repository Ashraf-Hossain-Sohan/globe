package com.globe.controller;

import com.globe.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/summary")
    public ResponseEntity<List<Map<String, Object>>> getReportSummary(@RequestParam(required = false) String companyCode) {
        return ResponseEntity.ok(reportService.getReportSummary(companyCode));
    }
}
