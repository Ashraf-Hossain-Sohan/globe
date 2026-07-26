import './ReportsPage.css'

/* ── Types ─────────────────────────────────────────────────────────────── */
type CompanyRow = {
  id: string
  name: string
  dotColor: string
  revenue: number
  expenses: number
}

type ReportItem = {
  id: string
  name: string
  desc: string
}

/* ── Data ───────────────────────────────────────────────────────────────── */
const companies: CompanyRow[] = [
  { id: 'xsrs', name: 'XSRS IT', dotColor: '#60a5fa', revenue: 10000, expenses: 1000 },
  { id: 'frames', name: '365 Frames', dotColor: '#fb923c', revenue: 0, expenses: 15000 },
  { id: 'everafter', name: 'EverAfter', dotColor: '#f87171', revenue: 0, expenses: 0 },
  { id: 'printdesk', name: 'PrintDesk', dotColor: '#4ade80', revenue: 0, expenses: 0 },
]

const reports: ReportItem[] = [
  { id: 'monthly', name: 'Monthly Financial Report', desc: 'P&L summary for current month' },
  { id: 'yearly', name: 'Yearly P&L', desc: 'Annual profit and loss statement' },
  { id: 'balance', name: 'Balance Sheet', desc: 'Assets, liabilities, and equity' },
  { id: 'cashflow', name: 'Cash Flow Statement', desc: 'Cash inflows and outflows' },
  { id: 'expense', name: 'Expense Breakdown', desc: 'Detailed expense categorization' },
  { id: 'revenue', name: 'Revenue Report', desc: 'Revenue by source and company' },
  { id: 'inventory', name: 'Inventory Valuation', desc: 'Current stock and asset values' },
  { id: 'tax', name: 'Tax Estimation', desc: 'Estimated tax obligations' },
]

/* ── Helpers ────────────────────────────────────────────────────────────── */
const fmt = (n: number) => {
  if (n === 0) return 'BDT 0'
  const abs = Math.abs(n)
  const suffix = abs >= 1000 ? `${(abs / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${abs}`
  return n < 0 ? `-BDT ${suffix}` : `BDT ${suffix}`
}

const margin = (revenue: number, expenses: number) => {
  const profit = revenue - expenses
  if (revenue === 0) return '0%'
  const m = ((profit / revenue) * 100).toFixed(1).replace(/\.0$/, '')
  return `${m}%`
}

/* ── SVG Icons ──────────────────────────────────────────────────────────── */
const IconDollar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
)

const IconTrendUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
)

const IconBuilding = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
)

const IconActivity = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const IconFile = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
    <path d="M14 3v5h5M8 13h8M8 17h8" />
  </svg>
)

const IconDownload = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
)

const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
)

/* ── Component ──────────────────────────────────────────────────────────── */
export default function ReportsPage() {
  const totalRevenue = companies.reduce((s, c) => s + c.revenue, 0)
  const totalExpenses = companies.reduce((s, c) => s + c.expenses, 0)
  const netProfit = totalRevenue - totalExpenses
  const companyCount = companies.length
  const transactionCount = companies.filter(c => c.revenue > 0 || c.expenses > 0).length

  const now = new Date()
  const monthLabel = now.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <main className="reports-page">
      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <header className="rp-header">
        <span className="rp-header-title">Reports</span>
        <div className="rp-header-actions">
          <button id="rp-grid-btn" type="button" className="rp-icon-btn" title="View">
            <IconGrid />
          </button>
          <div className="rp-avatar" title="Profile">A</div>
        </div>
      </header>

      {/* ── Scrollable Body ───────────────────────────────────────────────── */}
      <div className="rp-content">

        {/* Page heading */}
        <div className="rp-page-title">
          <h1>Reports</h1>
          <p>Generate and export financial statements</p>
        </div>

        {/* ── Stat Cards ──────────────────────────────────────────────────── */}
        <div className="rp-stats">
          <div className="rp-stat-card">
            <div className="rp-stat-left">
              <span className="rp-stat-label">Total Revenue</span>
              <span className="rp-stat-value">{fmt(totalRevenue)}</span>
            </div>
            <div className="rp-stat-icon blue"><IconDollar /></div>
          </div>

          <div className="rp-stat-card">
            <div className="rp-stat-left">
              <span className="rp-stat-label">Net Profit</span>
              <span className={`rp-stat-value${netProfit < 0 ? ' negative' : ''}`}>{fmt(netProfit)}</span>
            </div>
            <div className="rp-stat-icon green"><IconTrendUp /></div>
          </div>

          <div className="rp-stat-card">
            <div className="rp-stat-left">
              <span className="rp-stat-label">Companies</span>
              <span className="rp-stat-value">{companyCount}</span>
            </div>
            <div className="rp-stat-icon purple"><IconBuilding /></div>
          </div>

          <div className="rp-stat-card">
            <div className="rp-stat-left">
              <span className="rp-stat-label">Transactions</span>
              <span className="rp-stat-value">{transactionCount}</span>
            </div>
            <div className="rp-stat-icon teal"><IconActivity /></div>
          </div>
        </div>

        {/* ── Performance Table ───────────────────────────────────────────── */}
        <div className="rp-table-card">
          <div className="rp-table-card-header">
            <span className="rp-table-card-title">Company Performance Summary</span>
            <span className="rp-table-date-label">{monthLabel}</span>
          </div>
          <div className="rp-table-wrapper">
            <table className="rp-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Revenue</th>
                  <th>Expenses</th>
                  <th>Net Profit</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => {
                  const profit = c.revenue - c.expenses
                  const m = margin(c.revenue, c.expenses)
                  const mNeg = parseFloat(m) < 0
                  return (
                    <tr key={c.id}>
                      <td>
                        <div className="rp-company-cell">
                          <span className="rp-company-dot" style={{ background: c.dotColor }} />
                          <span className="rp-company-name">{c.name}</span>
                        </div>
                      </td>
                      <td><span className="rp-amount-green">{fmt(c.revenue)}</span></td>
                      <td><span className="rp-amount-red">{fmt(c.expenses)}</span></td>
                      <td>
                        <span className={profit < 0 ? 'rp-amount-red' : 'rp-amount-white'}>
                          {fmt(profit)}
                        </span>
                      </td>
                      <td>
                        <span className={mNeg ? 'rp-margin-negative' : 'rp-margin-positive'}>
                          {m}
                        </span>
                      </td>
                    </tr>
                  )
                })}

                {/* Group Total row */}
                <tr className="total-row">
                  <td>
                    <div className="rp-company-cell">
                      <span className="rp-company-name bold">Group Total</span>
                    </div>
                  </td>
                  <td><span className="rp-amount-green">{fmt(totalRevenue)}</span></td>
                  <td><span className="rp-amount-red">{fmt(totalExpenses)}</span></td>
                  <td>
                    <span className={netProfit < 0 ? 'rp-amount-red-bold' : 'rp-amount-white'}>
                      {fmt(netProfit)}
                    </span>
                  </td>
                  <td>
                    <span className={netProfit < 0 ? 'rp-margin-negative' : 'rp-margin-positive'}>
                      {margin(totalRevenue, totalExpenses)}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Available Reports ────────────────────────────────────────────── */}
        <div>
          <p className="rp-section-title">Available Reports</p>
          <div className="rp-reports-grid">
            {reports.map(r => (
              <div key={r.id} className="rp-report-card">
                <div className="rp-report-icon">
                  <IconFile />
                </div>
                <div className="rp-report-info">
                  <div className="rp-report-name">{r.name}</div>
                  <div className="rp-report-desc">{r.desc}</div>
                </div>
                <div className="rp-report-actions">
                  <button
                    id={`rp-excel-${r.id}`}
                    type="button"
                    className="rp-btn-excel"
                    title={`Download ${r.name} as Excel`}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                      <path d="M14 3v5h5" />
                      <path d="m9.5 14.5 5 5M14.5 14.5l-5 5" />
                    </svg>
                    Excel
                  </button>
                  <button
                    id={`rp-pdf-${r.id}`}
                    type="button"
                    className="rp-btn-pdf"
                    title={`Download ${r.name} as PDF`}
                  >
                    <IconDownload />
                    PDF
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  )
}
