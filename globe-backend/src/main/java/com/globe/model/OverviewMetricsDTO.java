package com.globe.model;

import java.math.BigDecimal;
import java.util.List;

public class OverviewMetricsDTO {
    private BigDecimal totalRevenue;
    private BigDecimal totalExpenses;
    private BigDecimal netProfit;
    private String profitMargin;
    private BigDecimal inventoryValue;
    private BigDecimal accountsPayable;
    private BigDecimal monthlyBurnRate;
    private BigDecimal workingCapital;

    private List<RevenueByCompany> revenueByCompany;
    private List<PieChartData> costDistribution;
    private List<MonthlyTrend> monthlyTrend;
    
    private List<GlobalEntry> recentActivity;

    public OverviewMetricsDTO() {}

    public BigDecimal getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

    public BigDecimal getTotalExpenses() { return totalExpenses; }
    public void setTotalExpenses(BigDecimal totalExpenses) { this.totalExpenses = totalExpenses; }

    public BigDecimal getNetProfit() { return netProfit; }
    public void setNetProfit(BigDecimal netProfit) { this.netProfit = netProfit; }

    public String getProfitMargin() { return profitMargin; }
    public void setProfitMargin(String profitMargin) { this.profitMargin = profitMargin; }

    public BigDecimal getInventoryValue() { return inventoryValue; }
    public void setInventoryValue(BigDecimal inventoryValue) { this.inventoryValue = inventoryValue; }

    public BigDecimal getAccountsPayable() { return accountsPayable; }
    public void setAccountsPayable(BigDecimal accountsPayable) { this.accountsPayable = accountsPayable; }

    public BigDecimal getMonthlyBurnRate() { return monthlyBurnRate; }
    public void setMonthlyBurnRate(BigDecimal monthlyBurnRate) { this.monthlyBurnRate = monthlyBurnRate; }

    public BigDecimal getWorkingCapital() { return workingCapital; }
    public void setWorkingCapital(BigDecimal workingCapital) { this.workingCapital = workingCapital; }

    private Double revenueTrend;
    private Double expenseTrend;
    private Double netProfitTrend;
    private Double profitMarginTrend;

    public Double getRevenueTrend() { return revenueTrend; }
    public void setRevenueTrend(Double revenueTrend) { this.revenueTrend = revenueTrend; }

    public Double getExpenseTrend() { return expenseTrend; }
    public void setExpenseTrend(Double expenseTrend) { this.expenseTrend = expenseTrend; }

    public Double getNetProfitTrend() { return netProfitTrend; }
    public void setNetProfitTrend(Double netProfitTrend) { this.netProfitTrend = netProfitTrend; }

    public Double getProfitMarginTrend() { return profitMarginTrend; }
    public void setProfitMarginTrend(Double profitMarginTrend) { this.profitMarginTrend = profitMarginTrend; }

    public List<RevenueByCompany> getRevenueByCompany() { return revenueByCompany; }
    public void setRevenueByCompany(List<RevenueByCompany> revenueByCompany) { this.revenueByCompany = revenueByCompany; }

    public List<PieChartData> getCostDistribution() { return costDistribution; }
    public void setCostDistribution(List<PieChartData> costDistribution) { this.costDistribution = costDistribution; }

    public List<MonthlyTrend> getMonthlyTrend() { return monthlyTrend; }
    public void setMonthlyTrend(List<MonthlyTrend> monthlyTrend) { this.monthlyTrend = monthlyTrend; }

    public List<GlobalEntry> getRecentActivity() { return recentActivity; }
    public void setRecentActivity(List<GlobalEntry> recentActivity) { this.recentActivity = recentActivity; }

    public static class RevenueByCompany {
        private String company;
        private BigDecimal revenue;
        private BigDecimal expenses;

        public RevenueByCompany(String company, BigDecimal revenue, BigDecimal expenses) {
            this.company = company;
            this.revenue = revenue;
            this.expenses = expenses;
        }

        public String getCompany() { return company; }
        public BigDecimal getRevenue() { return revenue; }
        public BigDecimal getExpenses() { return expenses; }
    }

    public static class PieChartData {
        private String name;
        private BigDecimal value;
        private String fill;
        
        public PieChartData(String name, BigDecimal value, String fill) {
            this.name = name;
            this.value = value;
            this.fill = fill;
        }

        public String getName() { return name; }
        public BigDecimal getValue() { return value; }
        public String getFill() { return fill; }
    }

    public static class MonthlyTrend {
        private String month;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal profit;

        public MonthlyTrend(String month, BigDecimal revenue, BigDecimal expenses, BigDecimal profit) {
            this.month = month;
            this.revenue = revenue;
            this.expenses = expenses;
            this.profit = profit;
        }

        public String getMonth() { return month; }
        public BigDecimal getRevenue() { return revenue; }
        public BigDecimal getExpenses() { return expenses; }
        public BigDecimal getProfit() { return profit; }
    }
}
