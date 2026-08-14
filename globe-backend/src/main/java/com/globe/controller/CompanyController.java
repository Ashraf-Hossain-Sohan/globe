package com.globe.controller;

import com.globe.model.Company;
import com.globe.repository.CompanyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {

    private final CompanyRepository companyRepo;

    public CompanyController(CompanyRepository companyRepo) {
        this.companyRepo = companyRepo;
    }

    @GetMapping
    public List<Company> getAll() {
        return companyRepo.findAll();
    }

    @PostMapping
    public Company createCompany(@RequestBody Company company) {
        return companyRepo.save(company);
    }

    @DeleteMapping("/{id}")
    public void deleteCompany(@PathVariable Long id) {
        companyRepo.deleteById(id);
    }
}
