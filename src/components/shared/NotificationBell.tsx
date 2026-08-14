import { useState, useEffect, useRef } from 'react'
import '../../styles/index.css'

interface Notification {
  id: number
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationBell() {
  const [showNotifMenu, setShowNotifMenu] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/notifications', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setNotifications(data))
      .catch(err => console.error(err))

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST', credentials: 'include' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const getNotificationIcon = (message: string) => {
    const msg = message.toLowerCase()
    if (msg.includes('revenue')) {
      return (
        <div className="notif-icon-circle green">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
        </div>
      )
    }
    if (msg.includes('expense')) {
      return (
        <div className="notif-icon-circle red">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
        </div>
      )
    }
    return (
      <div className="notif-icon-circle blue">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      </div>
    )
  }

  return (
    <div className="dash-dropdown-container" ref={menuRef}>
      <button className="icon-btn bell-icon-wrapper" onClick={() => setShowNotifMenu(!showNotifMenu)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && <div className="red-dot glass-ping"></div>}
      </button>

      {showNotifMenu && (
        <div className="dash-dropdown-menu glass-dropdown notif-menu-modern">
          <div className="dash-dropdown-header glass-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && <span className="notif-badge">{unreadCount} New</span>}
          </div>
          
          <div className="notif-list-container custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="dash-dropdown-item notif-empty">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                <p>You're all caught up!</p>
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  className={`dash-dropdown-item notif-item-modern ${!n.read ? 'unread' : 'read'}`} 
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  <div className="notif-item-left">
                    {getNotificationIcon(n.message)}
                  </div>
                  <div className="notif-item-content">
                    <p className="notif-text">{n.message}</p>
                    <p className="notif-time">{new Date(n.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                  </div>
                  {!n.read && <div className="notif-unread-indicator"></div>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
