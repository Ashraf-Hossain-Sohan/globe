package com.globe.controller;

import com.globe.model.AttendanceRecord;
import com.globe.model.Employee;
import com.globe.model.OfficeConfig;
import com.globe.repository.AttendanceRepository;
import com.globe.repository.EmployeeRepository;
import com.globe.repository.OfficeConfigRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.*;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceRepository attendanceRepo;
    private final EmployeeRepository employeeRepo;
    private final OfficeConfigRepository configRepo;

    public AttendanceController(AttendanceRepository attendanceRepo,
                                EmployeeRepository employeeRepo,
                                OfficeConfigRepository configRepo) {
        this.attendanceRepo = attendanceRepo;
        this.employeeRepo = employeeRepo;
        this.configRepo = configRepo;
    }

    /* ── List records for a month (calendar view) ──── */
    @GetMapping
    public List<AttendanceRecord> getMonthly(
            @RequestParam(required = false) String company,
            @RequestParam int year,
            @RequestParam int month) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        if (company != null && !company.isBlank()) {
            return attendanceRepo.findByCompanyAndDateBetweenOrderByDateAsc(company, start, end);
        }
        return attendanceRepo.findByDateBetweenOrderByDateAsc(start, end);
    }

    /* ── Get single record ─────────────────────────── */
    @GetMapping("/{id}")
    public ResponseEntity<AttendanceRecord> getById(@PathVariable Long id) {
        return attendanceRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── Create / manual entry ─────────────────────── */
    @PostMapping
    public AttendanceRecord create(@Valid @RequestBody AttendanceRecord record) {
        // Auto-determine status if not explicitly set
        if (record.getStatus() == null || record.getStatus().isBlank()) {
            record.setStatus(determineStatus(record));
        }
        return attendanceRepo.save(record);
    }

    /* ── Update ────────────────────────────────────── */
    @PutMapping("/{id}")
    public ResponseEntity<AttendanceRecord> update(@PathVariable Long id,
                                                   @Valid @RequestBody AttendanceRecord updated) {
        return attendanceRepo.findById(id).map(existing -> {
            existing.setEmployeeId(updated.getEmployeeId());
            existing.setEmployeeName(updated.getEmployeeName());
            existing.setCompany(updated.getCompany());
            existing.setDate(updated.getDate());
            existing.setClockIn(updated.getClockIn());
            existing.setClockOut(updated.getClockOut());
            existing.setStatus(updated.getStatus());
            existing.setNotes(updated.getNotes());
            return ResponseEntity.ok(attendanceRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ── Delete ────────────────────────────────────── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!attendanceRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        attendanceRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ── Clock In ──────────────────────────────────── */
    @PostMapping("/clock-in")
    public ResponseEntity<?> clockIn(@RequestBody Map<String, Object> body) {
        Long employeeId = ((Number) body.get("employeeId")).longValue();
        String company = (String) body.get("company");

        // Check if employee exists
        Optional<Employee> empOpt = employeeRepo.findById(employeeId);
        if (empOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Employee not found"));
        }

        Employee emp = empOpt.get();
        LocalDate today = LocalDate.now();

        // Check if already clocked in today
        Optional<AttendanceRecord> existing = attendanceRepo.findByEmployeeIdAndDate(employeeId, today);
        if (existing.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Already clocked in today", "record", existing.get()));
        }

        LocalTime now = LocalTime.now();
        String status = "present";

        // Check if late based on office config
        configRepo.findByCompany(company).ifPresent(config -> {
            // status will be set after
        });

        AttendanceRecord record = new AttendanceRecord(
                employeeId, emp.getName(), company,
                today, now, null,
                determineClockInStatus(company, now), null
        );

        return ResponseEntity.ok(attendanceRepo.save(record));
    }

    /* ── Clock Out ─────────────────────────────────── */
    @PutMapping("/clock-out/{id}")
    public ResponseEntity<?> clockOut(@PathVariable Long id) {
        return attendanceRepo.findById(id).map(record -> {
            if (record.getClockOut() != null) {
                return ResponseEntity.badRequest().body(
                        (Object) Map.of("error", "Already clocked out"));
            }
            record.setClockOut(LocalTime.now());
            return ResponseEntity.ok((Object) attendanceRepo.save(record));
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ── Monthly Report (per-employee summary) ───── */
    @GetMapping("/report")
    public List<Map<String, Object>> report(
            @RequestParam String company,
            @RequestParam int year,
            @RequestParam int month) {

        YearMonth ym = YearMonth.of(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // Get all employees for this company
        List<Employee> employees = employeeRepo.findByCompany(company);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Employee emp : employees) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("employeeId", emp.getId());
            row.put("employeeName", emp.getName());
            row.put("role", emp.getRole());

            long present = attendanceRepo.countByEmployeeIdAndDateBetweenAndStatus(
                    emp.getId(), start, end, "present");
            long late = attendanceRepo.countByEmployeeIdAndDateBetweenAndStatus(
                    emp.getId(), start, end, "late");
            long absent = attendanceRepo.countByEmployeeIdAndDateBetweenAndStatus(
                    emp.getId(), start, end, "absent");
            long halfDay = attendanceRepo.countByEmployeeIdAndDateBetweenAndStatus(
                    emp.getId(), start, end, "half-day");

            row.put("present", present);
            row.put("late", late);
            row.put("absent", absent);
            row.put("halfDay", halfDay);
            row.put("totalDays", present + late + absent + halfDay);

            // Get attendance records for hours calculation
            List<AttendanceRecord> records = attendanceRepo
                    .findByEmployeeIdAndDateBetweenOrderByDateAsc(emp.getId(), start, end);
            double totalHours = 0;
            for (AttendanceRecord r : records) {
                if (r.getClockIn() != null && r.getClockOut() != null) {
                    long minutes = java.time.Duration.between(r.getClockIn(), r.getClockOut()).toMinutes();
                    totalHours += minutes / 60.0;
                }
            }
            row.put("totalHours", Math.round(totalHours * 10.0) / 10.0);

            result.add(row);
        }

        return result;
    }

    /* ── Helpers ───────────────────────────────────── */
    private String determineStatus(AttendanceRecord record) {
        if (record.getClockIn() == null) return "absent";
        return determineClockInStatus(record.getCompany(), record.getClockIn());
    }

    private String determineClockInStatus(String company, LocalTime clockIn) {
        Optional<OfficeConfig> configOpt = configRepo.findByCompany(company);
        if (configOpt.isPresent()) {
            OfficeConfig config = configOpt.get();
            LocalTime deadline = config.getWorkStartTime()
                    .plusMinutes(config.getGracePeriodMinutes());
            if (clockIn.isAfter(deadline)) {
                return "late";
            }
        }
        return "present";
    }
}
