import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import '../../styles/index.css'

export default function UserProfileDropdown() {
  const { user, logout } = useAuth()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="dash-dropdown-container" ref={menuRef}>
      <div 
        className="user-avatar-mini" 
        onClick={() => setShowProfileMenu(!showProfileMenu)} 
        style={{ cursor: 'pointer', background: 'linear-gradient(135deg, var(--sb-primary), #818cf8)' }}
      >
        {user?.name?.charAt(0) || 'A'}
      </div>
      
      {showProfileMenu && (
        <div className="dash-dropdown-menu glass-dropdown" style={{ minWidth: '200px' }}>
          <div className="dash-dropdown-header glass-dropdown-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '4px' }}>
            <span style={{ color: '#fff', fontSize: '14px' }}>{user?.name || 'Admin'}</span>
            <span style={{ fontSize: '12px', color: 'var(--sb-muted)', fontWeight: 'normal' }}>{user?.email || 'admin@globe.com'}</span>
          </div>
          <div className="dash-dropdown-item modern-menu-item" onClick={() => {
            setShowProfileMenu(false)
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'profile' }))
          }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>
             Profile
          </div>
          <div className="dash-dropdown-item modern-menu-item" onClick={() => {
            setShowProfileMenu(false)
            window.dispatchEvent(new CustomEvent('navigate', { detail: 'settings' }))
          }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V10a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>
             Settings
          </div>
          <div className="dash-dropdown-item modern-menu-item danger" onClick={() => { setShowProfileMenu(false); logout(); }}>
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
             Logout
          </div>
        </div>
      )}
    </div>
  )
}
