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
public class AttendanceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testControllerContextLoads() {
        assertThat(mockMvc).isNotNull();
    }

    @Test
    public void testGetMapping0() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/attendance/1"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testPutMapping1() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/attendance/1"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testDeleteMapping2() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/attendance/1"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testPostMapping3() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/attendance/clock-in"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testPutMapping4() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/attendance/clock-out/1"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testGetMapping5() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/attendance/report"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }
}
