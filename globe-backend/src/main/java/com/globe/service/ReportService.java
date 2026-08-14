package com.globe.service;

import com.globe.repository.BillRepository;
import com.globe.repository.ExpenseRepository;
import com.globe.repository.InvoiceRepository;
import com.globe.repository.GlobalEntryRepository;
import com.globe.model.GlobalEntry;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {
    private final BillRepository billRepository;
    private final ExpenseRepository expenseRepository;
    private final InvoiceRepository invoiceRepository;
    private final GlobalEntryRepository globalEntryRepository;
    
    public ReportService(BillRepository billRepository, 
                         ExpenseRepository expenseRepository, 
                         InvoiceRepository invoiceRepository,
                         GlobalEntryRepository globalEntryRepository) {
        this.billRepository = billRepository;
        this.expenseRepository = expenseRepository;
        this.invoiceRepository = invoiceRepository;
        this.globalEntryRepository = globalEntryRepository;
    }
    
    public List<Map<String, Object>> getReportSummary(String companyCode) {
        List<Map<String, Object>> result = new ArrayList<>();
        String[] companies = {"365F", "XSRS", "EA", "PD"};
        String[] names = {"365 Frames", "XSRS IT", "EverAfter", "PrintDesk"};
        String[] colors = {"#fb923c", "#60a5fa", "#f87171", "#4ade80"};
        
        for (int i = 0; i < companies.length; i++) {
            List<GlobalEntry> entries = globalEntryRepository.findByCompany(names[i]);
            BigDecimal rev = BigDecimal.ZERO;
            BigDecimal exp = BigDecimal.ZERO;
            for (GlobalEntry e : entries) {
                if ("Revenue".equalsIgnoreCase(e.getCategory())) rev = rev.add(e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO);
                else if ("Expense".equalsIgnoreCase(e.getCategory())) exp = exp.add(e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO);
            }
            Map<String, Object> map = new HashMap<>();
            map.put("id", companies[i]);
            map.put("name", names[i]);
            map.put("dotColor", colors[i]);
            map.put("revenue", rev);
            map.put("expenses", exp);
            result.add(map);
        }
        return result;
    }
}
