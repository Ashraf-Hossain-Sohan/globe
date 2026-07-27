import { useState, useEffect, useCallback } from 'react'
import type { FormEvent } from 'react'
import '../styles/UserAccessPage.css'

/* ─── API Base ───────────────────────────────────────── */
const API = 'http://localhost:8080/api'

/* ─── Types ──────────────────────────────────────────── */
interface UserAccess {
  id: number
  email: string
  role: string // "admin" | "editor" | "viewer"
  companyAccess: string // comma-separated e.g. "XSRS,365F"
}

interface Company {
  id: number
  name: string
  code: string
  color: string
}

interface EntryForm {
  email: string
  role: string
  companyAccess: Record<string, boolean> // map company code -> boolean
}

const EMPTY_FORM: EntryForm = {
  email: '',
  role: 'viewer',
  companyAccess: {},
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
function getInitials(email: string): string {
  return email.split('@')[0].substring(0, 2).toUpperCase()
}

/* ═══════════════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════════════ */
export default function UserAccessPage() {
  /* ── State ─────────────────────────────────────── */
  const [userAccessList, setUserAccessList] = useState<UserAccess[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      const [uaRes, compRes] = await Promise.all([
        fetch(`${API}/user-access`),
        fetch(`${API}/companies`),
      ])

      if (!uaRes.ok || !compRes.ok) throw new Error('Failed to fetch user access configuration')

      const [uaData, compData] = await Promise.all([
        uaRes.json(),
        compRes.json(),
      ])

      setUserAccessList(uaData)
      setCompanies(compData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection error — is the backend running on port 8080?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  /* ── Modal actions ─────────────────────────────── */
  const openAddModal = () => {
    setEditingId(null)
    const initialAccess: Record<string, boolean> = {}
    companies.forEach(c => {
      initialAccess[c.code] = false
    })
    setForm({
      email: '',
      role: 'viewer',
      companyAccess: initialAccess,
    })
    setModalOpen(true)
  }

  const openEditModal = (ua: UserAccess) => {
    setEditingId(ua.id)
    const accessMap: Record<string, boolean> = {}
    const accessibleCodes = ua.companyAccess ? ua.companyAccess.split(',') : []
    companies.forEach(c => {
      accessMap[c.code] = accessibleCodes.includes(c.code)
    })
    setForm({
      email: ua.email,
      role: ua.role,
      companyAccess: accessMap,
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
    setError(null)

    // Build company access string e.g. "XSRS,EA"
    const selectedCompanies = Object.entries(form.companyAccess)
      .filter(([_, enabled]) => enabled)
      .map(([code]) => code)
      .join(',')

    const payload = {
      email: form.email,
      role: form.role,
      companyAccess: selectedCompanies,
    }

    try {
      const url = editingId ? `${API}/user-access/${editingId}` : `${API}/user-access`
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errMsg = await res.text()
        throw new Error(errMsg || 'Failed to save user access rule')
      }

      closeModal()
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user access rule?')) return
    try {
      const res = await fetch(`${API}/user-access/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      await fetchAll()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    }
  }

  const toggleCompanyAccess = (code: string) => {
    setForm(prev => ({
      ...prev,
      companyAccess: {
        ...prev.companyAccess,
        [code]: !prev.companyAccess[code],
      },
    }))
  }

  /* ── Helpers ───────────────────────────────────── */
  const hasAccess = (companyAccessStr: string, companyCode: string): boolean => {
    if (!companyAccessStr) return false
    return companyAccessStr.split(',').includes(companyCode)
  }

  /* ═══════════════════════════════════════════════ */
  return (
    <div className="ua-page" id="ua-page">
      {/* ── Top Header ──────────────────────────────── */}
      <header className="ua-header">
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
        <button className="ua-company-dropdown" type="button">
          All Companies
          <Ico size={13}><path d="M6 9l6 6 6-6" /></Ico>
        </button>
        <div className="ua-header-actions">
          <button className="ua-add-entry-btn" type="button" onClick={openAddModal}>
            <Ico size={14}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Ico>
            Add Entry
          </button>
          <button className="ua-icon-btn" type="button" title="Toggle theme">
            <Ico size={16}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" /></Ico>
          </button>
          <button className="ua-icon-btn" type="button" title="Notifications">
            <Ico size={16}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></Ico>
            <span className="ua-notification-dot" />
          </button>
          <div className="ua-header-user">
            <button className="ua-user-avatar-small" type="button" title="Profile">A</button>
            <Ico size={12}><path d="M6 9l6 6 6-6" /></Ico>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────── */}
      <div className="ua-body">
        {/* Title Row */}
        <div className="ua-title-row">
          <div className="ua-title-text">
            <h1>User Management</h1>
            <p>Manage access control and permissions</p>
          </div>
          <button className="ua-add-btn" type="button" onClick={openAddModal}>
            <Ico size={14}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></Ico>
            Add User
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="ua-error">
            <Ico size={18}>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </Ico>
            {error}
            <button className="ua-error-dismiss" type="button" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Table/Content */}
        {loading ? (
          <div className="ua-loading">
            <div className="ua-spinner" />
            Loading configuration…
          </div>
        ) : (
          <div className="ua-table-wrap">
            {userAccessList.length === 0 ? (
              <div className="ua-empty">
                <Ico size={48}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></Ico>
                <p>No user access entries configured. Click "Add User" to create one.</p>
              </div>
            ) : (
              <table className="ua-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    {companies.map(c => (
                      <th key={c.code}>{c.code}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userAccessList.map(ua => (
                    <tr key={ua.id}>
                      <td>
                        <div className="ua-user-cell">
                          <div className="ua-avatar">
                            {getInitials(ua.email)}
                          </div>
                          <span className="ua-email" title={ua.email}>
                            {ua.email}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`ua-role-badge role-${ua.role.toLowerCase()}`}>
                          {ua.role}
                        </span>
                      </td>
                      {companies.map(c => (
                        <td key={c.code}>
                          {hasAccess(ua.companyAccess, c.code) ? (
                            <svg className="ua-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          ) : (
                            <svg className="ua-cross-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="ua-actions">
                          <button className="ua-action-btn" type="button" title="Edit Access" onClick={() => openEditModal(ua)}>
                            <Ico size={15}>
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" />
                            </Ico>
                          </button>
                          <button className="ua-action-btn action-delete" type="button" title="Remove User" onClick={() => handleDelete(ua.id)}>
                            <Ico size={15}>
                              <path d="M3 6h18" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </Ico>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ──────────────────────────── */}
      {modalOpen && (
        <div className="ua-modal-overlay" onClick={closeModal}>
          <div className="ua-modal" onClick={e => e.stopPropagation()}>
            <div className="ua-modal-header">
              <h2>{editingId ? 'Edit User Access' : 'Add User Access'}</h2>
              <button className="ua-modal-close" type="button" onClick={closeModal}>
                <Ico size={18}><path d="M18 6 6 18M6 6l12 12" /></Ico>
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="ua-modal-body">
                {/* Email */}
                <div className="ua-form-group">
                  <label>Email Address <span className="ua-required">*</span></label>
                  <input
                    className="ua-form-input"
                    type="email"
                    placeholder="e.g. user@company.com"
                    required
                    value={form.email}
                    onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                {/* Role */}
                <div className="ua-form-group">
                  <label>Role <span className="ua-required">*</span></label>
                  <select
                    className="ua-form-select"
                    required
                    value={form.role}
                    onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="editor">Editor (Write access)</option>
                    <option value="admin">Admin (Full Control)</option>
                  </select>
                </div>

                {/* Company Access Matrix */}
                <div className="ua-form-group">
                  <label>Company Access</label>
                  <div className="ua-access-matrix">
                    <div className="ua-matrix-header">Business Units</div>
                    <div className="ua-matrix-list">
                      {companies.map(c => (
                        <div className="ua-matrix-item" key={c.code}>
                          <div className="ua-matrix-info">
                            <span className="ua-matrix-name">{c.name}</span>
                            <span className="ua-matrix-code">Code: {c.code}</span>
                          </div>
                          <label className="ua-toggle">
                            <input
                              type="checkbox"
                              checked={!!form.companyAccess[c.code]}
                              onChange={() => toggleCompanyAccess(c.code)}
                            />
                            <span className="ua-slider" />
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ua-modal-footer">
                <button className="ua-btn-cancel" type="button" onClick={closeModal}>Cancel</button>
                <button className="ua-btn-save" type="submit" disabled={saving}>
                  {saving ? 'Saving…' : editingId ? 'Update Access' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
