import { useState } from 'react'
import './ExpensesPage.css'

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
type Status = 'paid' | 'pending' | 'overdue'

interface Expense {
  id: number
  company: string
  initials: string
  avatarBg: string
  avatarColor: string
  amount: string
  category: string
  date: string
  status: Status
}

const ALL_EXPENSES: Expense[] = [
  {
    id: 1,
    company: 'Nexus Corp',
    initials: 'NC',
    avatarBg: '#1e2f5c',
    avatarColor: '#60a5fa',
    amount: '$12,450.00',
    category: 'Hardware',
    date: '2023-10-24',
    status: 'paid',
  },
  {
    id: 2,
    company: 'Aether Global',
    initials: 'AG',
    avatarBg: '#1e3a2f',
    avatarColor: '#4ade80',
    amount: '$2,108.00',
    category: 'SaaS',
    date: '2023-10-23',
    status: 'pending',
  },
  {
    id: 3,
    company: 'Zenith Logistics',
    initials: 'ZL',
    avatarBg: '#2d1e5c',
    avatarColor: '#a78bfa',
    amount: '$45,000.00',
    category: 'Fleet Ops',
    date: '2023-10-22',
    status: 'paid',
  },
  {
    id: 4,
    company: 'Orbit Media',
    initials: 'OM',
    avatarBg: '#3a1e1e',
    avatarColor: '#f87171',
    amount: '$8,720.50',
    category: 'Marketing',
    date: '2023-10-21',
    status: 'pending',
  },
  {
    id: 5,
    company: 'Nexus Corp',
    initials: 'NC',
    avatarBg: '#1e2f5c',
    avatarColor: '#60a5fa',
    amount: '$315.00',
    category: 'Office Supplies',
    date: '2023-10-20',
    status: 'paid',
  },
  {
    id: 6,
    company: 'Zenith Logistics',
    initials: 'ZL',
    avatarBg: '#2d1e5c',
    avatarColor: '#a78bfa',
    amount: '$1,400.00',
    category: 'Insurance',
    date: '2023-10-19',
    status: 'paid',
  },
  {
    id: 7,
    company: 'Aether Global',
    initials: 'AG',
    avatarBg: '#1e3a2f',
    avatarColor: '#4ade80',
    amount: '$9,800.00',
    category: 'Cloud',
    date: '2023-10-18',
    status: 'overdue',
  },
  {
    id: 8,
    company: 'Orbit Media',
    initials: 'OM',
    avatarBg: '#3a1e1e',
    avatarColor: '#f87171',
    amount: '$3,250.00',
    category: 'Advertising',
    date: '2023-10-17',
    status: 'paid',
  },
  {
    id: 9,
    company: 'Nexus Corp',
    initials: 'NC',
    avatarBg: '#1e2f5c',
    avatarColor: '#60a5fa',
    amount: '$6,100.00',
    category: 'Hardware',
    date: '2023-10-16',
    status: 'pending',
  },
  {
    id: 10,
    company: 'Zenith Logistics',
    initials: 'ZL',
    avatarBg: '#2d1e5c',
    avatarColor: '#a78bfa',
    amount: '$22,000.00',
    category: 'Fleet Ops',
    date: '2023-10-15',
    status: 'paid',
  },
]

const PAGE_SIZE = 6
const TOTAL_ENTRIES = 245

/* ── Sub-components ──────────────────────────────────────────── */

function StatCard({
  label,
  value,
  badge,
  sub,
  iconColor,
  iconChildren,
}: {
  label: string
  value: string
  badge?: { text: string; direction: 'up' | 'down' }
  sub?: string
  iconColor: string
  iconChildren: React.ReactNode
}) {
  return (
    <div className="ep-stat-card">
      <div className="ep-stat-header">
        <span className="ep-stat-label">{label}</span>
        <span className={`ep-stat-icon ${iconColor}`}>
          <Ico>{iconChildren}</Ico>
        </span>
      </div>
      <div className="ep-stat-value">{value}</div>
      <div className="ep-stat-footer">
        {badge && (
          <span className={`ep-stat-badge ${badge.direction}`}>
            <Ico size={11}>
              {badge.direction === 'up' ? (
                <polyline points="18 15 12 9 6 15" />
              ) : (
                <polyline points="6 9 12 15 18 9" />
              )}
            </Ico>
            {badge.text}
          </span>
        )}
        {sub && <span className="ep-stat-sub">{sub}</span>}
      </div>
    </div>
  )
}

function BudgetCard({ ratio }: { ratio: number }) {
  return (
    <div className="ep-stat-card">
      <div className="ep-stat-header">
        <span className="ep-stat-label">Budget Ratio</span>
        <span className="ep-stat-icon teal">
          <Ico>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </Ico>
        </span>
      </div>
      <div className="ep-budget-ratio">{ratio}%</div>
      <div className="ep-ratio-bar">
        <div className="ep-ratio-fill" style={{ width: `${ratio}%` }} />
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const labels: Record<Status, string> = {
    paid: 'Paid',
    pending: 'Pending',
    overdue: 'Overdue',
  }
  return (
    <span className={`ep-status ${status}`}>
      <span className="ep-status-dot" />
      {labels[status]}
    </span>
  )
}

/* ── Main Component ──────────────────────────────────────────── */
export default function ExpensesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  const totalPages = 3

  const filtered = ALL_EXPENSES.filter(
    (e) =>
      e.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const startIdx = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <div className="expenses-page">
      {/* ── Top Header ── */}
      <header className="ep-header">
        <span className="ep-header-title">Group Manager</span>

        <div className="ep-search">
          <Ico>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </Ico>
          <input
            id="expenses-search"
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            aria-label="Search expenses"
          />
        </div>

        <div className="ep-header-actions">
          <button id="add-entry-btn" className="ep-add-btn" type="button">
            <Ico size={15}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Ico>
            Add Entry
          </button>

          <button id="notification-btn" className="ep-icon-btn" aria-label="Notifications" type="button">
            <Ico>
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </Ico>
          </button>

          <button id="help-btn" className="ep-icon-btn" aria-label="Help" type="button">
            <Ico>
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </Ico>
          </button>

          <div className="ep-avatar" role="img" aria-label="User avatar">A</div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="ep-content">

        {/* ── Stat Cards ── */}
        <section className="ep-stats" aria-label="Summary statistics">
          <StatCard
            label="Total Expenses"
            value="$284,592.40"
            badge={{ text: '+12.5%', direction: 'up' }}
            iconColor="blue"
            iconChildren={
              <>
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <path d="M12 8v8M14 10a2 2 0 0 0-2-1.5c-1.1 0-2 .7-2 1.5s.9 1.5 2 1.5 2 .7 2 1.5-.9 1.5-2 1.5a2 2 0 0 1-2-1.5" />
              </>
            }
          />
          <StatCard
            label="Pending Bills"
            value="$42,108.00"
            sub="14 Overdue"
            iconColor="red"
            iconChildren={
              <>
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
              </>
            }
          />
          <StatCard
            label="Companies Active"
            value="12"
            sub="Across 4 Regions"
            iconColor="purple"
            iconChildren={
              <>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </>
            }
          />
          <BudgetCard ratio={68} />
        </section>

        {/* ── Expenses Table ── */}
        <section className="ep-table-card" aria-label="Expenses table">
          <div className="ep-table-wrapper">
            <table className="ep-table">
              <thead>
                <tr>
                  <th scope="col">Company</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Category</th>
                  <th scope="col">Date</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((expense) => (
                  <tr key={expense.id}>
                    <td>
                      <div className="ep-company-cell">
                        <span
                          className="ep-company-avatar"
                          style={{
                            background: expense.avatarBg,
                            color: expense.avatarColor,
                          }}
                        >
                          {expense.initials}
                        </span>
                        <span className="ep-company-name">{expense.company}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ep-amount">{expense.amount}</span>
                    </td>
                    <td>
                      <span className="ep-category-badge">{expense.category}</span>
                    </td>
                    <td>
                      <span className="ep-date">{expense.date}</span>
                    </td>
                    <td>
                      <StatusBadge status={expense.status} />
                    </td>
                    <td>
                      <button
                        id={`actions-btn-${expense.id}`}
                        className="ep-action-btn"
                        type="button"
                        aria-label={`Actions for ${expense.company}`}
                      >
                        <Ico>
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </Ico>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Table Footer ── */}
          <div className="ep-table-footer">
            <span className="ep-count">
              Showing {startIdx + 1}-{Math.min(startIdx + PAGE_SIZE, TOTAL_ENTRIES)} of {TOTAL_ENTRIES} entries
            </span>
            <nav className="ep-pagination" aria-label="Table pagination">
              <button
                id="pagination-prev"
                className="ep-page-btn"
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <Ico size={14}>
                  <polyline points="15 18 9 12 15 6" />
                </Ico>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  id={`pagination-page-${page}`}
                  key={page}
                  className={`ep-page-btn${currentPage === page ? ' active' : ''}`}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              ))}

              <button
                id="pagination-next"
                className="ep-page-btn"
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <Ico size={14}>
                  <polyline points="9 18 15 12 9 6" />
                </Ico>
              </button>
            </nav>
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <section className="ep-filter-bar" aria-label="Filters">
          <span className="ep-filter-label">
            <Ico size={14}>
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="8" y1="12" x2="16" y2="12" />
              <line x1="12" y1="18" x2="12" y2="18" />
            </Ico>
            Filters
          </span>

          <div className="ep-filter-divider" />

          <button id="filter-companies" className="ep-filter-chip" type="button">
            All Companies
            <Ico size={13}>
              <polyline points="6 9 12 15 18 9" />
            </Ico>
          </button>

          <button id="filter-categories" className="ep-filter-chip" type="button">
            All Categories
            <Ico size={13}>
              <polyline points="6 9 12 15 18 9" />
            </Ico>
          </button>

          <div className="ep-date-chip">
            <Ico size={13}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </Ico>
            Oct 01 – Oct 31, 2023
          </div>

          <button id="export-btn" className="ep-export-btn" type="button">
            <Ico size={13}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </Ico>
            Export
          </button>
        </section>

      </main>
    </div>
  )
}
