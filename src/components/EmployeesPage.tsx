import { useState, useEffect, useCallback } from 'react'
import type { FormEvent } from 'react'
import TopHeader from './shared/TopHeader'
import '../styles/EmployeesPage.css'

/* ─── API Base ───────────────────────────────────────── */
const API = '/api'

/* ─── Types ──────────────────────────────────────────── */
interface Employee {
  id: number
  name: string
  role: string
  department: string
  company: string   // company code, e.g. "365F"
  status: string    // "active" | "inactive"
  sinceYear: number
  salary: number
}

interface CompanyStat {
  code: string
  name: string
  color: string
  description: string
  total: number
  active: number
}

interface Company {
  id: number
  name: string
  code: string
  color: string
  description: string
}

type EmployeeForm = Omit<Employee, 'id'>

const EMPTY_FORM: EmployeeForm = {
  name: '',
  role: '',
  department: '',
  company: '',
  status: 'active',
  sinceYear: new Date().getFullYear(),
  salary: 0,
}

/* ─── SVG helper ─────────────────────────────────────── */
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

/* ─── Helpers ────────────────────────────────────────── */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function avatarBg(color: string): string {
  // Slightly more opaque version
  return color + '30'
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */
export default function EmployeesPage() {
  /* ── State ─────────────────────────────────────── */
  const [employees, setEmployees] = useState<Employee[]>([])
  const [stats, setStats] = useState<CompanyStat[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [filter, setFilter] = useState<string>('') // '' = all
  const [filterOpen, setFilterOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  /* ── Data fetching ─────────────────────────────── */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const [empRes, statsRes, compRes] = await Promise.all([
        fetch(`${API}/employees${filter ? `?company=${filter}` : ''}`, { credentials: 'include' }),
        fetch(`${API}/employees/stats`, { credentials: 'include' }),
        fetch(`${API}/companies`, { credentials: 'include' }),
      ])
      if (!empRes.ok || !statsRes.ok || !compRes.ok) throw new Error('Failed to fetch data')
      const [empData, statsData, compData] = await Promise.all([
        empRes.json(),
        statsRes.json(),
        compRes.json(),
      ])
      setEmployees(empData)
      setStats(statsData)
      setCompanies(compData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error — is the backend running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    const init = async () => {
      await fetchAll()
    }
    init()
  }, [fetchAll])

  /* ── Totals ────────────────────────────────────── */
  const totalEmployees = stats.reduce((s, c) => s + c.total, 0)

  /* ── CRUD helpers ──────────────────────────────── */
  const openAddModal = () => {
    setEditingId(null)
    setForm({ ...EMPTY_FORM, company: companies[0]?.code ?? '' })
    setModalOpen(true)
  }

  const openEditModal = (emp: Employee) => {
    setEditingId(emp.id)
    setForm({
      name: emp.name,
      role: emp.role,
      department: emp.department,
      company: emp.company,
      status: emp.status,
      sinceYear: emp.sinceYear,
      salary: emp.salary,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingId
        ? `${API}/employees/${editingId}`
        : `${API}/employees`
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Save failed')
      closeModal()
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this employee?')) return
    try {
      const res = await fetch(`${API}/employees/${id}`, { method: 'DELETE', credentials: 'include' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  /* ── Group employees by company for display ──── */
  const grouped: Record<string, Employee[]> = {}
  
  // Only show companies that match the filter (or all if no filter)
  const companiesToShow = filter ? companies.filter(c => c.code === filter) : companies;
  for (const c of companiesToShow) {
    grouped[c.code] = []
  }
  
  for (const emp of employees) {
    if (!grouped[emp.company]) grouped[emp.company] = []
    grouped[emp.company].push(emp)
  }

  const getCompanyColor = (code: string) => stats.find(s => s.code === code)?.color ?? '#60a5fa'
  const getCompanyName = (code: string) => stats.find(s => s.code === code)?.name ?? code
  const getCompanyDesc = (code: string) => stats.find(s => s.code === code)?.description ?? ''

  /* ── Filter label ──────────────────────────────── */
  const filterLabel = filter
    ? stats.find(s => s.code === filter)?.name ?? filter
    : 'All Companies'

  /* ═══════════════════════════════════════════════ */
  return (
    <div className="employees-page" id="employees-page">
      {/* ── Top Header Bar ─────────────────────────── */}
      <TopHeader
        className="ep-header"
        leftContent={
          <button
            className="ep-company-dropdown"
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            All Companies
            <Ico size={13}>
              <path d="M6 9l6 6 6-6" />
            </Ico>
          </button>
        }
        rightContent={
          <>
            <button className="ep-add-entry-btn" type="button" onClick={openAddModal}>
              <Ico size={14}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </Ico>
              Add Entry
            </button>

            <button className="ep-icon-btn" type="button" title="Toggle theme">
              <Ico size={16}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </Ico>
            </button>
          </>
        }
      />

      {/* ── Body ───────────────────────────────────── */}
      <div className="ep-body">
        {/* Title Row */}
        <div className="ep-title-row">
          <div className="ep-title-text">
            <h1>Employees</h1>
            <p>
              {totalEmployees} team member{totalEmployees !== 1 ? 's' : ''} across {stats.length} compan{stats.length !== 1 ? 'ies' : 'y'}
            </p>
          </div>
          <div className="ep-title-actions">
            {/* Company filter */}
            <div className="ep-filter-dropdown-wrap">
              <button
                className="ep-filter-btn"
                type="button"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                {filterLabel}
                <Ico size={13}>
                  <path d="M6 9l6 6 6-6" />
                </Ico>
              </button>
              {filterOpen && (
                <div className="ep-filter-dropdown">
                  <button
                    type="button"
                    className={filter === '' ? 'is-selected' : ''}
                    onClick={() => { setFilter(''); setFilterOpen(false) }}
                  >
                    All Companies
                  </button>
                  {stats.map(s => (
                    <button
                      key={s.code}
                      type="button"
                      className={filter === s.code ? 'is-selected' : ''}
                      onClick={() => { setFilter(s.code); setFilterOpen(false) }}
                    >
                      <span className="ep-filter-dot" style={{ background: s.color }} />
                      {s.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="ep-add-btn" type="button" onClick={openAddModal}>
              <Ico size={14}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </Ico>
              Add Employee
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="ep-error">
            <Ico size={18}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </Ico>
            {error}
            <button className="ep-error-dismiss" type="button" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="ep-loading">
            <div className="ep-spinner" />
            Loading employees…
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="ep-summary-grid">
              {stats.map(s => (
                <div className="ep-summary-card" key={s.code}>
                  <div className="ep-summary-label">
                    <span className="ep-summary-dot" style={{ background: s.color }} />
                    {s.code}
                  </div>
                  <div className="ep-summary-count">{s.total}</div>
                  <div className="ep-summary-active">{s.active} active</div>
                </div>
              ))}
            </div>

            {/* Employee Sections */}
            {Object.keys(grouped).length === 0 ? (
              <div className="ep-empty">
                <Ico size={48}>
                  <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
                  <circle cx="9" cy="7" r="3" />
                  <path d="M22 19v-1a4 4 0 0 0-3-3.85M16 4.13a4 4 0 0 1 0 7.75" />
                </Ico>
                <p>No companies or employees found.</p>
              </div>
            ) : (
              Object.entries(grouped).map(([code, emps]) => (
                <div className="ep-company-section" key={code}>
                  <div className="ep-company-section-header">
                    <span
                      className="ep-company-dot"
                      style={{ background: getCompanyColor(code) }}
                    />
                    <span className="ep-company-name">{getCompanyName(code)}</span>
                    <span className="ep-company-desc">
                      · {getCompanyDesc(code)}
                    </span>
                    <span className="ep-company-count">
                      {emps.length} employee{emps.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {emps.map((emp, i) => (
                    <div
                      className="ep-employee-row"
                      key={emp.id}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <div
                        className="ep-avatar"
                        style={{
                          background: avatarBg(getCompanyColor(emp.company)),
                          color: getCompanyColor(emp.company),
                        }}
                      >
                        {getInitials(emp.name)}
                      </div>

                      <div className="ep-employee-info">
                        <div className="ep-employee-name-row">
                          <span className="ep-employee-name">{emp.name}</span>
                          <span className={`ep-status-badge status-${emp.status}`}>
                            {emp.status}
                          </span>
                        </div>
                        <div className="ep-employee-meta">
                          <Ico size={12}>
                            <rect x="2" y="7" width="20" height="14" rx="2" />
                            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                          </Ico>
                          {emp.role}
                          <span className="ep-meta-separator">·</span>
                          <Ico size={12}>
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
                          </Ico>
                          {emp.department}
                        </div>
                      </div>

                      <div className="ep-employee-salary">
                        {emp.salary > 0 ? emp.salary.toLocaleString() : '0'}
                      </div>

                      <div className="ep-employee-since">
                        <span className="ep-since-label">Since</span>
                        <span className="ep-since-year">{emp.sinceYear}</span>
                      </div>

                      <div className="ep-employee-actions">
                        <button
                          className="ep-action-btn"
                          type="button"
                          title="Edit"
                          onClick={() => openEditModal(emp)}
                        >
                          <Ico size={16}>
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                          </Ico>
                        </button>
                        <button
                          className="ep-action-btn action-delete"
                          type="button"
                          title="Delete"
                          onClick={() => handleDelete(emp.id)}
                        >
                          <Ico size={16}>
                            <path d="M3 6h18" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </Ico>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </>
        )}
      </div>

      {/* ── Add / Edit Modal ────────────────────────── */}
      {modalOpen && (
        <div className="ep-modal-overlay" onClick={closeModal}>
          <div className="ep-modal" onClick={e => e.stopPropagation()}>
            <div className="ep-modal-header">
              <h2>{editingId ? 'Edit Employee' : 'Add Employee'}</h2>
              <button className="ep-modal-close" type="button" onClick={closeModal}>
                <Ico size={18}>
                  <path d="M18 6 6 18M6 6l12 12" />
                </Ico>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="ep-modal-body">
                {/* Name */}
                <div className="ep-form-group">
                  <label>Full Name <span className="ep-required">*</span></label>
                  <input
                    className="ep-form-input"
                    type="text"
                    placeholder="e.g. Ashraf Hossain"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Role & Department */}
                <div className="ep-form-row">
                  <div className="ep-form-group">
                    <label>Role <span className="ep-required">*</span></label>
                    <input
                      className="ep-form-input"
                      type="text"
                      placeholder="e.g. COO, Developer"
                      required
                      value={form.role}
                      onChange={e => setForm({ ...form, role: e.target.value })}
                    />
                  </div>
                  <div className="ep-form-group">
                    <label>Department</label>
                    <input
                      className="ep-form-input"
                      type="text"
                      placeholder="e.g. Engineering"
                      value={form.department}
                      onChange={e => setForm({ ...form, department: e.target.value })}
                    />
                  </div>
                </div>

                {/* Company & Status */}
                <div className="ep-form-row">
                  <div className="ep-form-group">
                    <label>Company <span className="ep-required">*</span></label>
                    <select
                      className="ep-form-select"
                      required
                      value={form.company}
                      onChange={e => setForm({ ...form, company: e.target.value })}
                    >
                      <option value="" disabled>Select company</option>
                      {companies.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="ep-form-group">
                    <label>Status</label>
                    <select
                      className="ep-form-select"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Since Year & Salary */}
                <div className="ep-form-row">
                  <div className="ep-form-group">
                    <label>Since Year <span className="ep-required">*</span></label>
                    <input
                      className="ep-form-input"
                      type="number"
                      min="2000"
                      max="2030"
                      required
                      value={form.sinceYear}
                      onChange={e => setForm({ ...form, sinceYear: parseInt(e.target.value) || 2025 })}
                    />
                  </div>
                  <div className="ep-form-group">
                    <label>Salary</label>
                    <input
                      className="ep-form-input"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={form.salary}
                      onChange={e => setForm({ ...form, salary: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="ep-modal-footer">
                <button className="ep-btn-cancel" type="button" onClick={closeModal}>
                  Cancel
                </button>
                <button className="ep-btn-save" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
