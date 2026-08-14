package com.globe.service;

import com.globe.model.InventoryItem;
import com.globe.model.WishlistItem;
import com.globe.repository.InventoryRepository;
import com.globe.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InventoryService {
    private final InventoryRepository inventoryRepository;
    private final WishlistRepository wishlistRepository;
    
    public InventoryService(InventoryRepository inventoryRepository, WishlistRepository wishlistRepository) {
        this.inventoryRepository = inventoryRepository;
        this.wishlistRepository = wishlistRepository;
    }
    
    public List<InventoryItem> getAllInventory() { return inventoryRepository.findAll(); }
    public List<InventoryItem> getInventoryByCompany(String companyCode) { return inventoryRepository.findByCompanyCode(companyCode); }
    public InventoryItem saveInventory(InventoryItem item) { return inventoryRepository.save(item); }
    public void deleteInventory(Long id) { inventoryRepository.deleteById(id); }
    
    public List<WishlistItem> getAllWishlist() { return wishlistRepository.findAll(); }
    public List<WishlistItem> getWishlistByCompany(String companyCode) { return wishlistRepository.findByCompanyCode(companyCode); }
    public WishlistItem saveWishlist(WishlistItem item) { return wishlistRepository.save(item); }
    public void deleteWishlist(Long id) { wishlistRepository.deleteById(id); }
}
