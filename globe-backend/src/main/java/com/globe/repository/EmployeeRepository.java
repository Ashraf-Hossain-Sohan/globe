package com.globe.repository;

import com.globe.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    List<Employee> findByCompany(String company);
    List<Employee> findByCompanyAndStatus(String company, String status);
    long countByCompany(String company);
    long countByCompanyAndStatus(String company, String status);
}
