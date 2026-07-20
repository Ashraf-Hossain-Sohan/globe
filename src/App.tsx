import { useState } from 'react'
import type { CSSProperties, JSX } from 'react'
import './App.css'
import InventoryPage from './components/InventoryPage'
import ExpensesPage from './components/ExpensesPage'
import BillsPage from './components/BillsPage'
import SettingsPage from './components/SettingsPage'

type NavItem = {
  id: string
  label: string
  icon: JSX.Element
  /** Optional accent color for the icon (companies have brand colors). */
  color?: string
}

type NavSection = {
  title: string
  items: NavItem[]
}

/* Lucide-style stroke icons, sized by the parent's font-size. */
const icon = (paths: JSX.Element) => (
  <svg
    className="nav-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths}
  </svg>
)

const sections: NavSection[] = [
  {
    title: 'Companies',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        color: '#60a5fa',
        icon: icon(
          <>
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </>,
        ),
      },
      {
        id: 'xsrs',
        label: 'XSRS IT',
        color: '#60a5fa',
        icon: icon(
          <>
            <rect x="2" y="4" width="20" height="13" rx="2" />
            <path d="M8 21h8M12 17v4" />
          </>,
        ),
      },
      {
        id: 'frames',
        label: '365 Frames',
        color: '#fb923c',
        icon: icon(
          <>
            <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z" />
            <circle cx="12" cy="13" r="3.5" />
          </>,
        ),
      },
      {
        id: 'everafter',
        label: 'EverAfter',
        color: '#f87171',
        icon: icon(
          <path d="M19 14c1.5-1.5 3-3.3 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5c0 2.2 1.5 4 3 5.5l7 7Z" />,
        ),
      },
      {
        id: 'printdesk',
        label: 'PrintDesk',
        color: '#4ade80',
        icon: icon(
          <>
            <path d="M6 9V2h12v7" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" rx="1" />
          </>,
        ),
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        id: 'global-entry',
        label: 'Global Entry',
        icon: icon(
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3.6 9h16.8M3.6 15h16.8" />
            <path d="M12 3a13.5 13.5 0 0 1 3 9 13.5 13.5 0 0 1-3 9 13.5 13.5 0 0 1-3-9 13.5 13.5 0 0 1 3-9z" />
          </>,
        ),
      },
      {
        id: 'expenses',
        label: 'Expenses',
        icon: icon(
          <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M12 8v8M14 10a2 2 0 0 0-2-1.5c-1.1 0-2 .7-2 1.5s.9 1.5 2 1.5 2 .7 2 1.5-.9 1.5-2 1.5a2 2 0 0 1-2-1.5" />
          </>,
        ),
      },
      {
        id: 'bills',
        label: 'Bills',
        icon: icon(
          <>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M2 10h20" />
          </>,
        ),
      },
      {
        id: 'inventory',
        label: 'Inventory',
        icon: icon(
          <>
            <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
            <path d="M3 8l9 5 9-5M12 13v8" />
          </>,
        ),
      },
      {
        id: 'employees',
        label: 'Employees',
        icon: icon(
          <>
            <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1" />
            <circle cx="9" cy="7" r="3" />
            <path d="M22 19v-1a4 4 0 0 0-3-3.85M16 4.13a4 4 0 0 1 0 7.75" />
          </>,
        ),
      },
      {
        id: 'office-time',
        label: 'Office Time',
        icon: icon(
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </>,
        ),
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: icon(
          <>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
            <path d="M14 3v5h5M8 13h8M8 17h8" />
          </>,
        ),
      },
      {
        id: 'invoice',
        label: 'Invoice',
        icon: icon(
          <>
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
            <path d="M14 3v5h5M13 12H7m0 0 2.5-2.5M7 12l2.5 2.5" />
          </>,
        ),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: icon(
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
          </>,
        ),
      },
      {
        id: 'profile',
        label: 'Profile',
        icon: icon(
          <>
            <circle cx="12" cy="8" r="4" />
            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
          </>,
        ),
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        id: 'user-access',
        label: 'User Access',
        icon: icon(
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />,
        ),
      },
      {
        id: 'audit-log',
        label: 'Audit Log',
        icon: icon(
          <>
            <rect x="8" y="3" width="8" height="4" rx="1" />
            <path d="M16 5h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" />
            <path d="M9 12h6M9 16h6" />
          </>,
        ),
      },
    ],
  },
]

function App() {
  const [active, setActive] = useState('settings')

  const renderContent = () => {
    if (active === 'inventory') return <InventoryPage />
    if (active === 'expenses') return <ExpensesPage />
    if (active === 'bills') return <BillsPage />
    if (active === 'settings') return <SettingsPage />
    return (
      <main className="content-placeholder">
        <div className="placeholder-inner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <h2>{sections.flatMap(s => s.items).find(i => i.id === active)?.label ?? 'Page'}</h2>
          <p>This section is under development.</p>
        </div>
      </main>
    )
  }

  return (
    <>
      <aside className="sidebar">
        <header className="sidebar-header" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 0, padding: '16px 14px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span className="brand-avatar" aria-hidden="true">G</span>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span className="brand-name" style={{ lineHeight: 1.2 }}>Group Admin</span>
              <span style={{ fontSize: 11, color: 'var(--sb-muted)', lineHeight: 1.2 }}>Enterprise Suite</span>
            </span>
          </div>
          <button
            id="add-company-btn"
            type="button"
            onClick={() => setActive('overview')}
            style={{
              marginTop: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              width: '100%',
              padding: '8px 0',
              border: '1px dashed rgba(79,110,247,0.5)',
              borderRadius: 8,
              background: 'rgba(79,110,247,0.08)',
              color: '#6b8cff',
              fontSize: 13,
              fontWeight: 600,
              fontFamily: 'inherit',
              cursor: 'pointer',
              transition: 'background 0.15s, border-color 0.15s',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Company
          </button>
        </header>

        <nav className="sidebar-nav">
          {sections.map((section) => (
            <div key={section.title} className="nav-section">
              <p className="nav-section-title">{section.title}</p>
              <ul>
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`nav-link${active === item.id ? ' is-active' : ''}`}
                      onClick={() => setActive(item.id)}
                      style={item.color ? ({ '--icon-color': item.color } as CSSProperties) : undefined}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <footer className="sidebar-footer">
          <span className="user-avatar" aria-hidden="true">
            A
          </span>
          <span className="user-meta">
            <span className="user-name">Ashraf Hossain</span>
            <span className="user-email">ashrafhossainsohan@gmail.com</span>
          </span>
        </footer>
      </aside>

      {renderContent()}
    </>
  )
}

export default App
