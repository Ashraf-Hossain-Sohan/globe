package com.globe.config;

import com.globe.model.*;
import com.globe.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
@Order(3) // Ensure this runs after DataInitializer and DataSeeder
public class YearlyDataSeeder implements CommandLineRunner {

    private final ExpenseRepository expenseRepo;
    private final GlobalEntryRepository globalEntryRepo;
    private final InvoiceRepository invoiceRepo;
    private final BillRepository billRepo;
    private final InventoryRepository inventoryRepo;
    private final AttendanceRepository attendanceRepo;
    private final EmployeeRepository employeeRepo;
    private final CompanyRepository companyRepo;

    private final Random random = new Random();
    private final List<String> companies = Arrays.asList("XSRS", "365F", "EA", "PD");

    public YearlyDataSeeder(ExpenseRepository expenseRepo,
                            GlobalEntryRepository globalEntryRepo,
                            InvoiceRepository invoiceRepo,
                            BillRepository billRepo,
                            InventoryRepository inventoryRepo,
                            AttendanceRepository attendanceRepo,
                            EmployeeRepository employeeRepo,
                            CompanyRepository companyRepo) {
        this.expenseRepo = expenseRepo;
        this.globalEntryRepo = globalEntryRepo;
        this.invoiceRepo = invoiceRepo;
        this.billRepo = billRepo;
        this.inventoryRepo = inventoryRepo;
        this.attendanceRepo = attendanceRepo;
        this.employeeRepo = employeeRepo;
        this.companyRepo = companyRepo;
    }

    @Override
    public void run(String... args) {
        // Fix any existing global entries that were incorrectly seeded with company code instead of name
        // Also fix legacy categories (Payroll, Taxes, Misc, Operational Cost) to Expense
        for (String company : companies) {
            String companyName = companyRepo.findByCode(company).map(Company::getName).orElse(company);
            List<GlobalEntry> allEntriesForCompany = globalEntryRepo.findAll();
            boolean changed = false;
            
            for (GlobalEntry entry : allEntriesForCompany) {
                if (company.equals(entry.getCompany())) {
                    entry.setCompany(companyName);
                    changed = true;
                }
                
                String cat = entry.getCategory();
                if (cat != null && (cat.equalsIgnoreCase("Misc") || 
                                    cat.equalsIgnoreCase("Operational Cost") || 
                                    cat.equalsIgnoreCase("Payroll") || 
                                    cat.equalsIgnoreCase("Taxes"))) {
                    entry.setCategory("Expense");
                    changed = true;
                }
                
                // Rebalance amounts to ensure positive profit margin
                if (entry.getDescription() != null && !entry.getDescription().contains("[Rebalanced]")) {
                    if ("Expense".equalsIgnoreCase(entry.getCategory()) && entry.getAmount() != null) {
                         entry.setAmount(entry.getAmount().divide(new BigDecimal("4"), 2, RoundingMode.HALF_UP));
                         entry.setDescription(entry.getDescription() + " [Rebalanced]");
                         changed = true;
                    } else if ("Revenue".equalsIgnoreCase(entry.getCategory()) && entry.getAmount() != null) {
                         entry.setAmount(entry.getAmount().multiply(new BigDecimal("2")));
                         entry.setDescription(entry.getDescription() + " [Rebalanced]");
                         changed = true;
                    }
                }
            }
            
            if (changed) {
                globalEntryRepo.saveAll(allEntriesForCompany);
                System.out.println("✅ Fixed legacy Global Entries and rebalanced amounts");
            }
        }

        // Prevent duplicate seeding if data already exists
        if (expenseRepo.count() > 50) {
            System.out.println("✅ Historical yearly data already exists. Skipping YearlyDataSeeder.");
            return;
        }

        System.out.println("⏳ Starting YearlyDataSeeder (Generating 1 Year of Data for all companies)...");
        
        LocalDate startDate = LocalDate.of(2025, 8, 15);
        LocalDate endDate = LocalDate.of(2026, 8, 15);

        seedInventory();
        
        // Loop through the year day by day for Attendance
        List<Employee> employees = employeeRepo.findAll();
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            // Seed Attendance
            if (currentDate.getDayOfWeek().getValue() < 6) { // Weekdays only
                for (Employee emp : employees) {
                    AttendanceRecord record = new AttendanceRecord();
                    record.setEmployeeId(emp.getId());
                    record.setEmployeeName(emp.getName());
                    record.setCompany(emp.getCompany());
                    record.setDate(currentDate);
                    
                    // 90% chance present
                    if (random.nextDouble() < 0.90) {
                        record.setStatus("present");
                        record.setClockIn(LocalTime.of(9, 30).plusMinutes(random.nextInt(60)));
                        record.setClockOut(LocalTime.of(17, 30).plusMinutes(random.nextInt(120)));
                    } else if (random.nextDouble() < 0.95) {
                        record.setStatus("late");
                        record.setClockIn(LocalTime.of(10, 45).plusMinutes(random.nextInt(60)));
                        record.setClockOut(LocalTime.of(18, 0).plusMinutes(random.nextInt(60)));
                        record.setNotes("Traffic delay");
                    } else {
                        record.setStatus("absent");
                        record.setNotes("Sick leave");
                    }
                    attendanceRepo.save(record);
                }
            }
            currentDate = currentDate.plusDays(1);
        }

        // Generate monthly financial data
        for (String company : companies) {
            String companyName = companyRepo.findByCode(company).map(Company::getName).orElse(company);
            for (int month = 0; month < 12; month++) {
                LocalDate monthDate = startDate.plusMonths(month);
                
                // 10-15 Expenses per month per company
                int expenseCount = 10 + random.nextInt(6);
                for (int i = 0; i < expenseCount; i++) {
                    expenseRepo.save(createRandomExpense(company, monthDate));
                }

                // 20-30 Global Entries per month per company
                int globalCount = 20 + random.nextInt(11);
                for (int i = 0; i < globalCount; i++) {
                    globalEntryRepo.save(createRandomGlobalEntry(companyName, monthDate));
                }

                // 5-10 Invoices per month per company
                int invoiceCount = 5 + random.nextInt(6);
                for (int i = 0; i < invoiceCount; i++) {
                    invoiceRepo.save(createRandomInvoice(company, monthDate));
                }

                // 5-10 Bills per month per company
                int billCount = 5 + random.nextInt(6);
                for (int i = 0; i < billCount; i++) {
                    billRepo.save(createRandomBill(company, monthDate));
                }
            }
        }
        
        System.out.println("✅ YearlyDataSeeder Finished successfully.");
    }

    private void seedInventory() {
        List<String> categories = Arrays.asList("Electronics", "Furniture", "Supplies", "Software");
        List<String> conditions = Arrays.asList("New", "Used", "Refurbished");
        
        for (String company : companies) {
            for (int i = 1; i <= 25; i++) {
                InventoryItem item = new InventoryItem();
                item.setCompanyCode(company);
                item.setName(company + " Item " + i);
                item.setSubtitle("Details for item " + i);
                item.setUnitId("SKU-" + company + "-" + (1000 + i));
                item.setType(categories.get(random.nextInt(categories.size())));
                item.setCondition(conditions.get(random.nextInt(conditions.size())));
                item.setQty(random.nextInt(100) + 5);
                item.setThreshold(5);
                item.setCost(BigDecimal.valueOf(10 + random.nextDouble() * 500).setScale(2, RoundingMode.HALF_UP));
                inventoryRepo.save(item);
            }
        }
    }

    private Expense createRandomExpense(String company, LocalDate baseDate) {
        List<String> categories = Arrays.asList("Software", "Travel", "Meals", "Office Supplies", "Marketing");
        Expense exp = new Expense();
        exp.setCompanyCode(company);
        exp.setCategory(categories.get(random.nextInt(categories.size())));
        exp.setAmount(BigDecimal.valueOf(50 + random.nextDouble() * 950).setScale(2, RoundingMode.HALF_UP));
        exp.setDate(baseDate.plusDays(random.nextInt(28)));
        exp.setDescription("Monthly expense for " + exp.getCategory());
        exp.setApprovedBy("Admin");
        return exp;
    }

    private GlobalEntry createRandomGlobalEntry(String companyName, LocalDate baseDate) {
        List<String> categories = Arrays.asList("Revenue", "Expense");
        List<String> revTitles = Arrays.asList("Product Sales", "Consulting", "Subscriptions", "Licensing", "Support Services");
        List<String> expTitles = Arrays.asList("Software", "Travel", "Meals", "Office Supplies", "Marketing", "Payroll", "Cloud Hosting", "Legal");
        
        GlobalEntry entry = new GlobalEntry();
        entry.setCompany(companyName);
        entry.setCategory(categories.get(random.nextInt(categories.size())));
        
        if ("Revenue".equals(entry.getCategory())) {
            entry.setTitle(revTitles.get(random.nextInt(revTitles.size())));
        } else {
            entry.setTitle(expTitles.get(random.nextInt(expTitles.size())));
        }
        
        entry.setAmount(BigDecimal.valueOf(100 + random.nextDouble() * 5000).setScale(2, RoundingMode.HALF_UP));
        entry.setEntryDate(baseDate.plusDays(random.nextInt(28)));
        entry.setDescription("Auto-generated " + entry.getCategory());
        entry.setRecordedBy("System");
        return entry;
    }

    private Invoice createRandomInvoice(String company, LocalDate baseDate) {
        List<String> statuses = Arrays.asList("paid", "sent", "draft", "overdue");
        List<String> clients = Arrays.asList("Acme Corp", "TechNova", "GlobalReach", "AlphaSolutions");
        
        Invoice inv = new Invoice();
        inv.setCompanyCode(company);
        inv.setClientName(clients.get(random.nextInt(clients.size())));
        inv.setAmount(BigDecimal.valueOf(500 + random.nextDouble() * 4500).setScale(2, RoundingMode.HALF_UP));
        inv.setIssueDate(baseDate.plusDays(random.nextInt(15)));
        inv.setDueDate(inv.getIssueDate().plusDays(15 + random.nextInt(15)));
        inv.setStatus(statuses.get(random.nextInt(statuses.size())));
        return inv;
    }

    private Bill createRandomBill(String company, LocalDate baseDate) {
        List<String> statuses = Arrays.asList("paid", "pending", "overdue");
        List<String> vendors = Arrays.asList("Amazon AWS", "Office Depot", "WeWork", "Google Workspace");
        
        Bill bill = new Bill();
        bill.setCompanyCode(company);
        bill.setVendor(vendors.get(random.nextInt(vendors.size())));
        bill.setAmount(BigDecimal.valueOf(100 + random.nextDouble() * 2000).setScale(2, RoundingMode.HALF_UP));
        bill.setDateCreated(baseDate.plusDays(random.nextInt(15)));
        bill.setDueDate(bill.getDateCreated().plusDays(15 + random.nextInt(15)));
        bill.setStatus(statuses.get(random.nextInt(statuses.size())));
        bill.setDescription("Vendor bill for " + bill.getVendor());
        return bill;
    }
}
