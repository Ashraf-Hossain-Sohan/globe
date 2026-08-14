import '@testing-library/jest-dom';
import { vi } from 'vitest';

globalThis.fetch = vi.fn((url: string | URL | Request) => {
  const urlStr = url.toString();
  let mockData: unknown = []; // Default is array for endpoints like /employees, /attendance, /companies

  if (urlStr.includes('/api/audit-logs')) {
    // Both stats, filters, and logs can safely be {} or {content: []}
    mockData = { content: [], totalElements: 0, totalPages: 0, totalLogs: 0, users: [], actions: [] };
  } else if (urlStr.includes('/api/employees/stats')) {
    mockData = []; // EmployeesPage expects an array to reduce
  } else if (urlStr.includes('/api/dashboard/overview')) {
    // OverviewPage expects top-level numeric stats
    mockData = {
      totalRevenue: 0, totalExpenses: 0, netProfit: 0, profitMargin: '0%',
      inventoryValue: 0, accountsPayable: 0, monthlyBurnRate: 0, workingCapital: 0,
      revenueByCompany: [], costDistribution: [], monthlyTrend: [], recentActivity: []
    };
  } else if (urlStr.includes('/api/dashboard/')) {
    // CompanyDashboardPage expects revenueBySource etc.
    mockData = { 
      revenue: 0, netProfit: 0, burnRate: 0, grossProfit: 0, opex: 0, cogs: 0,
      profitMargin: '0%', roi: '0%',
      monthlyPerformance: [], profitTrend: [], revenueBySource: [], costBreakdown: [], recentTransactions: []
    };
  } else if (urlStr.includes('/office-config') || urlStr.includes('/config')) {
    // OfficeTimePage config
    mockData = { workDays: '1,2,3,4,5', workHoursStart: '09:00', workHoursEnd: '17:00' };
  } else if (urlStr.includes('/api/auth/me')) {
    mockData = { id: 1, name: 'Admin', email: 'admin@globe.com' };
  } else if (urlStr.includes('/api/companies')) {
    // Array of companies
    mockData = [{ id: 1, name: 'Test Co', code: 'TST' }];
  }

  return Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockData),
  });
}) as unknown as typeof fetch;
