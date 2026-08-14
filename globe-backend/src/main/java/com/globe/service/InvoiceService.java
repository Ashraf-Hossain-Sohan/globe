package com.globe.service;

import com.globe.model.Invoice;
import com.globe.repository.InvoiceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;
    
    public InvoiceService(InvoiceRepository invoiceRepository) {
        this.invoiceRepository = invoiceRepository;
    }
    
    public List<Invoice> getAllInvoices() { return invoiceRepository.findAll(); }
    public List<Invoice> getInvoicesByCompany(String companyCode) { return invoiceRepository.findByCompanyCode(companyCode); }
    public Invoice saveInvoice(Invoice invoice) { return invoiceRepository.save(invoice); }
    public void deleteInvoice(Long id) { invoiceRepository.deleteById(id); }
}
