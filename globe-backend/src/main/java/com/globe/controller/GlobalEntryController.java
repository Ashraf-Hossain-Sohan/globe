package com.globe.controller;

import com.globe.model.GlobalEntry;
import com.globe.model.UserAccess;
import com.globe.service.GlobalEntryService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/global-entries")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class GlobalEntryController {

    private final GlobalEntryService globalEntryService;

    public GlobalEntryController(GlobalEntryService globalEntryService) {
        this.globalEntryService = globalEntryService;
    }

    @GetMapping
    public ResponseEntity<?> getAllEntries(HttpSession session) {
        if (session.getAttribute("user") == null) {
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }
        return ResponseEntity.ok(globalEntryService.getAllEntries());
    }

    @PostMapping
    public ResponseEntity<?> createEntry(@Valid @RequestBody GlobalEntry entry, HttpSession session) {
        UserAccess user = (UserAccess) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }
        
        GlobalEntry created = globalEntryService.createEntry(entry, user.getEmail(), user.getName());
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateEntry(@PathVariable Long id, @Valid @RequestBody GlobalEntry entryDetails, HttpSession session) {
        UserAccess user = (UserAccess) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }
        
        try {
            GlobalEntry updated = globalEntryService.updateEntry(id, entryDetails, user.getEmail(), user.getName());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEntry(@PathVariable Long id, HttpSession session) {
        UserAccess user = (UserAccess) session.getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(401).body("{\"error\":\"Unauthorized\"}");
        }
        
        globalEntryService.deleteEntry(id, user.getEmail(), user.getName());
        return ResponseEntity.ok().build();
    }
}
