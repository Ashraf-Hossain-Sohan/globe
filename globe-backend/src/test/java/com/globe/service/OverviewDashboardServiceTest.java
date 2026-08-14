package com.globe.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@ActiveProfiles("test")
public class OverviewDashboardServiceTest {

    @Autowired
    private OverviewDashboardService service;

    @Test
    public void testServiceLoads() {
        assertThat(service).isNotNull();
    }

    

    @Test
    public void testServiceIsNotNull() {
        org.junit.jupiter.api.Assertions.assertNotNull(service);
    }

    @Test
    public void testServiceClass() {
        org.junit.jupiter.api.Assertions.assertEquals(OverviewDashboardService.class, service.getClass().getSuperclass() != Object.class && service.getClass().getName().contains("$$") ? service.getClass().getSuperclass() : service.getClass());
    }
}
