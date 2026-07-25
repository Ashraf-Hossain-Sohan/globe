package com.globe.controller;

import com.globe.model.Employee;
import com.globe.repository.CompanyRepository;
import com.globe.repository.EmployeeRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeRepository employeeRepo;
    private final CompanyRepository companyRepo;

    public EmployeeController(EmployeeRepository employeeRepo, CompanyRepository companyRepo) {
        this.employeeRepo = employeeRepo;
        this.companyRepo = companyRepo;
    }

    /* ── List all (optionally filter by company code) ─── */
    @GetMapping
    public List<Employee> getAll(@RequestParam(required = false) String company) {
        if (company != null && !company.isBlank()) {
            return employeeRepo.findByCompany(company);
        }
        return employeeRepo.findAll();
    }

    /* ── Get one ────────────────────────────────────── */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getById(@PathVariable Long id) {
        return employeeRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── Create ─────────────────────────────────────── */
    @PostMapping
    public Employee create(@Valid @RequestBody Employee employee) {
        return employeeRepo.save(employee);
    }

    /* ── Update ─────────────────────────────────────── */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> update(@PathVariable Long id,
                                           @Valid @RequestBody Employee updated) {
        return employeeRepo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setRole(updated.getRole());
            existing.setDepartment(updated.getDepartment());
            existing.setCompany(updated.getCompany());
            existing.setStatus(updated.getStatus());
            existing.setSinceYear(updated.getSinceYear());
            existing.setSalary(updated.getSalary());
            return ResponseEntity.ok(employeeRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ── Delete ─────────────────────────────────────── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!employeeRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        employeeRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    /* ── Stats per company ──────────────────────────── */
    @GetMapping("/stats")
    public List<Map<String, Object>> stats() {
        List<Map<String, Object>> result = new ArrayList<>();
        companyRepo.findAll().forEach(company -> {
            Map<String, Object> stat = new LinkedHashMap<>();
            stat.put("code", company.getCode());
            stat.put("name", company.getName());
            stat.put("color", company.getColor());
            stat.put("description", company.getDescription());
            stat.put("total", employeeRepo.countByCompany(company.getCode()));
            stat.put("active", employeeRepo.countByCompanyAndStatus(company.getCode(), "active"));
            result.add(stat);
        });
        return result;
    }
}
