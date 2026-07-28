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
  const [newEmail, setNewEmail] = useState('newemail@example.com')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null)

  const [avatarError, setAvatarError] = useState(false)
  const handleAvatarFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarUrl(url)
      setAvatarError(false)
    }
  }

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

          <div className="pf-card pf-avatar-card" id="pf-avatar-banner">

            <label
              className="pf-avatar-wrapper"
              htmlFor="avatar-file-input"
            >

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


              <span className="pf-camera-badge">

                <Ico size={11}>
                  <path d="M14.5 4h-5L8 6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-4l-1.5-2Z" />
                  <circle cx="12" cy="13" r="3" />
                </Ico>

              </span>


              <input
                type="file"
                id="avatar-file-input"
                accept="image/*"
                onChange={handleAvatarFileSelect}
                style={{ display: 'none' }}
              />

            </label>


            <div className="pf-avatar-info">

              <h2 className="pf-user-name">
                {displayName}
              </h2>

              <p className="pf-user-email">
                {currentEmail}
              </p>

            </div>


          </div>

          <div className="pf-card" id="pf-personal-info-card">

            <div className="pf-card-header">

              <div className="pf-header-icon blue-icon">

                <Ico size={18}>
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
                </Ico>

              </div>


              <div className="pf-header-text">

                <h3>
                  Personal Information
                </h3>

                <p>
                  Update your name, phone number, and avatar
                </p>

              </div>

            </div>


            <form
              onSubmit={handleSavePersonalInfo}
              className="pf-form"
            >

              <div className="pf-form-group">

                <label
                  className="pf-label"
                  htmlFor="pf-display-name"
                >
                  Display Name
                </label>


                <input
                  id="pf-display-name"
                  type="text"
                  className="pf-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />

              </div>



              <div className="pf-form-group">

                <label
                  className="pf-label"
                  htmlFor="pf-phone"
                >
                  Phone Number
                </label>


                <input
                  id="pf-phone"
                  type="text"
                  className="pf-input"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />

              </div>



              <div className="pf-form-group">

                <label
                  className="pf-label"
                  htmlFor="pf-avatar-url"
                >
                  Avatar URL
                </label>


                <input
                  id="pf-avatar-url"
                  type="text"
                  className="pf-input"
                  value={avatarUrl}
                  onChange={(e) => {
                    setAvatarUrl(e.target.value)
                    setAvatarError(false)
                  }}
                />

              </div>



              <div className="pf-form-actions">

                <button
                  className="pf-btn-primary"
                  type="submit"
                  id="pf-save-personal-btn"
                >

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

          <div className="pf-card" id="pf-change-email-card">


            <div className="pf-card-header">


              <div className="pf-header-icon blue-icon">

                <Ico size={18}>

                  <rect x="2" y="4" width="20" height="16" rx="2" />

                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />

                </Ico>

              </div>



              <div className="pf-header-text">

                <h3>
                  Change Email
                </h3>


                <p>
                  Current email: {currentEmail}
                </p>


              </div>


            </div>




            <form
              onSubmit={handleUpdateEmail}
              className="pf-form"
            >


              <div className="pf-form-group">


                <label
                  className="pf-label"
                  htmlFor="pf-new-email"
                >
                  New Email Address
                </label>



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


                <button

                  className="pf-btn-outline"

                  type="submit"

                  id="pf-update-email-btn"

                >

                  Update Email
                </button>
              </div>
            </form>
          </div>

          <div className="pf-card" id="pf-change-password-card">


            <div className="pf-card-header">


              <div className="pf-header-icon blue-icon">

                <Ico size={18}>

                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />

                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />

                </Ico>

              </div>



              <div className="pf-header-text">

                <h3>
                  Change Password
                </h3>


                <p>
                  Update your password or send a reset link
                </p>


              </div>


            </div>




            <form
              onSubmit={handleUpdatePassword}
              className="pf-form"
            >


              <div className="pf-form-group">


                <label
                  className="pf-label"
                  htmlFor="pf-new-password"
                >
                  New Password
                </label>


                <input

                  id="pf-new-password"

                  type="password"

                  className="pf-input"

                  value={newPassword}

                  onChange={(e) => setNewPassword(e.target.value)}

                />


              </div>



              <div className="pf-form-group">


                <label
                  className="pf-label"
                  htmlFor="pf-confirm-password"
                >
                  Confirm Password
                </label>


                <input

                  id="pf-confirm-password"

                  type="password"

                  className="pf-input"

                  value={confirmPassword}

                  onChange={(e) => setConfirmPassword(e.target.value)}

                />


              </div>



              <div className="pf-btn-row">


                <button

                  className="pf-btn-outline"

                  type="submit"

                  id="pf-update-password-btn"

                >

                  Update Password

                </button>




                <button

                  className="pf-btn-outline"

                  type="button"

                  id="pf-send-reset-btn"

                  onClick={handleSendResetEmail}

                >

                  Send Reset Email

                </button>



              </div>


            </form>



          </div>

        </div>

      </div>


    </div>
  )

}