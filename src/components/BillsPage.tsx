import { useState, useEffect } from 'react'
import TopHeader from './shared/TopHeader'
import '../styles/BillsPage.css'
import '../styles/GlobalEntryPage.css'

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

interface Bill {
  id: number
  companyCode: string
  vendor: string
  amount: number
  status: string
  dueDate: string
  dateCreated: string
  description: string
}

interface Company {
  id: number
  name: string
  code: string
  color: string
  description: string
}

/* ── Main Component ──────────────────────────────────────────── */
export default function BillsPage() {
  const [bills, setBills] = useState<Bill[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [companies, setCompanies] = useState<Company[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/bills', { credentials: 'include' }).then(r => r.json()),
      fetch('/api/companies', { credentials: 'include' }).then(r => r.json())
    ])
      .then(([billsData, companiesData]) => {
        setBills(billsData)
        setCompanies(companiesData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    companyCode: 'XSRS IT',
    vendor: '',
    amount: '',
    status: 'pending',
    dueDate: new Date().toISOString().split('T')[0],
    description: ''
  })
  const [formError, setFormError] = useState('')

  const handleSaveBill = async () => {
    setFormError('')
    try {
      const payload = {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : 0,
        dateCreated: new Date().toISOString().split('T')[0]
      }
      const res = await fetch('/api/bills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to save bill')
      
      // Refetch to ensure everything is synchronized
      const billsRes = await fetch('/api/bills', { credentials: 'include' })
      if (billsRes.ok) {
        const billsData = await billsRes.json()
        setBills(billsData)
      }

      setIsModalOpen(false)
      setFormData({
        companyCode: companies.length > 0 ? companies[0].code : 'XSRS IT', 
        vendor: '', amount: '',
        status: 'pending', dueDate: new Date().toISOString().split('T')[0], description: ''
      })
    } catch (err) {
      setFormError('An error occurred while saving the bill.')
    }
  }

  const SUMMARY = {
    pending: { amount: bills.filter(b => b.status?.toLowerCase() === 'pending').reduce((s, b) => s + b.amount, 0), count: bills.filter(b => b.status?.toLowerCase() === 'pending').length },
    overdue: { amount: bills.filter(b => b.status?.toLowerCase() === 'overdue').reduce((s, b) => s + b.amount, 0), count: bills.filter(b => b.status?.toLowerCase() === 'overdue').length },
    paid: { amount: bills.filter(b => b.status?.toLowerCase() === 'paid').reduce((s, b) => s + b.amount, 0), count: bills.filter(b => b.status?.toLowerCase() === 'paid').length },
  }

  const COMPANIES: CompanySummary[] = companies.map(c => ({
    code: c.code,
    color: c.color || '#60a5fa',
    label: 'unpaid',
    amount: bills.filter(b => b.companyCode === c.code && b.status?.toLowerCase() !== 'paid').reduce((s, b) => s + b.amount, 0)
  }))

  const filteredBills = bills.filter(b => {
    const matchStatus = statusFilter === 'all' || b.status?.toLowerCase() === statusFilter.toLowerCase();
    const matchCompany = companyFilter === 'All' || b.companyCode === companyFilter;
    return matchStatus && matchCompany;
  }).sort((a, b) => b.id - a.id); // Sort by ID descending so newest is at the top

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
      <TopHeader
        className="bp-header"
        leftContent={
          <select 
            id="bp-company-select" 
            className="bp-company-dropdown"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="All">All Companies</option>
            {COMPANIES.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        }
        rightContent={<></>}
      />

      {/* ── Main Content ── */}
      <main className="bp-content">
        {/* Title Row */}
        <div className="bp-title-row">
          <div className="bp-title-block">
            <h1>Bills</h1>
            <p className="bp-title-sub">
              {totalUnpaid.toFixed(2)} unpaid across {companyCount} companies
            </p>
          </div>
          <button id="bp-add-bill-top" className="bp-add-bill-btn" type="button" onClick={() => setIsModalOpen(true)}>
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
              <span className="bp-status-amount">BDT {SUMMARY.pending.amount.toFixed(2)}</span>
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
              <span className="bp-status-amount">BDT {SUMMARY.overdue.amount.toFixed(2)}</span>
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
              <span className="bp-status-amount">BDT {SUMMARY.paid.amount.toFixed(2)}</span>
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
              <span className="bp-company-amount">BDT {company.amount.toFixed(2)}</span>
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

          <select 
            id="bp-filter-company" 
            className="bp-filter-dropdown"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="All">All Companies</option>
            {COMPANIES.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>

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

          <span className="bp-results-count">{filteredBills.length} results</span>
        </section>

        {/* Bills Table / Empty State */}
        <section className="bp-table-card" aria-label="Bills list">
          {bills.length === 0 && !loading ? (
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
              <button id="bp-add-bill-empty" className="bp-empty-add-btn" type="button" onClick={() => setIsModalOpen(true)}>
                Add Bill
              </button>
            </div>
          ) : (
            <div className="bp-table-wrapper" style={{ padding: '1rem' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '2rem' }}>Loading bills...</div>
              ) : (
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                      <th style={{ padding: '0.5rem' }}>Company</th>
                      <th style={{ padding: '0.5rem' }}>Vendor</th>
                      <th style={{ padding: '0.5rem' }}>Amount</th>
                      <th style={{ padding: '0.5rem' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBills.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '0.5rem' }}>{b.companyCode}</td>
                        <td style={{ padding: '0.5rem' }}>{b.vendor}</td>
                        <td style={{ padding: '0.5rem' }}>BDT {Number(b.amount).toFixed(2)}</td>
                        <td style={{ padding: '0.5rem', textTransform: 'capitalize' }}>{b.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="ge-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ge-modal" onClick={e => e.stopPropagation()}>
            <div className="ge-modal-header">
              <h2>New Bill</h2>
              <button className="ge-modal-close" onClick={() => setIsModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="ge-modal-body">
              {formError && <div style={{color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '6px', marginBottom: '16px'}}>{formError}</div>}
              
              <div style={{display: 'flex', gap: '16px'}}>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Company</label>
                  <select className="ge-form-select" value={formData.companyCode} onChange={e => setFormData({...formData, companyCode: e.target.value})}>
                    {companies.length > 0 ? companies.map(c => <option key={c.code} value={c.code}>{c.code}</option>) : <option value="XSRS IT">XSRS IT</option>}
                  </select>
                </div>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Status</label>
                  <select className="ge-form-select" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="overdue">Overdue</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="ge-form-group">
                <label>Vendor</label>
                <input type="text" className="ge-form-input" value={formData.vendor} onChange={e => setFormData({...formData, vendor: e.target.value})} placeholder="Vendor Name" />
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Amount (BDT)</label>
                  <input type="number" className="ge-form-input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" step="0.01" />
                </div>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Due Date</label>
                  <input type="date" className="ge-form-input" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                </div>
              </div>

              <div className="ge-form-group">
                <label>Description</label>
                <input type="text" className="ge-form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Additional details..." />
              </div>

              <div className="ge-modal-footer">
                <button className="ge-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button className="ge-btn-save" onClick={handleSaveBill}>Save Bill</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
