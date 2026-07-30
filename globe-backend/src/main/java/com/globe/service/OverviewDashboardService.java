package com.globe.service;

import com.globe.model.GlobalEntry;
import com.globe.model.OverviewMetricsDTO;
import com.globe.repository.GlobalEntryRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OverviewDashboardService {

    private final GlobalEntryRepository globalEntryRepository;

    public OverviewDashboardService(GlobalEntryRepository globalEntryRepository) {
        this.globalEntryRepository = globalEntryRepository;
    }

    public OverviewMetricsDTO getGroupOverview(Integer months) {
        List<GlobalEntry> allEntriesFromDb = globalEntryRepository.findAll();
        
        LocalDate cutoffDate = null;
        if (months != null && months > 0) {
            cutoffDate = LocalDate.now().minusMonths(months).withDayOfMonth(1);
        }
        
        final LocalDate finalCutoff = cutoffDate;
        List<GlobalEntry> allEntries = allEntriesFromDb.stream()
                .filter(e -> finalCutoff == null || !e.getEntryDate().isBefore(finalCutoff))
                .collect(Collectors.toList());
        
        OverviewMetricsDTO dto = new OverviewMetricsDTO();
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal totalExpenses = BigDecimal.ZERO;
        
        // Group totals
        for (GlobalEntry entry : allEntries) {
            BigDecimal amt = entry.getAmount() != null ? entry.getAmount() : BigDecimal.ZERO;
            if ("Revenue".equalsIgnoreCase(entry.getCategory())) {
                totalRevenue = totalRevenue.add(amt);
            } else if ("Expense".equalsIgnoreCase(entry.getCategory())) {
                totalExpenses = totalExpenses.add(amt);
            }
        }
        
        BigDecimal netProfit = totalRevenue.subtract(totalExpenses);
        
        dto.setTotalRevenue(totalRevenue);
        dto.setTotalExpenses(totalExpenses);
        dto.setNetProfit(netProfit);
        
        String profitMargin = totalRevenue.compareTo(BigDecimal.ZERO) > 0 
                ? netProfit.divide(totalRevenue, 4, RoundingMode.HALF_UP).multiply(new BigDecimal("100")).setScale(1, RoundingMode.HALF_UP) + "%" 
                : "0.0%";
        dto.setProfitMargin(profitMargin);
        
        // Simulating Inventory, Accounts Payable, Working Capital based on expenses for demo
        dto.setInventoryValue(totalExpenses.multiply(new BigDecimal("1.5")));
        dto.setAccountsPayable(totalExpenses.multiply(new BigDecimal("0.3")));
        dto.setMonthlyBurnRate(totalExpenses.divide(new BigDecimal("6"), 2, RoundingMode.HALF_UP)); // assume 6 months data
        dto.setWorkingCapital(totalRevenue.subtract(dto.getAccountsPayable()));
        
        // Revenue & Cost By Company
        List<String> companies = Arrays.asList("XSRS IT", "365 Frames", "EverAfter", "PrintDesk");
        Map<String, String> companyColors = Map.of(
            "XSRS IT", "#3b82f6",
            "365 Frames", "#f97316",
            "EverAfter", "#ef4444",
            "PrintDesk", "#10b981"
        );
        Map<String, String> companyShortNames = Map.of(
            "XSRS IT", "XSRS",
            "365 Frames", "365F",
            "EverAfter", "EA",
            "PrintDesk", "PD"
        );
        
        List<OverviewMetricsDTO.RevenueByCompany> revByCompany = new ArrayList<>();
        List<OverviewMetricsDTO.PieChartData> costDist = new ArrayList<>();
        
        for (String comp : companies) {
            BigDecimal cRev = allEntries.stream()
                .filter(e -> comp.equals(e.getCompany()) && "Revenue".equalsIgnoreCase(e.getCategory()))
                .map(e -> e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            BigDecimal cExp = allEntries.stream()
                .filter(e -> comp.equals(e.getCompany()) && "Expense".equalsIgnoreCase(e.getCategory()))
                .map(e -> e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            revByCompany.add(new OverviewMetricsDTO.RevenueByCompany(companyShortNames.get(comp), cRev, cExp));
            if (cExp.compareTo(BigDecimal.ZERO) > 0) {
                costDist.add(new OverviewMetricsDTO.PieChartData(companyShortNames.get(comp), cExp, companyColors.get(comp)));
            }
        }
        
        dto.setRevenueByCompany(revByCompany);
        dto.setCostDistribution(costDist);
        
        // Monthly Trend (6 months)
        List<OverviewMetricsDTO.MonthlyTrend> monthlyData = new ArrayList<>();
        DateTimeFormatter monthFormatter = DateTimeFormatter.ofPattern("yyyy-MM");
        LocalDate now = LocalDate.now();
        
        for (int i = 5; i >= 0; i--) {
            LocalDate targetMonth = now.minusMonths(i);
            String monthStr = targetMonth.format(monthFormatter);
            
            BigDecimal mRev = allEntries.stream()
                .filter(e -> "Revenue".equalsIgnoreCase(e.getCategory()) && 
                             e.getEntryDate().getYear() == targetMonth.getYear() && 
                             e.getEntryDate().getMonthValue() == targetMonth.getMonthValue())
                .map(e -> e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            BigDecimal mExp = allEntries.stream()
                .filter(e -> "Expense".equalsIgnoreCase(e.getCategory()) && 
                             e.getEntryDate().getYear() == targetMonth.getYear() && 
                             e.getEntryDate().getMonthValue() == targetMonth.getMonthValue())
                .map(e -> e.getAmount() != null ? e.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
            monthlyData.add(new OverviewMetricsDTO.MonthlyTrend(monthStr, mRev, mExp, mRev.subtract(mExp)));
        }
        
        dto.setMonthlyTrend(monthlyData);
        
        // Recent Activity
        allEntries.sort(Comparator.comparing(GlobalEntry::getEntryDate).reversed());
        dto.setRecentActivity(allEntries.stream().limit(15).collect(Collectors.toList()));
        
        return dto;
    }
}
