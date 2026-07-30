package com.globe.controller;

import com.globe.model.Notification;
import com.globe.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationRepository notificationRepository;

    public NotificationController(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {
        // Limit to latest 50 notifications for simplicity
        List<Notification> notifs = notificationRepository.findAllByOrderByCreatedAtDesc()
                .stream().limit(50).collect(Collectors.toList());
        return ResponseEntity.ok(notifs);
    }

    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        List<Notification> unread = notificationRepository.findAll().stream()
                .filter(n -> !n.isRead()).collect(Collectors.toList());
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok().build();
    }
}
