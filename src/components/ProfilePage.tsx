import { useState } from 'react'
import type { FormEvent } from 'react'
import './ProfilePage.css'

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

export default function ProfilePage() {

  const [displayName, setDisplayName] = useState('Ashraf Hossain')
  const [phone, setPhone] = useState('+880 1XXX-XXXXXX')
  const [avatarUrl, setAvatarUrl] = useState('https://example.com/avatar.jpg')
  const [currentEmail, setCurrentEmail] = useState('ashrafhossainsohan@gmail.com')

  return (
    <div className="pf-page" id="profile-page">

      <header className="pf-header">
        <button
          className="pf-company-dropdown"
          id="pf-company-filter"
          type="button"
        >
          All Companies
          <Ico size={13}>
            <path d="M6 9l6 6 6-6" />
          </Ico>
        </button>

        <div className="pf-header-actions">

          <button
            className="pf-add-entry-btn"
            id="pf-add-entry"
            type="button"
          >
            <Ico size={14}>
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </Ico>
            Add Entry
          </button>


          <button
            className="pf-icon-btn"
            id="pf-theme-toggle-header"
            type="button"
            title="Toggle theme"
          >
            <Ico size={16}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </Ico>
          </button>


          <button
            className="pf-icon-btn"
            id="pf-notifications"
            type="button"
            title="Notifications"
          >
            <Ico size={16}>
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </Ico>

            <span className="pf-notification-dot" />
          </button>


          <div className="pf-header-user">

            <button
              className="pf-user-avatar-small"
              type="button"
              title="Profile"
            >
              {displayName.charAt(0) || 'A'}
            </button>

            <Ico size={12}>
              <path d="M6 9l6 6 6-6" />
            </Ico>

          </div>

        </div>

      </header>

      <div className="pf-body">

        <div className="pf-container">

          <div className="pf-title-block">

            <h1 className="pf-title">
              Profile
            </h1>

            <p className="pf-subtitle">
              Manage your personal information and account settings
            </p>

          </div>


        </div>

      </div>


    </div>
  )

}