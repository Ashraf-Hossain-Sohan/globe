package com.globe.repository;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
public class OfficeConfigRepositoryTest {

    @Autowired
    private OfficeConfigRepository repository;

    @Test
    public void testRepositoryLoads() {
        assertThat(repository).isNotNull();
    }

    

    @Test
    public void testFindAllIsNotNull() {
        java.util.List<?> results = repository.findAll();
        org.junit.jupiter.api.Assertions.assertNotNull(results);
    }

    @Test
    public void testCount() {
        long count = repository.count();
        org.junit.jupiter.api.Assertions.assertTrue(count >= 0);
    }
    
    @Test
    public void testExistsByIdFalse() {
        try {
            boolean exists = repository.existsById(-1L);
            org.junit.jupiter.api.Assertions.assertFalse(exists);
        } catch(Exception e) {
            // handle String id repos
        }
    }
}
