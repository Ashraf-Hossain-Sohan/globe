import { useState, useEffect, useCallback } from 'react'
import type { FormEvent } from 'react'
import '../styles/OfficeTimePage.css'

/* ─── API Base ───────────────────────────────────────── */
const API = '/api'

/* ─── Types ──────────────────────────────────────────── */
interface AttendanceRecord {
  id: number
  employeeId: number
  employeeName: string
  company: string
  date: string        // "2026-07-25"
  clockIn: string | null  // "10:05:00"
  clockOut: string | null
  status: string      // present | late | absent | half-day
  notes: string | null
}

interface OfficeConfig {
  id: number
  company: string
  workStartTime: string   // "10:00:00"
  workEndTime: string
  gracePeriodMinutes: number
  workDays: string        // "1,2,3,4,5"
}

interface CompanyStat {
  code: string
  name: string
  color: string
  description: string
}

interface Employee {
  id: number
  name: string
  role: string
  department: string
  company: string
  status: string
}

interface ReportRow {
  employeeId: number
  employeeName: string
  role: string
  present: number
  late: number
  absent: number
  halfDay: number
  totalDays: number
  totalHours: number
}

interface EntryForm {
  employeeId: string
  date: string
  clockIn: string
  clockOut: string
  status: string
  notes: string
}

const EMPTY_FORM: EntryForm = {
  employeeId: '',
  date: new Date().toISOString().slice(0, 10),
  clockIn: '10:00',
  clockOut: '18:00',
  status: 'present',
  notes: '',
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

/* ─── SVG helper ─────────────────────────────────────── */
const Ico = ({ size = 16, children, className }: { size?: number; children: React.ReactNode; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>
)

/* ─── Helpers ────────────────────────────────────────── */
function fmtTime(t: string | null): string {
  if (!t) return '—'
  const [h, m] = t.split(':')
  const hr = parseInt(h)
  const ampm = hr >= 12 ? 'PM' : 'AM'
  return `${hr % 12 || 12}:${m} ${ampm}`
}

function getCalendarDays(year: number, month: number) {
  const first = new Date(year, month, 1)
  const last = new Date(year, month + 1, 0)
  const startDay = first.getDay() // 0=Sun
  const totalDays = last.getDate()

  const days: { date: Date; inMonth: boolean }[] = []

  // Previous month fill
  for (let i = startDay - 1; i >= 0; i--) {
    const d = new Date(year, month, -i)
    days.push({ date: d, inMonth: false })
  }

  // Current month
  for (let d = 1; d <= totalDays; d++) {
    days.push({ date: new Date(year, month, d), inMonth: true })
  }

  // Next month fill to complete 6 rows
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({ date: new Date(year, month + 1, d), inMonth: false })
  }

  return days
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function isToday(d: Date): boolean {
  const t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}

function isWorkDay(d: Date, config: OfficeConfig | null): boolean {
  if (!config) return false
  // JS getDay: 0=Sun,1=Mon..6=Sat → config uses ISO: 1=Mon..7=Sun
  const jsDay = d.getDay()
  const isoDay = jsDay === 0 ? 7 : jsDay
  return config.workDays.split(',').map(Number).includes(isoDay)
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */
export default function OfficeTimePage() {
  /* ── State ─────────────────────────────────────── */
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth()) // 0-indexed
  const [company, setCompany] = useState('XSRS')
  const [companyOpen, setCompanyOpen] = useState(false)
  const [companies, setCompanies] = useState<CompanyStat[]>([])
  const [config, setConfig] = useState<OfficeConfig | null>(null)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [report, setReport] = useState<ReportRow[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Today's record for clock in/out
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null)

  // Modal
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EntryForm>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  /* ── Fetch data ────────────────────────────────── */
  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [compRes, configRes, attRes, reportRes, empRes] = await Promise.all([
        fetch(`${API}/employees/stats`),
        fetch(`${API}/office-config?company=${company}`),
        fetch(`${API}/attendance?company=${company}&year=${year}&month=${month + 1}`),
        fetch(`${API}/attendance/report?company=${company}&year=${year}&month=${month + 1}`),
        fetch(`${API}/employees?company=${company}`),
      ])

      if (!compRes.ok) throw new Error('Failed to fetch companies')
      const compData = await compRes.json()
      setCompanies(compData)

      if (configRes.ok) {
        setConfig(await configRes.json())
      } else {
        setConfig(null)
      }

      if (attRes.ok) setRecords(await attRes.json())
      if (reportRes.ok) setReport(await reportRes.json())
      if (empRes.ok) setEmployees(await empRes.json())

      // Find today's record for current user (first employee in company for now)
      const todayStr = dateKey(new Date())
      // We need to re-fetch to get latest records
      const freshAtt = await fetch(`${API}/attendance?company=${company}&year=${now.getFullYear()}&month=${now.getMonth() + 1}`)
      if (freshAtt.ok) {
        const freshData: AttendanceRecord[] = await freshAtt.json()
        setRecords(freshData)
        const todayRec = freshData.find(r => r.date === todayStr)
        setTodayRecord(todayRec ?? null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error — is the backend running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [company, year, month])

  useEffect(() => { fetchAll() }, [fetchAll])

  /* ── Calendar data ─────────────────────────────── */
  const calDays = getCalendarDays(year, month)
  const recordsByDate: Record<string, AttendanceRecord[]> = {}
  for (const r of records) {
    if (!recordsByDate[r.date]) recordsByDate[r.date] = []
    recordsByDate[r.date].push(r)
  }

  /* ── Nav handlers ──────────────────────────────── */
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }
  const goToday = () => { setYear(now.getFullYear()); setMonth(now.getMonth()) }

  /* ── Clock In/Out ──────────────────────────────── */
  const handleClockIn = async () => {
    if (employees.length === 0) {
      setError('No employees in this company. Add employees first.')
      return
    }
    try {
      const res = await fetch(`${API}/attendance/clock-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: employees[0].id, company }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Clock in failed')
        return
      }
      await fetchAll()
    } catch (err) {
      setError('Clock in failed')
    }
  }

  const handleClockOut = async () => {
    if (!todayRecord) return
    try {
      const res = await fetch(`${API}/attendance/clock-out/${todayRecord.id}`, { method: 'PUT' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Clock out failed')
        return
      }
      await fetchAll()
    } catch (err) {
      setError('Clock out failed')
    }
  }

  /* ── Modal CRUD ────────────────────────────────── */
  const openAddModal = (prefillDate?: string) => {
    setEditingId(null)
    setForm({
      ...EMPTY_FORM,
      date: prefillDate ?? new Date().toISOString().slice(0, 10),
      employeeId: employees.length > 0 ? String(employees[0].id) : '',
    })
    setModalOpen(true)
  }

  const openEditModal = (rec: AttendanceRecord) => {
    setEditingId(rec.id)
    setForm({
      employeeId: String(rec.employeeId),
      date: rec.date,
      clockIn: rec.clockIn?.slice(0, 5) ?? '',
      clockOut: rec.clockOut?.slice(0, 5) ?? '',
      status: rec.status,
      notes: rec.notes ?? '',
    })
    setModalOpen(true)
  }

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(EMPTY_FORM) }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const emp = employees.find(em => em.id === Number(form.employeeId))
      const payload = {
        employeeId: Number(form.employeeId),
        employeeName: emp?.name ?? 'Unknown',
        company,
        date: form.date,
        clockIn: form.clockIn ? form.clockIn + ':00' : null,
        clockOut: form.clockOut ? form.clockOut + ':00' : null,
        status: form.status,
        notes: form.notes || null,
      }

      const url = editingId ? `${API}/attendance/${editingId}` : `${API}/attendance`
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
    if (!confirm('Delete this attendance record?')) return
    try {
      const res = await fetch(`${API}/attendance/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchAll()
    } catch (err) {
      setError('Delete failed')
    }
  }

  /* ── CSV Export ─────────────────────────────────── */
  const exportCSV = () => {
    const companyName = companies.find(c => c.code === company)?.name ?? company
    const headers = ['Employee', 'Role', 'Present', 'Late', 'Absent', 'Half Day', 'Total Days', 'Total Hours']
    const rows = report.map(r => [
      r.employeeName, r.role, r.present, r.late, r.absent, r.halfDay, r.totalDays, r.totalHours
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-${companyName}-${year}-${month + 1}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* ── Derived ───────────────────────────────────── */
  const companyName = companies.find(c => c.code === company)?.name ?? company
  const gracePeriod = config?.gracePeriodMinutes ?? 5

  /* ═══════════════════════════════════════════════ */
  return (
    <div className="officetime-page" id="officetime-page">
      {/* ── Top Header Bar ─────────────────────────── */}
      <header className="ot-header">
        <button
          className="mobile-sidebar-toggle"
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar'))}
          aria-label="Toggle sidebar"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <button
          className="ot-company-dropdown"
          type="button"
        >
          {company === 'all' ? 'All Companies' : companyName}
          <Ico size={13}><path d="M6 9l6 6 6-6" /></Ico>
        </button>
        <div className="ot-header-actions">
          <button className="ot-add-entry-btn" type="button" onClick={() => openAddModal()}>
            <Ico size={14}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Ico>
            Add Entry
          </button>
          <button className="ot-icon-btn" type="button" title="Toggle theme">
            <Ico size={16}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></Ico>
          </button>
          <button className="ot-icon-btn" type="button" title="Notifications">
            <Ico size={16}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ico>
            <span className="ot-notification-dot" />
          </button>
          <div className="ot-header-user">
            <button className="ot-user-avatar-small" type="button" title="Profile">A</button>
            <Ico size={12}><path d="M6 9l6 6 6-6" /></Ico>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────── */}
      <div className="ot-body">
        {/* Title Row */}
        <div className="ot-title-row">
          <div className="ot-title-text">
            <h1>Office Time</h1>
            <p>Office hours calendar, clock in/out, and attendance requirements</p>
          </div>
          <div className="ot-title-actions">
            <div className="ot-company-select-wrap">
              <button className="ot-company-select-btn" type="button" onClick={() => setCompanyOpen(!companyOpen)}>
                {companyName}
                <Ico size={13}><path d="M6 9l6 6 6-6" /></Ico>
              </button>
              {companyOpen && (
                <div className="ot-company-dropdown-list">
                  {companies.map(c => (
                    <button key={c.code} type="button"
                      className={company === c.code ? 'is-selected' : ''}
                      onClick={() => { setCompany(c.code); setCompanyOpen(false) }}>
                      <span className="ot-filter-dot" style={{ background: c.color }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="ot-error">
            <Ico size={18}><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></Ico>
            {error}
            <button className="ot-error-dismiss" type="button" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {loading ? (
          <div className="ot-loading"><div className="ot-spinner" />Loading…</div>
        ) : (
          <>
            {/* Clock In/Out Card */}
            <div className="ot-clock-card">
              <div className="ot-clock-icon">
                <Ico size={20}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></Ico>
              </div>
              <div className="ot-clock-info">
                <h3>Clock in / Out</h3>
                {todayRecord ? (
                  <>
                    <p>{todayRecord.employeeName} — Clocked in at {fmtTime(todayRecord.clockIn)}</p>
                    {todayRecord.clockOut && (
                      <span className="ot-clock-time is-complete">
                        Clocked out at {fmtTime(todayRecord.clockOut)}
                      </span>
                    )}
                    {!todayRecord.clockOut && (
                      <span className="ot-clock-time">● Working…</span>
                    )}
                  </>
                ) : (
                  <p>No employee record linked to your account</p>
                )}
              </div>
              {!todayRecord ? (
                <button className="ot-clock-btn" type="button" onClick={handleClockIn}>
                  <Ico size={14}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></Ico>
                  Clock In
                </button>
              ) : !todayRecord.clockOut ? (
                <button className="ot-clock-btn is-out" type="button" onClick={handleClockOut}>
                  <Ico size={14}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></Ico>
                  Clock Out
                </button>
              ) : (
                <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>✓ Complete</span>
              )}
            </div>

            {/* Calendar */}
            <div className="ot-calendar">
              <div className="ot-cal-header">
                <Ico size={18}><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></Ico>
                <span className="ot-cal-month">{MONTH_NAMES[month]} {year}</span>
                <div className="ot-cal-nav">
                  <button className="ot-cal-nav-btn" type="button" onClick={prevMonth} title="Previous month">
                    <Ico size={14}><path d="M15 18l-6-6 6-6" /></Ico>
                  </button>
                  <button className="ot-cal-today-btn" type="button" onClick={goToday}>Today</button>
                  <button className="ot-cal-nav-btn" type="button" onClick={nextMonth} title="Next month">
                    <Ico size={14}><path d="M9 18l6-6-6-6" /></Ico>
                  </button>
                </div>
              </div>

              <div className="ot-cal-grid">
                {/* Day-of-week headers */}
                {DOW.map(d => <div key={d} className="ot-cal-dow">{d}</div>)}

                {/* Day cells */}
                {calDays.map((day, idx) => {
                  const dk = dateKey(day.date)
                  const entries = recordsByDate[dk] || []
                  const today = isToday(day.date)
                  const workDay = day.inMonth && isWorkDay(day.date, config)

                  return (
                    <div
                      key={idx}
                      className={`ot-cal-cell${!day.inMonth ? ' is-outside' : ''}${today ? ' is-today' : ''}`}
                      onClick={() => day.inMonth && openAddModal(dk)}
                    >
                      <span className="ot-cal-day">{day.date.getDate()}</span>
                      <span className="ot-cal-dash">—</span>

                      <div className="ot-cal-entries">
                        {entries.map(e => (
                          <div
                            key={e.id}
                            className={`ot-cal-entry status-${e.status}`}
                            title={`${e.employeeName}: ${fmtTime(e.clockIn)} – ${fmtTime(e.clockOut)}`}
                            onClick={(ev) => { ev.stopPropagation(); openEditModal(e) }}
                          >
                            {fmtTime(e.clockIn)} – {fmtTime(e.clockOut)}
                          </div>
                        ))}
                      </div>

                      {workDay && day.inMonth && (
                        <span className="ot-cal-must-come" onClick={(ev) => { ev.stopPropagation(); openAddModal(dk) }}>
                          + must come
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Attendance Report */}
            <div className="ot-report">
              <div className="ot-report-header">
                <div className="ot-report-icon">
                  <Ico size={18}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M8 13h8M8 17h8" /></Ico>
                </div>
                <div className="ot-report-title">
                  <h3>Attendance Report — {companyName}</h3>
                  <p>{MONTH_NAMES[month]} {year} · {employees.length} employees · grace period {gracePeriod}m</p>
                </div>
                <button className="ot-export-btn" type="button" onClick={exportCSV}>
                  <Ico size={14}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></Ico>
                  Export all (CSV)
                </button>
              </div>

              <div className="ot-report-table-wrap">
                {report.length === 0 ? (
                  <div className="ot-report-empty">No employees in this company yet.</div>
                ) : (
                  <table className="ot-report-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Present</th>
                        <th>Late</th>
                        <th>Absent</th>
                        <th>Half Day</th>
                        <th>Total Days</th>
                        <th>Total Hours</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.map(r => (
                        <tr key={r.employeeId}>
                          <td>
                            <div className="ot-report-name">{r.employeeName}</div>
                            <div className="ot-report-role">{r.role}</div>
                          </td>
                          <td><span className="ot-stat-badge stat-present">{r.present}</span></td>
                          <td><span className="ot-stat-badge stat-late">{r.late}</span></td>
                          <td><span className="ot-stat-badge stat-absent">{r.absent}</span></td>
                          <td><span className="ot-stat-badge stat-half">{r.halfDay}</span></td>
                          <td>{r.totalDays}</td>
                          <td>{r.totalHours}h</td>
                          <td>
                            <button className="ot-icon-btn" type="button" title="View details"
                              style={{ width: 28, height: 28 }}>
                              <Ico size={14}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></Ico>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Add / Edit Modal ──────────────────────────── */}
      {modalOpen && (
        <div className="ot-modal-overlay" onClick={closeModal}>
          <div className="ot-modal" onClick={e => e.stopPropagation()}>
            <div className="ot-modal-header">
              <h2>{editingId ? 'Edit Attendance' : 'Add Attendance Entry'}</h2>
              <button className="ot-modal-close" type="button" onClick={closeModal}>
                <Ico size={18}><path d="M18 6 6 18M6 6l12 12" /></Ico>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="ot-modal-body">
                {/* Employee */}
                <div className="ot-form-group">
                  <label>Employee <span className="ot-required">*</span></label>
                  <select className="ot-form-select" required
                    value={form.employeeId}
                    onChange={e => setForm({ ...form, employeeId: e.target.value })}>
                    <option value="" disabled>Select employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name} — {emp.role}</option>
                    ))}
                  </select>
                </div>

                {/* Date & Status */}
                <div className="ot-form-row">
                  <div className="ot-form-group">
                    <label>Date <span className="ot-required">*</span></label>
                    <input className="ot-form-input" type="date" required
                      value={form.date}
                      onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div className="ot-form-group">
                    <label>Status</label>
                    <select className="ot-form-select"
                      value={form.status}
                      onChange={e => setForm({ ...form, status: e.target.value })}>
                      <option value="present">Present</option>
                      <option value="late">Late</option>
                      <option value="absent">Absent</option>
                      <option value="half-day">Half Day</option>
                    </select>
                  </div>
                </div>

                {/* Clock In & Out */}
                <div className="ot-form-row">
                  <div className="ot-form-group">
                    <label>Clock In</label>
                    <input className="ot-form-input" type="time"
                      value={form.clockIn}
                      onChange={e => setForm({ ...form, clockIn: e.target.value })} />
                  </div>
                  <div className="ot-form-group">
                    <label>Clock Out</label>
                    <input className="ot-form-input" type="time"
                      value={form.clockOut}
                      onChange={e => setForm({ ...form, clockOut: e.target.value })} />
                  </div>
                </div>

                {/* Notes */}
                <div className="ot-form-group">
                  <label>Notes</label>
                  <input className="ot-form-input" type="text" placeholder="Optional notes…"
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })} />
                </div>
              </div>

              <div className="ot-modal-footer">
                {editingId && (
                  <button className="ot-btn-cancel" type="button"
                    style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}
                    onClick={() => { handleDelete(editingId); closeModal() }}>
                    Delete
                  </button>
                )}
                <div style={{ flex: 1 }} />
                <button className="ot-btn-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="ot-btn-save" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update' : 'Add Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
