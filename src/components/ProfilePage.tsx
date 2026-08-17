import { useState } from 'react'
import type { FormEvent } from 'react'
import TopHeader from './shared/TopHeader'
import '../styles/ProfilePage.css'

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

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState('Ashraf Hossain')
  const [phone, setPhone] = useState('+880 1XXX-XXXXXX')
  const [avatarUrl, setAvatarUrl] = useState('https://example.com/avatar.jpg')
  const [currentEmail, setCurrentEmail] = useState('ashrafhossainsohan@gmail.com')
  const [newEmail, setNewEmail] = useState('newemail@example.com')
  const [newPassword, setNewPassword] = useState('••••••••')
  const [confirmPassword, setConfirmPassword] = useState('••••••••')

  // Toast / notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)
  const [avatarError, setAvatarError] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 3500)
  }

  const handleSavePersonalInfo = (e: FormEvent) => {
    e.preventDefault()
    showToast('Personal information updated successfully!')
  }

  const handleUpdateEmail = (e: FormEvent) => {
    e.preventDefault()
    if (!newEmail || newEmail === currentEmail) {
      showToast('Please enter a new email address', 'error')
      return
    }
    setCurrentEmail(newEmail)
    showToast(`Email updated to ${newEmail}`)
  }

  const handleUpdatePassword = (e: FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'error')
      return
    }
    showToast('Password updated successfully!')
  }

  const handleSendResetEmail = () => {
    showToast(`Password reset link sent to ${currentEmail}`, 'info')
  }

  const copyUserId = () => {
    navigator.clipboard.writeText('85fc84f2-9d3e-4a12-b8c7-e6f9a01b2345')
    setCopiedId(true)
    showToast('User ID copied to clipboard!', 'info')
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      setAvatarError(false)
      showToast('Avatar picture updated!')
    }
  }

  return (
    <div className="pf-page" id="profile-page">
      {/* ── Toast Notification ───────────────────────────── */}
      {toast && (
        <div className={`pf-toast pf-toast-${toast.type}`}>
          <span className="pf-toast-dot" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* ── Top Header Bar ─────────────────────────────────── */}
      <TopHeader
        className="pf-header"
        leftContent={
          <button className="pf-company-dropdown" id="pf-company-filter" type="button">
            All Companies
            <Ico size={13}>
              <path d="M6 9l6 6 6-6" />
            </Ico>
          </button>
        }
        rightContent={
          <>
            <button className="pf-add-entry-btn" id="pf-add-entry" type="button">
              <Ico size={14}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </Ico>
              Add Entry
            </button>

            <button className="pf-icon-btn" id="pf-theme-toggle-header" type="button" title="Toggle theme">
              <Ico size={16}>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              </Ico>
            </button>
          </>
        }
      />

      {/* ── Main Scrollable Body ──────────────────────────── */}
      <div className="pf-body">
        <div className="pf-container">

          {/* Page Heading */}
          <div className="pf-title-block">
            <h1 className="pf-title">Profile</h1>
            <p className="pf-subtitle">Manage your personal information and account settings</p>
          </div>

          {/* Card 1: User Avatar & Name Card */}
          <div className="pf-card pf-avatar-card" id="pf-avatar-banner">
            <label className="pf-avatar-wrapper" htmlFor="avatar-file-input" title="Click to change avatar">
              {avatarUrl && !avatarError ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="pf-avatar-img"
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <div className="pf-avatar-circle">
                  {displayName.charAt(0) || 'A'}
                </div>
              )}

              <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                onChange={handleAvatarFileSelect}
                style={{ display: 'none' }}
              />
            </label>
            <div className="pf-avatar-info">
              <h2 className="pf-user-name">{displayName}</h2>
              <p className="pf-user-email">{currentEmail}</p>
            </div>
          </div>

          {/* Card 2: Personal Information */}
          <div className="pf-card" id="pf-personal-info-card">
            <div className="pf-card-header">
              <div className="pf-header-icon blue-icon">
                <Ico size={18}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                </Ico>
              </div>
              <div className="pf-header-text">
                <h3>Personal Information</h3>
                <p>Update your name, phone number, and avatar</p>
              </div>
            </div>

            <form onSubmit={handleSavePersonalInfo} className="pf-form">
              <div className="pf-form-group">
                <label className="pf-label" htmlFor="pf-display-name">Display Name</label>
                <input
                  id="pf-display-name"
                  type="text"
                  className="pf-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>

              <div className="pf-form-group">
                <label className="pf-label" htmlFor="pf-phone">Phone Number</label>
                <div className="pf-input-icon-wrapper">
                  <Ico size={15} className="pf-input-left-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </Ico>
                  <input
                    id="pf-phone"
                    type="text"
                    className="pf-input pf-input-has-left-icon"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>



              <div className="pf-form-actions">
                <button className="pf-btn-primary" type="submit" id="pf-save-personal-btn">
                  <Ico size={15}>
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </Ico>
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Change Email */}
          <div className="pf-card" id="pf-change-email-card">
            <div className="pf-card-header">
              <div className="pf-header-icon blue-icon">
                <Ico size={18}>
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </Ico>
              </div>
              <div className="pf-header-text">
                <h3>Change Email</h3>
                <p>Current email: <span className="pf-current-email-text">{currentEmail}</span></p>
              </div>
            </div>

            <form onSubmit={handleUpdateEmail} className="pf-form">
              <div className="pf-form-group">
                <label className="pf-label" htmlFor="pf-new-email">New Email Address</label>
                <input
                  id="pf-new-email"
                  type="email"
                  className="pf-input"
                  placeholder="newemail@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>

              <div className="pf-form-actions">
                <button className="pf-btn-outline" type="submit" id="pf-update-email-btn">
                  <Ico size={15}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </Ico>
                  Update Email
                </button>
              </div>
            </form>
          </div>

          {/* Card 4: Change Password */}
          <div className="pf-card" id="pf-change-password-card">
            <div className="pf-card-header">
              <div className="pf-header-icon blue-icon">
                <Ico size={18}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </Ico>
              </div>
              <div className="pf-header-text">
                <h3>Change Password</h3>
                <p>Update your password now or send a reset link to your email</p>
              </div>
            </div>

            <form onSubmit={handleUpdatePassword} className="pf-form">
              <div className="pf-form-group">
                <label className="pf-label" htmlFor="pf-new-password">New Password</label>
                <input
                  id="pf-new-password"
                  type="password"
                  className="pf-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="pf-form-group">
                <label className="pf-label" htmlFor="pf-confirm-password">Confirm Password</label>
                <input
                  id="pf-confirm-password"
                  type="password"
                  className="pf-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className="pf-btn-row">
                <button className="pf-btn-outline" type="submit" id="pf-update-password-btn">
                  <Ico size={15}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
                  </Ico>
                  Update Password
                </button>

                <button
                  className="pf-btn-outline"
                  type="button"
                  id="pf-send-reset-btn"
                  onClick={handleSendResetEmail}
                >
                  <Ico size={15}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </Ico>
                  Send Reset Email
                </button>
              </div>
            </form>
          </div>

          {/* Card 5: Account Info */}
          <div className="pf-card" id="pf-account-info-card">
            <div className="pf-card-header">
              <div className="pf-header-icon blue-icon">
                <Ico size={18}>
                  <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2" />
                </Ico>
              </div>
              <div className="pf-header-text">
                <h3>Account Info</h3>
              </div>
            </div>

            <div className="pf-info-rows">
              <div className="pf-info-row">
                <span className="pf-info-label">User ID</span>
                <button
                  type="button"
                  className="pf-info-value pf-info-copyable"
                  onClick={copyUserId}
                  title="Click to copy full User ID"
                >
                  <code>85fc84f2...</code>
                  {copiedId ? (
                    <span className="pf-copied-badge">Copied!</span>
                  ) : (
                    <Ico size={12} className="pf-copy-icon">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </Ico>
                  )}
                </button>
              </div>

              <div className="pf-info-row">
                <span className="pf-info-label">Created</span>
                <span className="pf-info-value">2/18/2026</span>
              </div>

              <div className="pf-info-row">
                <span className="pf-info-label">Last Sign In</span>
                <span className="pf-info-value">7/19/2026</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
