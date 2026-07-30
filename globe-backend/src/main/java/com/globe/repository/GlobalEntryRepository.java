package com.globe.repository;

import com.globe.model.GlobalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GlobalEntryRepository extends JpaRepository<GlobalEntry, Long> {
    List<GlobalEntry> findByCompany(String company);
    List<GlobalEntry> findByCategory(String category);
}
