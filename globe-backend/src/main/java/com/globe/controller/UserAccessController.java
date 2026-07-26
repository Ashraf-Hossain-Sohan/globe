package com.globe.controller;

import com.globe.model.UserAccess;
import com.globe.repository.UserAccessRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-access")
public class UserAccessController {

    private final UserAccessRepository userAccessRepo;

    public UserAccessController(UserAccessRepository userAccessRepo) {
        this.userAccessRepo = userAccessRepo;
    }

    /* ── List all user access ───────────────────────── */
    @GetMapping
    public List<UserAccess> getAll() {
        return userAccessRepo.findAll();
    }

    /* ── Get single user access ─────────────────────── */
    @GetMapping("/{id}")
    public ResponseEntity<UserAccess> getById(@PathVariable Long id) {
        return userAccessRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /* ── Create user access ─────────────────────────── */
    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody UserAccess userAccess) {
        if (userAccessRepo.findByEmail(userAccess.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("User access rule with this email already exists");
        }
        return ResponseEntity.ok(userAccessRepo.save(userAccess));
    }

    /* ── Update user access ─────────────────────────── */
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody UserAccess updated) {
        return userAccessRepo.findById(id).map(existing -> {
            // Check email uniqueness if email is changing
            if (!existing.getEmail().equalsIgnoreCase(updated.getEmail()) &&
                userAccessRepo.findByEmail(updated.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("User access rule with this email already exists");
            }
            existing.setEmail(updated.getEmail());
            existing.setRole(updated.getRole());
            existing.setCompanyAccess(updated.getCompanyAccess());
            return ResponseEntity.ok((Object) userAccessRepo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    /* ── Delete user access ─────────────────────────── */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userAccessRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userAccessRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
