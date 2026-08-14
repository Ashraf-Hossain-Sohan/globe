package com.globe.service;

import com.globe.model.Bill;
import com.globe.repository.BillRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BillService {
    private final BillRepository billRepository;
    
    public BillService(BillRepository billRepository) {
        this.billRepository = billRepository;
    }
    
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }
    
    public List<Bill> getBillsByCompany(String companyCode) {
        return billRepository.findByCompanyCode(companyCode);
    }
    
    public Bill saveBill(Bill bill) {
        return billRepository.save(bill);
    }
    
    public void deleteBill(Long id) {
        billRepository.deleteById(id);
    }
}
