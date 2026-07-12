import { useState } from 'react'
import './BillsPage.css'

/* ── SVG icon helper ─────────────────────────────────────────── */
const Ico = ({
  size = 16,
  children,
  className,
}: {
  size?: number
  children: React.ReactNode
  className?: string
}) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
)

/* ── Data ────────────────────────────────────────────────────── */
type StatusFilter = 'all' | 'pending' | 'overdue' | 'paid'

interface CompanySummary {
  code: string
  color: string
  amount: number
  label: string
}

const COMPANIES: CompanySummary[] = [
  { code: 'XSRS', color: '#60a5fa', amount: 0, label: 'unpaid' },
  { code: '365F', color: '#fb923c', amount: 0, label: 'unpaid' },
  { code: 'EA', color: '#f87171', amount: 0, label: 'unpaid' },
  { code: 'PD', color: '#4ade80', amount: 0, label: 'unpaid' },
]

const SUMMARY = {
  pending: { amount: 0, count: 0 },
  overdue: { amount: 0, count: 0 },
  paid: { amount: 0, count: 0 },
}

/* ── Main Component ──────────────────────────────────────────── */
export default function BillsPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const totalUnpaid = COMPANIES.reduce((s, c) => s + c.amount, 0)
  const companyCount = COMPANIES.length

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Overdue', value: 'overdue' },
    { label: 'Paid', value: 'paid' },
  ]

  return (
    <div className="bills-page">
      {/* ── Top Header ── */}
      <header className="bp-header">
        <button id="bp-company-select" className="bp-company-dropdown" type="button">
          All Companies
          <Ico size={13}>
            <polyline points="6 9 12 15 18 9" />
          </Ico>
        </button>

        <div className="bp-header-actions">
          <button id="bp-add-entry" className="bp-add-entry-btn" type="button">
            <Ico size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Ico>
            Add Entry
          </button>

          <button id="bp-theme-btn" className="bp-icon-btn" aria-label="Toggle theme" type="button">
            <Ico>
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </Ico>
          </button>

          <button id="bp-notif-btn" className="bp-icon-btn has-badge" aria-label="Notifications" type="button">
            <Ico>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </Ico>
            <span className="bp-notif-dot" />
          </button>

          <div className="bp-avatar" role="img" aria-label="User avatar">A</div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="bp-content">
        {/* Title Row */}
        <div className="bp-title-row">
          <div className="bp-title-block">
            <h1>Bills</h1>
            <p className="bp-title-sub">
              {totalUnpaid} unpaid across {companyCount} companies
            </p>
          </div>
          <button id="bp-add-bill-top" className="bp-add-bill-btn" type="button">
            <Ico size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Ico>
            Add Bill
          </button>
        </div>

        {/* Status Summary Cards */}
        <section className="bp-status-cards" aria-label="Bills summary">
          {/* Pending */}
          <div className="bp-status-card pending">
            <div className="bp-status-icon pending-icon">
              <Ico size={22}>
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </Ico>
            </div>
            <div className="bp-status-info">
              <span className="bp-status-label">Pending</span>
              <span className="bp-status-amount">BDT {SUMMARY.pending.amount}</span>
              <span className="bp-status-count">{SUMMARY.pending.count} bills</span>
            </div>
          </div>

          {/* Overdue */}
          <div className="bp-status-card overdue">
            <div className="bp-status-icon overdue-icon">
              <Ico size={22}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </Ico>
            </div>
            <div className="bp-status-info">
              <span className="bp-status-label">Overdue</span>
              <span className="bp-status-amount">BDT {SUMMARY.overdue.amount}</span>
              <span className="bp-status-count">{SUMMARY.overdue.count} bills</span>
            </div>
          </div>

          {/* Paid */}
          <div className="bp-status-card paid">
            <div className="bp-status-icon paid-icon">
              <Ico size={22}>
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </Ico>
            </div>
            <div className="bp-status-info">
              <span className="bp-status-label">Paid</span>
              <span className="bp-status-amount">BDT {SUMMARY.paid.amount}</span>
              <span className="bp-status-count">{SUMMARY.paid.count} bills</span>
            </div>
          </div>
        </section>

        {/* Company Summary Row */}
        <section className="bp-company-cards" aria-label="Company bills summary">
          {COMPANIES.map((company) => (
            <div key={company.code} className="bp-company-card">
              <div className="bp-company-card-header">
                <span className="bp-company-dot" style={{ background: company.color }} />
                <span className="bp-company-code">{company.code}</span>
              </div>
              <span className="bp-company-amount">BDT {company.amount}</span>
              <span className="bp-company-label">{company.label}</span>
            </div>
          ))}
        </section>

        {/* Filter Bar */}
        <section className="bp-filter-bar" aria-label="Bill filters">
          <button id="bp-filter-toggle" className="bp-filter-icon" type="button" aria-label="Filter">
            <Ico size={16}>
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </Ico>
          </button>

          <button id="bp-filter-company" className="bp-filter-dropdown" type="button">
            All Companies
            <Ico size={13}>
              <polyline points="6 9 12 15 18 9" />
            </Ico>
          </button>

          <div className="bp-filter-tabs">
            {tabs.map((tab) => (
              <button
                id={`bp-tab-${tab.value}`}
                key={tab.value}
                className={`bp-filter-tab${statusFilter === tab.value ? ' active' : ''}`}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <span className="bp-results-count">0 results</span>
        </section>

        {/* Bills Table / Empty State */}
        <section className="bp-table-card" aria-label="Bills list">
          <div className="bp-empty-state">
            <div className="bp-empty-icon">
              <Ico size={28}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </Ico>
            </div>
            <h3 className="bp-empty-title">No bills found</h3>
            <p className="bp-empty-desc">
              Adjust your filters or add a new bill to start tracking your company's expenses.
            </p>
            <button id="bp-add-bill-empty" className="bp-empty-add-btn" type="button">
              Add Bill
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
