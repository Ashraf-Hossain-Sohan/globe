package com.globe.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globe.model.UserAccess;
import com.globe.repository.UserAccessRepository;
import com.globe.service.AuditLogService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(com.globe.config.SecurityConfig.class)
@ActiveProfiles("test")
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AuthenticationManager authManager;

    @MockitoBean
    private UserAccessRepository userAccessRepo;

    @MockitoBean
    private AuditLogService auditLogService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserAccess mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new UserAccess("Test User", "test@globe.com", "password", "admin", "XSRS");
        mockUser.setId(1L);
    }

    @Test
    void testLogin_Success() throws Exception {
        Authentication auth = new UsernamePasswordAuthenticationToken("test@globe.com", "password");
        when(authManager.authenticate(any(Authentication.class))).thenReturn(auth);
        when(userAccessRepo.findByEmail("test@globe.com")).thenReturn(Optional.of(mockUser));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"test@globe.com\", \"password\":\"password\"}")
                .with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@globe.com"))
                .andExpect(jsonPath("$.name").value("Test User"));
    }

    @Test
    void testLogin_Failure() throws Exception {
        when(authManager.authenticate(any(Authentication.class))).thenThrow(new BadCredentialsException("Bad credentials"));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"wrong@globe.com\", \"password\":\"wrong\"}")
                .with(csrf()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid email or password"));
    }

    @Test
    @WithMockUser(username = "test@globe.com")
    void testMe_Success() throws Exception {
        when(userAccessRepo.findByEmail("test@globe.com")).thenReturn(Optional.of(mockUser));

        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("test@globe.com"));
    }

    @Test
    void testMe_Unauthenticated() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "test@globe.com")
    void testLogout_Success() throws Exception {
        mockMvc.perform(post("/api/auth/logout").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Logged out successfully"));
    }

    @Test
    public void testPostMapping0() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/auth/login"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(400));
    }

    @Test
    public void testPostMapping1() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post("/api/auth/logout"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(200));
    }

    @Test
    public void testGetMapping2() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get("/api/auth/me"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(401));
    }

    @Test
    public void testPutMapping3() throws Exception {
        mockMvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put("/api/auth/theme"))
               .andExpect(org.springframework.test.web.servlet.result.MockMvcResultMatchers.status().is(404));
    }
}
