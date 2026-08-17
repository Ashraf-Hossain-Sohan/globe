import React, { useState, useEffect } from 'react'
import TopHeader from './shared/TopHeader'
import '../styles/ExpensesPage.css'

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
  companyCode: string
  category: string
  amount: number
  date: string
  description?: string
  approvedBy?: string
}

const getInitials = (code: string) => code ? code.substring(0, 2).toUpperCase() : '?'
const getAvatarStyle = (code: string) => {
  const hash = Array.from(code || '').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const colors = [
    { bg: '#3b82f6', color: '#fff' },
    { bg: '#ef4444', color: '#fff' },
    { bg: '#10b981', color: '#fff' },
    { bg: '#f59e0b', color: '#fff' },
    { bg: '#8b5cf6', color: '#fff' },
  ]
  return colors[hash % colors.length]
}

const formatCurrency = (val: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
}

const PAGE_SIZE = 10

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
  const [companyFilter, setCompanyFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    fetch('/api/expenses', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        setExpenses(data)
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  const filtered = expenses.filter(
    (e) => {
      const matchSearch = (e.companyCode && e.companyCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (e.category && e.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchCompany = companyFilter === 'All' || e.companyCode === companyFilter;
      const matchCategory = categoryFilter === 'All' || e.category === categoryFilter;
      
      let matchStartDate = true;
      let matchEndDate = true;
      if (startDate && e.date) {
        matchStartDate = new Date(e.date) >= new Date(startDate);
      }
      if (endDate && e.date) {
        matchEndDate = new Date(e.date) <= new Date(endDate);
      }
      
      return matchSearch && matchCompany && matchCategory && matchStartDate && matchEndDate;
    }
  )

  const exportCSV = () => {
    const headers = ['Company', 'Category', 'Amount', 'Date', 'Description', 'Status']
    const rows = filtered.map(e => [
      `"${e.companyCode || ''}"`,
      `"${e.category || ''}"`,
      e.amount || 0,
      `"${e.date || ''}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`,
      `"paid"` // Assuming all are paid for now as per dashboard data
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `expenses-export.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  
  // Calculate dynamic date range for the chip
  let dateRangeText = "All Time"
  if (filtered.length > 0) {
    const dates = filtered.map(e => e.date).filter(Boolean).sort()
    if (dates.length > 0) {
      const minDate = new Date(dates[0]).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      const maxDate = new Date(dates[dates.length - 1]).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
      dateRangeText = minDate === maxDate ? minDate : `${minDate} - ${maxDate}`
    }
  }
  const pendingBills = 0 // Placeholder as status isn't available
  const pendingBillsCount = 0
  const activeCompaniesCount = new Set(expenses.map(e => e.companyCode)).size
  const budgetRatio = totalExpenses > 0 ? 68 : 0

  const totalEntries = filtered.length
  const totalPages = Math.ceil(totalEntries / PAGE_SIZE) || 1
  const startIdx = (currentPage - 1) * PAGE_SIZE
  const paginated = filtered.slice(startIdx, startIdx + PAGE_SIZE)

  return (
    <div className="expenses-page">
      {/* ── Top Header ── */}
      {/* ── Top Header ── */}
      <TopHeader
        className="ep-header"
        leftContent={
          <>
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
          </>
        }
        rightContent={<></>}
      />

      {/* ── Main Content ── */}
      <main className="ep-content">

        {/* ── Stat Cards ── */}
        <section className="ep-stats" aria-label="Summary statistics">
          <StatCard
            label="Total Expenses"
            value={formatCurrency(totalExpenses)}
            badge={totalExpenses > 0 ? { text: '+12.5%', direction: 'up' } : undefined}
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
            value={formatCurrency(pendingBills)}
            sub={`${pendingBillsCount} Overdue`}
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
            value={activeCompaniesCount.toString()}
            sub={`Across ${activeCompaniesCount > 0 ? 4 : 0} Regions`}
            iconColor="purple"
            iconChildren={
              <>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </>
            }
          />
          <BudgetCard ratio={budgetRatio} />
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
                            background: getAvatarStyle(expense.companyCode).bg,
                            color: getAvatarStyle(expense.companyCode).color,
                          }}
                        >
                          {getInitials(expense.companyCode)}
                        </span>
                        <span className="ep-company-name">{expense.companyCode}</span>
                      </div>
                    </td>
                    <td>
                      <span className="ep-amount">{formatCurrency(expense.amount)}</span>
                    </td>
                    <td>
                      <span className="ep-category-badge">{expense.category}</span>
                    </td>
                    <td>
                      <span className="ep-date">{expense.date}</span>
                    </td>
                    <td>
                      <StatusBadge status="paid" />
                    </td>
                    <td>
                      <button
                        id={`actions-btn-${expense.id}`}
                        className="ep-action-btn"
                        type="button"
                        aria-label={`Actions for ${expense.companyCode}`}
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
              Showing {totalEntries > 0 ? startIdx + 1 : 0}-{Math.min(startIdx + PAGE_SIZE, totalEntries)} of {totalEntries} entries
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

          <select 
            id="filter-companies" 
            className="ep-filter-chip" 
            value={companyFilter}
            onChange={(e) => { setCompanyFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Companies</option>
            {Array.from(new Set(expenses.map(e => e.companyCode).filter(Boolean))).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select 
            id="filter-categories" 
            className="ep-filter-chip"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="All">All Categories</option>
            {Array.from(new Set(expenses.map(e => e.category).filter(Boolean))).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="ep-date-chip" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ico size={13}>
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </Ico>
            <input 
              type="date" 
              value={startDate} 
              onChange={e => { setStartDate(e.target.value); setCurrentPage(1); }}
              style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', outline: 'none' }}
              aria-label="Start date"
            />
            <span>-</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={e => { setEndDate(e.target.value); setCurrentPage(1); }}
              style={{ background: 'transparent', border: 'none', color: 'inherit', fontSize: 'inherit', fontFamily: 'inherit', outline: 'none' }}
              aria-label="End date"
            />
            {(startDate || endDate) && (
              <button 
                type="button" 
                onClick={() => { setStartDate(''); setEndDate(''); setCurrentPage(1); }}
                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', marginLeft: '4px', padding: 0 }}
                title="Clear date filter"
              >
                <Ico size={12}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Ico>
              </button>
            )}
          </div>

          <button id="export-btn" className="ep-export-btn" type="button" onClick={exportCSV}>
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
