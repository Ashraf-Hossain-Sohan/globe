package com.globe.service;

import com.globe.model.GlobalEntry;
import com.globe.model.Notification;
import com.globe.repository.GlobalEntryRepository;
import com.globe.repository.NotificationRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GlobalEntryService {

    private final GlobalEntryRepository globalEntryRepository;
    private final AuditLogService auditLogService;
    private final NotificationRepository notificationRepository;
    private final HttpServletRequest request;

    public GlobalEntryService(GlobalEntryRepository globalEntryRepository, AuditLogService auditLogService, NotificationRepository notificationRepository, HttpServletRequest request) {
        this.globalEntryRepository = globalEntryRepository;
        this.auditLogService = auditLogService;
        this.notificationRepository = notificationRepository;
        this.request = request;
    }

    public List<GlobalEntry> getAllEntries() {
        return globalEntryRepository.findAll();
    }

    public Optional<GlobalEntry> getEntryById(Long id) {
        return globalEntryRepository.findById(id);
    }

    public GlobalEntry createEntry(GlobalEntry entry, String userEmail, String userName) {
        entry.setRecordedBy(userName + " (" + userEmail + ")");
        GlobalEntry savedEntry = globalEntryRepository.save(entry);
        
        auditLogService.log(
            "CREATE",
            "GlobalEntry",
            savedEntry.getId().toString(),
            "Created global entry: " + savedEntry.getTitle() + " for " + savedEntry.getCompany(),
            userEmail,
            userName
        );

        Notification notif = new Notification(userName + " recorded a new " + entry.getCategory() + " for " + entry.getCompany(), "GLOBAL_ENTRY");
        notificationRepository.save(notif);
        
        return savedEntry;
    }

    public GlobalEntry updateEntry(Long id, GlobalEntry entryDetails, String userEmail, String userName) {
        return globalEntryRepository.findById(id).map(entry -> {
            entry.setTitle(entryDetails.getTitle());
            entry.setDescription(entryDetails.getDescription());
            entry.setAmount(entryDetails.getAmount());
            entry.setCategory(entryDetails.getCategory());
            entry.setCompany(entryDetails.getCompany());
            entry.setEntryDate(entryDetails.getEntryDate());
            
            GlobalEntry updatedEntry = globalEntryRepository.save(entry);
            
            auditLogService.log(
                "UPDATE",
                "GlobalEntry",
                updatedEntry.getId().toString(),
                "Updated global entry: " + updatedEntry.getTitle(),
                userEmail,
                userName
            );
            
            return updatedEntry;
        }).orElseThrow(() -> new RuntimeException("Entry not found with id " + id));
    }

    public void deleteEntry(Long id, String userEmail, String userName) {
        globalEntryRepository.findById(id).ifPresent(entry -> {
            globalEntryRepository.delete(entry);
            
            auditLogService.log(
                "DELETE",
                "GlobalEntry",
                id.toString(),
                "Deleted global entry: " + entry.getTitle(),
                userEmail,
                userName
            );
        });
    }

}
