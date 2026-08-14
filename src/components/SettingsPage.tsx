import React, { useState, useEffect } from 'react'
import TopHeader from './shared/TopHeader'
import '../styles/SettingsPage.css'

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
interface Company {
  id: number
  name: string
  code: string
  color: string
  description: string
}

/* ── Main Component ──────────────────────────────────────────── */
export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [companies, setCompanies] = useState<Company[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', code: '', color: '#60a5fa', description: '' })

  useEffect(() => {
    fetch('/api/companies', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setCompanies(data))
      .catch(err => console.error(err))

    // Initialize theme from user profile (assuming AuthContext handles it globally, but we can also fetch here)
    fetch('/api/auth/me', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.theme) setTheme(data.theme)
      })
      .catch(err => console.error(err))
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
    document.body.className = nextTheme === 'light' ? 'light-mode' : '' // Example global application
    fetch('/api/auth/me/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme: nextTheme }),
      credentials: 'include'
    }).catch(err => console.error(err))
  }

  const removeCompany = (id: number) => {
    fetch(`/api/companies/${id}`, { method: 'DELETE', credentials: 'include' })
      .then(() => setCompanies((prev) => prev.filter((c) => c.id !== id)))
      .catch(err => console.error(err))
  }

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault()
    fetch('/api/companies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCompany),
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        setCompanies(prev => [...prev, data])
        setIsAddModalOpen(false)
        setNewCompany({ name: '', code: '', color: '#60a5fa', description: '' })
      })
      .catch(err => console.error(err))
  }

  return (
    <div className="settings-page" id="settings-page">
      <TopHeader
        className="sp-header"
        leftContent={
          <button className="sp-company-dropdown" id="sp-company-filter" type="button">
            All Companies
            <Ico size={13}>
              <path d="M6 9l6 6 6-6" />
            </Ico>
          </button>
        }
        rightContent={
          <>
            <button className="sp-add-entry-btn" id="sp-add-entry" type="button">
              <Ico size={14}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </Ico>
              Add Entry
            </button>
            <button className="sp-icon-btn" id="sp-theme-toggle-header" type="button" title="Toggle theme" onClick={toggleTheme}>
              <Ico size={16}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </Ico>
            </button>
          </>
        }
      />

      {/* ── Content ────────────────────────────────────────── */}
      <div className="sp-body">
        <h1 className="sp-title">Settings</h1>
        <p className="sp-subtitle">Manage your dashboard preferences</p>

        {/* Appearance Card */}
        <div className="sp-card" id="settings-appearance-card">
          <div className="sp-appearance-row">
            <div className="sp-section-icon">
              <Ico size={18}>
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
              </Ico>
            </div>
            <div className="sp-section-label">
              <h3>Appearance</h3>
              <p>Switch between dark and light mode</p>
            </div>
            <button
              className="sp-theme-btn"
              id="settings-theme-toggle"
              type="button"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </div>

        {/* Companies Card */}
        <div className="sp-card" id="settings-companies-card">
          <div className="sp-companies-header">
            <div className="sp-section-icon">
              <Ico size={18}>
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </Ico>
            </div>
            <div className="sp-section-label">
              <h3>Companies</h3>
              <p>Manage business units in your group</p>
            </div>
            <button className="sp-add-company-btn" id="settings-add-company" type="button" onClick={() => setIsAddModalOpen(true)}>
              <Ico size={14}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </Ico>
              Add Company
            </button>
          </div>

          <div className="sp-company-list">
            {companies.length === 0 && <div style={{ padding: '2rem', textAlign: 'center' }}>No companies found.</div>}
            {companies.map((company) => (
              <div className="sp-company-item" key={company.id} id={`company-${company.id}`}>
                <div className="sp-company-info">
                  <div className="sp-company-name" style={{ color: company.color || 'var(--sb-text-strong)' }}>
                    {company.name}
                    <span className="sp-company-code">({company.code})</span>
                  </div>
                  <div className="sp-company-meta">
                    ID: {company.id} · {company.description}
                  </div>
                </div>
                <button
                  className="sp-delete-btn"
                  type="button"
                  title={`Delete ${company.name}`}
                  onClick={() => removeCompany(company.id)}
                  id={`delete-company-${company.id}`}
                >
                  <Ico size={16}>
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  </Ico>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Company Modal */}
      {isAddModalOpen && (
        <div className="dash-modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="dash-modal" onClick={(e) => e.stopPropagation()}>
            <div className="dash-modal-header">
              <h3>Add New Company</h3>
              <button type="button" className="dash-modal-close" onClick={() => setIsAddModalOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form className="dash-modal-body" onSubmit={handleAddCompany}>
              <div className="dash-form-group">
                <label>Company Name</label>
                <input required type="text" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} placeholder="e.g. Acme Corp" />
              </div>
              <div className="dash-form-group">
                <label>Short Code</label>
                <input required type="text" value={newCompany.code} onChange={e => setNewCompany({...newCompany, code: e.target.value})} placeholder="e.g. ACME" />
              </div>
              <div className="dash-form-group">
                <label>Brand Color</label>
                <input type="color" value={newCompany.color} onChange={e => setNewCompany({...newCompany, color: e.target.value})} />
              </div>
              <div className="dash-form-group">
                <label>Description</label>
                <input type="text" value={newCompany.description} onChange={e => setNewCompany({...newCompany, description: e.target.value})} placeholder="e.g. Software Services" />
              </div>
              <div className="dash-modal-footer">
                <button type="button" className="dash-btn outline" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                <button type="submit" className="dash-btn primary">Save Company</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
