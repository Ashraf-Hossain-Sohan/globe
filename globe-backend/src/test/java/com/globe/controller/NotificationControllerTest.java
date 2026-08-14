package com.globe.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class NotificationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testControllerContextLoads() {
        assertThat(mockMvc).isNotNull();
    }

    @Test
    public void testPostMapping0() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/notifications/1/read"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testPostMapping1() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/notifications/read-all"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }
}
