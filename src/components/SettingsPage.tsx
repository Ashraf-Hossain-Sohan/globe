import { useState } from 'react'
import './SettingsPage.css'

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
  id: string
  name: string
  code: string
  accent: string
  description: string
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: '365f',
    name: '365 Frames',
    code: '365F',
    accent: 'frames',
    description: 'Commercial Photography & Cinematography',
  },
  {
    id: 'ea',
    name: 'EverAfter',
    code: 'EA',
    accent: 'everafter',
    description: 'Wedding Shoot Specialist',
  },
  {
    id: 'pd',
    name: 'PrintDesk',
    code: 'PD',
    accent: 'printdesk',
    description: '3D Printing & Desk Organization',
  },
  {
    id: 'xsrs',
    name: 'XSRS IT',
    code: 'XSRS',
    accent: 'xsrs',
    description: 'IT Services & Software Consulting',
  },
]

/* ── Main Component ──────────────────────────────────────────── */
export default function SettingsPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES)

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const removeCompany = (id: string) => {
    setCompanies((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="settings-page" id="settings-page">
      {/* ── Top Header Bar ─────────────────────────────────── */}
      <header className="sp-header">
        <button className="sp-company-dropdown" id="sp-company-filter" type="button">
          All Companies
          <Ico size={13}>
            <path d="M6 9l6 6 6-6" />
          </Ico>
        </button>

        <div className="sp-header-actions">
          <button className="sp-add-entry-btn" id="sp-add-entry" type="button">
            <Ico size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Ico>
            Add Entry
          </button>

          <button className="sp-icon-btn" id="sp-theme-toggle-header" type="button" title="Toggle theme">
            <Ico size={16}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </Ico>
          </button>

          <button className="sp-icon-btn" id="sp-notifications" type="button" title="Notifications">
            <Ico size={16}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </Ico>
            <span className="sp-notification-dot" />
          </button>

          <div className="sp-header-user">
            <button className="sp-user-avatar-small" type="button" title="Profile">A</button>
            <Ico size={12}>
              <path d="M6 9l6 6 6-6" />
            </Ico>
          </div>
        </div>
      </header>

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
            <button className="sp-add-company-btn" id="settings-add-company" type="button">
              <Ico size={14}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </Ico>
              Add Company
            </button>
          </div>

          <div className="sp-company-list">
            {companies.map((company) => (
              <div className="sp-company-item" key={company.id} id={`company-${company.id}`}>
                <div className="sp-company-info">
                  <div className="sp-company-name">
                    {company.name}
                    <span className="sp-company-code">({company.code})</span>
                  </div>
                  <div className="sp-company-meta">
                    ID: {company.id} · accent: {company.accent} · {company.description}
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
    </div>
  )
}
