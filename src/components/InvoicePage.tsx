import { useState } from 'react'
import '../styles/InvoicePage.css'

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
type StatusFilter = 'all' | 'draft' | 'sent' | 'paid' | 'cancelled'

const SUMMARY = {
  draft: { amount: 0, count: 0 },
  sent: { amount: 0, count: 0 },
  paid: { amount: 0, count: 0 },
  cancelled: { amount: 0, count: 0 },
}

/* ── Main Component ──────────────────────────────────────────── */
export default function InvoicePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="invoice-page">
      <main className="inv-content">
        {/* Title Row */}
        <div className="inv-title-row">
          <div className="inv-title-block">
            <h1>Invoices</h1>
            <p className="inv-title-sub">
              Create and manage invoices for your companies
            </p>
          </div>
          <button id="inv-new-btn" className="inv-new-btn" type="button">
            <Ico size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Ico>
            New Invoice
          </button>
        </div>

        {/* Status Summary Cards */}
        <section className="inv-status-cards" aria-label="Invoice summary">
          {/* Draft */}
          <div className="inv-status-card">
            <div className="inv-status-info">
              <span className="inv-status-label">Draft</span>
              <span className="inv-status-amount">BDT {SUMMARY.draft.amount.toFixed(2)}</span>
              <span className="inv-status-count">{SUMMARY.draft.count} invoices</span>
            </div>
          </div>

          {/* Sent */}
          <div className="inv-status-card">
            <div className="inv-status-info">
              <span className="inv-status-label">Sent</span>
              <span className="inv-status-amount">BDT {SUMMARY.sent.amount.toFixed(2)}</span>
              <span className="inv-status-count">{SUMMARY.sent.count} invoices</span>
            </div>
          </div>

          {/* Paid */}
          <div className="inv-status-card">
            <div className="inv-status-info">
              <span className="inv-status-label">Paid</span>
              <span className="inv-status-amount">BDT {SUMMARY.paid.amount.toFixed(2)}</span>
              <span className="inv-status-count">{SUMMARY.paid.count} invoices</span>
            </div>
          </div>

          {/* Cancelled */}
          <div className="inv-status-card">
            <div className="inv-status-info">
              <span className="inv-status-label">Cancelled</span>
              <span className="inv-status-amount">BDT {SUMMARY.cancelled.amount.toFixed(2)}</span>
              <span className="inv-status-count">{SUMMARY.cancelled.count} invoices</span>
            </div>
          </div>
        </section>

        {/* Filter Bar */}
        <section className="inv-filter-bar" aria-label="Invoice filters">
          <div className="inv-search-wrapper">
            <Ico size={14} className="inv-search-icon">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </Ico>
            <input
              type="text"
              className="inv-search-input"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button id="inv-filter-status" className="inv-filter-dropdown" type="button">
            <Ico size={14} className="inv-filter-icon">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </Ico>
            All Status
            <Ico size={14} className="inv-chevron-icon">
              <polyline points="6 9 12 15 18 9" />
            </Ico>
          </button>
        </section>

        {/* Invoices Table / Empty State */}
        <section className="inv-table-card" aria-label="Invoices list">
          <div className="inv-table-wrapper">
            <table className="inv-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Company</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="inv-empty-state">
            <p className="inv-empty-desc">
              No invoices found. Create your first invoice to get started.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
