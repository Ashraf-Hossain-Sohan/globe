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
public class InventoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testControllerContextLoads() {
        assertThat(mockMvc).isNotNull();
    }

    @Test
    public void testDeleteMapping0() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/inventory/1"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testGetMapping1() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/inventory/wishlist"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testPostMapping2() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/inventory/wishlist"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testDeleteMapping3() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete("/api/inventory/wishlist/1"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }
}
