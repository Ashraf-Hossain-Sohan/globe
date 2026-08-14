package com.globe.controller;

import com.globe.model.InventoryItem;
import com.globe.model.WishlistItem;
import com.globe.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public ResponseEntity<List<InventoryItem>> getAllInventory(@RequestParam(required = false) String companyCode) {
        if (companyCode != null && !companyCode.isEmpty() && !companyCode.equals("All")) {
            return ResponseEntity.ok(inventoryService.getInventoryByCompany(companyCode));
        }
        return ResponseEntity.ok(inventoryService.getAllInventory());
    }

    @PostMapping
    public ResponseEntity<InventoryItem> createInventory(@RequestBody InventoryItem item) {
        return ResponseEntity.ok(inventoryService.saveInventory(item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInventory(@PathVariable Long id) {
        inventoryService.deleteInventory(id);
        return ResponseEntity.ok().build();
    }
    
    // Wishlist endpoints nested here or under /api/wishlist
    @GetMapping("/wishlist")
    public ResponseEntity<List<WishlistItem>> getAllWishlist(@RequestParam(required = false) String companyCode) {
        if (companyCode != null && !companyCode.isEmpty() && !companyCode.equals("All")) {
            return ResponseEntity.ok(inventoryService.getWishlistByCompany(companyCode));
        }
        return ResponseEntity.ok(inventoryService.getAllWishlist());
    }

    @PostMapping("/wishlist")
    public ResponseEntity<WishlistItem> createWishlist(@RequestBody WishlistItem item) {
        return ResponseEntity.ok(inventoryService.saveWishlist(item));
    }

    @DeleteMapping("/wishlist/{id}")
    public ResponseEntity<Void> deleteWishlist(@PathVariable Long id) {
        inventoryService.deleteWishlist(id);
        return ResponseEntity.ok().build();
    }
}
