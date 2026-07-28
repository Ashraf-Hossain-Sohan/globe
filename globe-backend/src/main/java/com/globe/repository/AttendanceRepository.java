package com.globe.repository;

import com.globe.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByCompanyAndDateBetweenOrderByDateAsc(
            String company, LocalDate start, LocalDate end);

    List<AttendanceRecord> findByEmployeeIdAndDateBetweenOrderByDateAsc(
            Long employeeId, LocalDate start, LocalDate end);

    Optional<AttendanceRecord> findByEmployeeIdAndDate(Long employeeId, LocalDate date);

    List<AttendanceRecord> findByDateBetweenOrderByDateAsc(LocalDate start, LocalDate end);

    long countByEmployeeIdAndDateBetweenAndStatus(
            Long employeeId, LocalDate start, LocalDate end, String status);

    @Query("SELECT DISTINCT a.employeeId FROM AttendanceRecord a WHERE a.company = :company")
    List<Long> findDistinctEmployeeIdsByCompany(@Param("company") String company);
}
