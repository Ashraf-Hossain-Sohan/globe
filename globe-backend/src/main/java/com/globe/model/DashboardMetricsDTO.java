package com.globe.model;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardMetricsDTO {
    
    private BigDecimal revenue;
    private BigDecimal netProfit;
    private BigDecimal burnRate;
    private BigDecimal grossProfit;
    private BigDecimal opex;
    private BigDecimal cogs;
    
    private String profitMargin;
    private String roi;
    
    private List<ChartDataPoint> monthlyPerformance;
    private List<ChartDataPoint> profitTrend;
    private List<PieChartData> revenueBySource;
    private List<PieChartData> costBreakdown;
    
    private List<GlobalEntry> recentTransactions;

    // Constructors, Getters, and Setters
    public DashboardMetricsDTO() {}

    public BigDecimal getRevenue() { return revenue; }
    public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

    public BigDecimal getNetProfit() { return netProfit; }
    public void setNetProfit(BigDecimal netProfit) { this.netProfit = netProfit; }

    public BigDecimal getBurnRate() { return burnRate; }
    public void setBurnRate(BigDecimal burnRate) { this.burnRate = burnRate; }

    public BigDecimal getGrossProfit() { return grossProfit; }
    public void setGrossProfit(BigDecimal grossProfit) { this.grossProfit = grossProfit; }

    public BigDecimal getOpex() { return opex; }
    public void setOpex(BigDecimal opex) { this.opex = opex; }

    public BigDecimal getCogs() { return cogs; }
    public void setCogs(BigDecimal cogs) { this.cogs = cogs; }

    public String getProfitMargin() { return profitMargin; }
    public void setProfitMargin(String profitMargin) { this.profitMargin = profitMargin; }

    public String getRoi() { return roi; }
    public void setRoi(String roi) { this.roi = roi; }

    public List<ChartDataPoint> getMonthlyPerformance() { return monthlyPerformance; }
    public void setMonthlyPerformance(List<ChartDataPoint> monthlyPerformance) { this.monthlyPerformance = monthlyPerformance; }

    public List<ChartDataPoint> getProfitTrend() { return profitTrend; }
    public void setProfitTrend(List<ChartDataPoint> profitTrend) { this.profitTrend = profitTrend; }

    public List<PieChartData> getRevenueBySource() { return revenueBySource; }
    public void setRevenueBySource(List<PieChartData> revenueBySource) { this.revenueBySource = revenueBySource; }

    public List<PieChartData> getCostBreakdown() { return costBreakdown; }
    public void setCostBreakdown(List<PieChartData> costBreakdown) { this.costBreakdown = costBreakdown; }

    public List<GlobalEntry> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<GlobalEntry> recentTransactions) { this.recentTransactions = recentTransactions; }

    
    public static class ChartDataPoint {
        private String month;
        private BigDecimal revenue;
        private BigDecimal expenses;
        private BigDecimal netProfit;
        
        public ChartDataPoint(String month, BigDecimal revenue, BigDecimal expenses, BigDecimal netProfit) {
            this.month = month;
            this.revenue = revenue;
            this.expenses = expenses;
            this.netProfit = netProfit;
        }
        
        public String getMonth() { return month; }
        public BigDecimal getRevenue() { return revenue; }
        public BigDecimal getExpenses() { return expenses; }
        public BigDecimal getNetProfit() { return netProfit; }
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
}
