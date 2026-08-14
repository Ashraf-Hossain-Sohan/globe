import React from 'react'
import NotificationBell from './NotificationBell'
import UserProfileDropdown from './UserProfileDropdown'
import '../../styles/index.css'

interface TopHeaderProps {
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  className?: string
}

export default function TopHeader({ leftContent, rightContent, className = 'global-header' }: TopHeaderProps) {
  return (
    <header className={className}>
      <div className="global-header-left">
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
        {leftContent}
      </div>
      
      <div className="global-header-right">
        {rightContent}
        
        <div className="global-header-icons">
          <NotificationBell />
          <UserProfileDropdown />
        </div>
      </div>
    </header>
  )
}
