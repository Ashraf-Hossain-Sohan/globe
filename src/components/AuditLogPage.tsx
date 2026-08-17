import { useState, useEffect, useCallback } from 'react'
import TopHeader from './shared/TopHeader'
import '../styles/AuditLogPage.css'

interface AuditLog {
  id: number
  action: string
  entityType: string
  entityId: string
  description: string
  userEmail: string
  userName: string
  ipAddress: string
  timestamp: string
}

interface Stats {
  totalLogs: number
  loginsToday: number
  changesToday: number
  activeUsersToday: number
}

interface Filters {
  users?: string[]
  entityTypes?: string[]
  actions?: string[]
}

const API = '/api/audit-logs'

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [filters, setFilters] = useState<Filters>({ users: [], entityTypes: [], actions: [] })
  
  // State for current filter selections
  const [page, setPage] = useState(0)
  const [size] = useState(15)
  const [totalPages, setTotalPages] = useState(0)
  
  const [action, setAction] = useState('')
  const [entityType, setEntityType] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')

  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...(action && { action }),
      ...(entityType && { entityType }),
      ...(userEmail && { userEmail }),
      ...(dateFrom && { dateFrom }),
      ...(dateTo && { dateTo }),
      ...(search && { search })
    })

    try {
      const res = await fetch(`${API}?${params}`, { credentials: 'include' })
      const data = await res.json()
      if (data.content) {
        setLogs(data.content)
        setTotalPages(data.totalPages || 0)
      }
    } finally {
      setLoading(false)
    }
  }, [page, size, action, entityType, userEmail, dateFrom, dateTo, search])

  const fetchStats = () => {
    fetch(`${API}/stats`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setStats(data))
  }

  const fetchFilters = () => {
    fetch(`${API}/filters`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => setFilters(data))
  }

  useEffect(() => {
    fetchStats()
    fetchFilters()
  }, [])

  useEffect(() => {
    const initFetch = async () => {
      await fetchLogs()
    }
    initFetch()
  }, [fetchLogs])

  const formatDate = (dateString: string) => {
    const d = new Date(dateString)
    return d.toLocaleString()
  }

  const getActionBadgeClass = (act: string) => {
    switch (act) {
      case 'LOGIN': return 'badge-login'
      case 'LOGOUT': return 'badge-logout'
      case 'CREATE': return 'badge-create'
      case 'UPDATE': return 'badge-update'
      case 'DELETE': return 'badge-delete'
      default: return 'badge-default'
    }
  }

  return (
    <div className="audit-log-page">
      <TopHeader
        className="al-header"
        leftContent={
          <span className="al-header-title">System Audit Log</span>
        }
        rightContent={
          <button className="al-refresh-btn" onClick={() => { fetchStats(); fetchLogs(); }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Refresh Logs
          </button>
        }
      />

      <main className="al-body">
        <div className="al-title-row">
          <div className="al-title-text">
            <h1>Audit Log</h1>
            <p>Track all system events and user actions securely</p>
          </div>
        </div>

        {/* Stats Cards - matching ep-summary-grid */}
        <div className="al-summary-grid">
          <div className="al-summary-card">
            <div className="al-summary-label">
              <div className="al-summary-dot" style={{ background: '#6366f1' }}></div>
              Total Logs
            </div>
            <div className="al-summary-count">{stats?.totalLogs ?? '-'}</div>
          </div>
          <div className="al-summary-card">
            <div className="al-summary-label">
              <div className="al-summary-dot" style={{ background: '#22c55e' }}></div>
              Logins Today
            </div>
            <div className="al-summary-count">{stats?.loginsToday ?? '-'}</div>
          </div>
          <div className="al-summary-card">
            <div className="al-summary-label">
              <div className="al-summary-dot" style={{ background: '#fbbf24' }}></div>
              Changes Today
            </div>
            <div className="al-summary-count">{stats?.changesToday ?? '-'}</div>
          </div>
          <div className="al-summary-card">
            <div className="al-summary-label">
              <div className="al-summary-dot" style={{ background: '#8b5cf6' }}></div>
              Active Users Today
            </div>
            <div className="al-summary-count">{stats?.activeUsersToday ?? '-'}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="al-filters-row">
          <input 
            type="text" 
            placeholder="Search descriptions..." 
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="al-filter-input search-input"
          />
          
          <div className="al-filter-group">
            <select value={action} onChange={(e) => { setAction(e.target.value); setPage(0); }} className="al-filter-select">
              <option value="">All Actions</option>
              {filters.actions?.map(act => (
                <option key={act} value={act}>{act}</option>
              ))}
            </select>
          </div>

          <div className="al-filter-group">
            <select value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(0); }} className="al-filter-select">
              <option value="">All Entities</option>
              {filters.entityTypes?.map(entity => (
                <option key={entity} value={entity}>{entity}</option>
              ))}
            </select>
          </div>

          <div className="al-filter-group">
            <select value={userEmail} onChange={(e) => { setUserEmail(e.target.value); setPage(0); }} className="al-filter-select">
              <option value="">All Users</option>
              {filters.users?.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div className="al-filter-group">
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => { setDateFrom(e.target.value); setPage(0); }}
              className="al-filter-input date-input"
              title="Date From"
            />
            <span className="al-filter-separator">-</span>
            <input 
              type="date" 
              value={dateTo} 
              onChange={(e) => { setDateTo(e.target.value); setPage(0); }}
              className="al-filter-input date-input"
              title="Date To"
            />
          </div>
          
          {(action || entityType || userEmail || dateFrom || dateTo || search) && (
            <button className="al-clear-filters-btn" onClick={() => {
              setAction(''); setEntityType(''); setUserEmail(''); setDateFrom(''); setDateTo(''); setSearch(''); setPage(0);
            }}>
              Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div className="al-table-container">
          {loading ? (
            <div className="al-loading">
              <div className="al-spinner"></div>
              Loading logs...
            </div>
          ) : logs.length === 0 ? (
            <div className="al-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>No audit logs found matching the criteria.</p>
            </div>
          ) : (
            <div className="al-table-list">
              <div className="al-table-header">
                <div className="al-col time">TIMESTAMP</div>
                <div className="al-col action">ACTION</div>
                <div className="al-col user">USER</div>
                <div className="al-col entity">ENTITY</div>
                <div className="al-col desc">DESCRIPTION</div>
                <div className="al-col ip">IP ADDRESS</div>
              </div>
              
              {logs.map(log => (
                <div key={log.id} className="al-table-row">
                  <div className="al-col time">
                    <span className="al-time-text">{formatDate(log.timestamp)}</span>
                  </div>
                  
                  <div className="al-col action">
                    <span className={`al-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </div>
                  
                  <div className="al-col user">
                    <div className="al-user-info">
                      <span className="al-user-name">{log.userName}</span>
                      <span className="al-user-email">{log.userEmail}</span>
                    </div>
                  </div>
                  
                  <div className="al-col entity">
                    {log.entityType ? <span className="al-entity-tag">{log.entityType}</span> : <span className="al-dash">-</span>}
                  </div>
                  
                  <div className="al-col desc">
                    <span className="al-desc-text" title={log.description}>{log.description}</span>
                  </div>
                  
                  <div className="al-col ip">
                    <span className="al-ip-text">{log.ipAddress}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="al-pagination">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(p => p - 1)}
            className="al-page-btn"
          >
            Previous
          </button>
          <span className="al-page-info">Page {page + 1} of {Math.max(1, totalPages)}</span>
          <button 
            disabled={page >= totalPages - 1} 
            onClick={() => setPage(p => p + 1)}
            className="al-page-btn"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  )
}
