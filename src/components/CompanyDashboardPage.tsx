import React, { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import '../styles/CompanyDashboardPage.css'
import '../components/GlobalEntryPage.css' // Reuse modal styles

interface ChartDataPoint {
  month: string
  revenue: number
  expenses: number
  netProfit: number
}

interface PieChartData {
  name: string
  value: number
  fill: string
}

interface DashboardMetrics {
  revenue: number
  netProfit: number
  burnRate: number
  grossProfit: number
  opex: number
  cogs: number
  profitMargin: string
  roi: string
  monthlyPerformance: ChartDataPoint[]
  profitTrend: ChartDataPoint[]
  revenueBySource: PieChartData[]
  costBreakdown: PieChartData[]
  recentTransactions: any[]
}

export default function CompanyDashboardPage({ companyCode, companyName, companyDesc }: { companyCode: string, companyName: string, companyDesc: string }) {
  const { user, logout } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeFilter, setTimeFilter] = useState(6) // Default 6 months

  // Notifications & Profile Dropdowns
  const [notifications, setNotifications] = useState<any[]>([])
  const [showNotifMenu, setShowNotifMenu] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const unreadCount = notifications.filter(n => !n.read).length

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    category: 'Expense',
    company: companyName, // Pre-select current company
    entryDate: new Date().toISOString().split('T')[0]
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchMetrics()
  }, [companyCode, timeFilter])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' })
      if (res.ok) {
        setNotifications(await res.json())
      }
    } catch (err) {}
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST', credentials: 'include' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {}
  }

  const fetchMetrics = async () => {
    setLoading(true)
    setError('')
    try {
      const url = timeFilter > 0 
        ? `/api/dashboard/${companyCode}?months=${timeFilter}` 
        : `/api/dashboard/${companyCode}`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to fetch dashboard data')
      const data = await res.json()
      setMetrics(data)
    } catch (err) {
      setError('Could not load dashboard metrics.')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEntry = async () => {
    setFormError('')
    try {
      const payload = {
        ...formData,
        amount: formData.amount ? parseFloat(formData.amount) : null
      }
      const res = await fetch('/api/global-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to save entry')
      
      await fetchMetrics() // Instant refresh
      setIsModalOpen(false)
      setFormData({
        title: '', description: '', amount: '',
        category: 'Expense', company: companyName,
        entryDate: new Date().toISOString().split('T')[0]
      })
    } catch (err) {
      setFormError('Failed to save the entry.')
    }
  }

  if (loading && !metrics) {
    return <div className="dash-loading">Loading dashboard...</div>
  }

  if (error && !metrics) {
    return <div className="dash-error">{error}</div>
  }

  const formatCurrency = (val: number) => {
    if (val >= 1000) return `BDT ${(val / 1000).toFixed(1)}K`
    return `BDT ${val}`
  }

  return (
    <div className="dash-page">
      <header className="dash-header">
        <div className="dash-header-left">
          <div className="dash-company-select">
            <span>All Companies</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        <div className="dash-header-right">
          <button className="dash-add-btn" onClick={() => setIsModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Entry
          </button>
          <div className="dash-header-icons">
            <div className="dash-dropdown-container">
              <button className="icon-btn bell-icon-wrapper" onClick={() => setShowNotifMenu(!showNotifMenu)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                {unreadCount > 0 && <div className="red-dot"></div>}
              </button>
              {showNotifMenu && (
                <div className="dash-dropdown-menu">
                  <div className="dash-dropdown-header">
                    <span>Notifications</span>
                    {unreadCount > 0 && <span style={{fontSize:'10px', background:'#3b82f6', padding:'2px 6px', borderRadius:'10px'}}>{unreadCount} New</span>}
                  </div>
                  <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                    {notifications.length === 0 ? (
                      <div className="dash-dropdown-item" style={{justifyContent: 'center', color: '#5c6270'}}>No notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`dash-dropdown-item notif-item ${!n.read ? 'notif-unread' : ''}`} onClick={() => { handleMarkAsRead(n.id); setShowNotifMenu(false); }}>
                          <span className="notif-text">{n.message}</span>
                          <span className="notif-time">{new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <button className="icon-btn" onClick={() => alert("Settings coming soon")}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button>
            
            <div className="dash-dropdown-container">
              <div className="user-avatar-mini" onClick={() => setShowProfileMenu(!showProfileMenu)} style={{cursor: 'pointer'}}>
                {user?.name?.charAt(0) || 'A'}
              </div>
              {showProfileMenu && (
                <div className="dash-dropdown-menu" style={{minWidth: '180px'}}>
                  <div className="dash-dropdown-header" style={{flexDirection: 'column', alignItems: 'flex-start', gap: '4px'}}>
                    <span style={{color: '#fff'}}>{user?.name || 'Admin'}</span>
                    <span style={{fontSize: '11px', color: '#5c6270', fontWeight: 'normal'}}>{user?.email || 'admin@globe.com'}</span>
                  </div>
                  <div className="dash-dropdown-item" onClick={() => setShowProfileMenu(false)}>Profile</div>
                  <div className="dash-dropdown-item" onClick={() => setShowProfileMenu(false)}>Settings</div>
                  <div className="dash-dropdown-item danger" onClick={() => { setShowProfileMenu(false); logout(); }}>Logout</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="dash-body">
        <div className="dash-title-section">
          <div className="dash-title-left">
            <div className="dash-dot" />
            <div>
              <h1>{companyName}</h1>
              <p>{companyDesc}</p>
            </div>
          </div>
          <div className="dash-time-filters">
            <button className={timeFilter === 3 ? 'active' : ''} onClick={() => setTimeFilter(3)}>Last 3 months</button>
            <button className={timeFilter === 6 ? 'active' : ''} onClick={() => setTimeFilter(6)}>Last 6 months</button>
            <button className={timeFilter === 12 ? 'active' : ''} onClick={() => setTimeFilter(12)}>Last 12 months</button>
            <button className={timeFilter === 0 ? 'active' : ''} onClick={() => setTimeFilter(0)}>All time</button>
          </div>
        </div>

        {metrics && (
          <>
            {/* Top Summary Metrics */}
            <div className="dash-metrics-grid">
              
              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">REVENUE</span>
                  <div className="metric-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                </div>
                <div className="metric-value">{formatCurrency(metrics.revenue)}</div>
                <div className="metric-sub">Last {timeFilter > 0 ? timeFilter : 'all'} months</div>
                <div className="metric-sparkline">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={metrics.monthlyPerformance}>
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="metric-footer">
                  <span className="trend neutral">— 0% vs last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">NET PROFIT</span>
                  <div className="metric-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
                </div>
                <div className="metric-value">{formatCurrency(metrics.netProfit)}</div>
                <div className="metric-sub">EBITDA: {formatCurrency(metrics.netProfit + 1400)}</div>
                <div className="metric-sparkline">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={metrics.monthlyPerformance}>
                      <Line type="monotone" dataKey="netProfit" stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="metric-footer">
                  <span className="trend neutral">— 0% vs last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">BURN RATE</span>
                  <div className="metric-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg></div>
                </div>
                <div className="metric-value">{formatCurrency(metrics.burnRate)}</div>
                <div className="metric-sub">Monthly avg expenses</div>
                <div className="metric-sparkline">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={metrics.monthlyPerformance}>
                      <Line type="monotone" dataKey="expenses" stroke="#f97316" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="metric-footer">
                  <span className="trend neutral">— 0% vs last month</span>
                </div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <span className="metric-label">PROFIT MARGIN</span>
                  <div className="metric-icon">%</div>
                </div>
                <div className="metric-value">{metrics.profitMargin}</div>
                <div className="metric-sub">ROI: {metrics.roi}</div>
                <div className="metric-sparkline">
                  <ResponsiveContainer width="100%" height={40}>
                    <LineChart data={metrics.monthlyPerformance}>
                      <Line type="monotone" dataKey="netProfit" stroke="#8b5cf6" strokeWidth={2} dot={false} isAnimationActive={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="metric-footer">
                  <span className="trend neutral">— 0% vs last month</span>
                </div>
              </div>

            </div>

            {/* Secondary Metrics Row */}
            <div className="dash-secondary-metrics">
              <div className="sec-metric">
                <span className="label">GROSS PROFIT</span>
                <span className="val">{formatCurrency(metrics.grossProfit)}</span>
              </div>
              <div className="sec-metric">
                <span className="label">OPEX</span>
                <span className="val">{formatCurrency(metrics.opex)}</span>
              </div>
              <div className="sec-metric">
                <span className="label">COGS</span>
                <span className="val">{formatCurrency(metrics.cogs)}</span>
              </div>
              <div className="sec-metric">
                <span className="label">ROI</span>
                <span className="val">{metrics.roi}</span>
              </div>
            </div>

            {/* Sub tags */}
            <div className="dash-sub-tags">
              <span className="dash-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> MRR: <strong>{formatCurrency(metrics.revenue)}</strong></span>
              <span className="dash-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Profit Margin per Project: <strong>{metrics.profitMargin}</strong></span>
              <span className="dash-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Client Acquisition Cost: <strong>BDT 200</strong></span>
              <span className="dash-tag"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg> Churn Rate: <strong>83.3%</strong></span>
            </div>

            <div className="dash-customize-btn-wrap">
              <button className="dash-customize-btn" onClick={() => alert("Customize coming soon")}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Customize
              </button>
            </div>

            {/* Charts Row 1 */}
            <div className="dash-grid-row-2">
              
              <div className="dash-panel">
                <h3 className="panel-title">Monthly Performance - Last {timeFilter > 0 ? timeFilter : 'All'} months</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.monthlyPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                      <XAxis dataKey="month" stroke="#5c6270" fontSize={11} tickLine={false} axisLine={{stroke: '#2a2d3e'}} />
                      <YAxis stroke="#5c6270" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `BDT ${(val/1000).toFixed(1)}K`} />
                      <RechartsTooltip cursor={{fill: '#1a1c25'}} contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} barSize={24} name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4,4,0,0]} barSize={24} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend">
                  <div className="legend-item"><span className="legend-dot" style={{background: '#3b82f6'}}></span>Revenue</div>
                  <div className="legend-item"><span className="legend-dot" style={{background: '#ef4444'}}></span>Expenses</div>
                </div>
              </div>

              <div className="dash-panel">
                <h3 className="panel-title">Revenue by Source</h3>
                <div className="chart-wrapper flex-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.revenueBySource.length ? metrics.revenueBySource : [{name: 'No Data', value: 1, fill: '#2a2d3e'}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2}>
                        {metrics.revenueBySource.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend center">
                  {metrics.revenueBySource.map((entry, idx) => (
                    <div key={idx} className="legend-item"><span className="legend-dot" style={{background: entry.fill}}></span>{entry.name}</div>
                  ))}
                </div>
              </div>

            </div>

            {/* Charts Row 2 */}
            <div className="dash-panel wide">
              <h3 className="panel-title">Profit Trend - Last {timeFilter > 0 ? timeFilter : 'All'} months</h3>
              <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.profitTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                    <XAxis dataKey="month" stroke="#5c6270" fontSize={11} tickLine={false} axisLine={{stroke: '#2a2d3e'}} />
                    <YAxis stroke="#5c6270" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `BDT ${(val/1000).toFixed(1)}K`} />
                    <RechartsTooltip contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={false} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={false} name="Expenses" />
                    <Line type="monotone" dataKey="netProfit" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Net Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="chart-legend center">
                <div className="legend-item"><span className="legend-dot" style={{background: '#3b82f6'}}></span>Revenue</div>
                <div className="legend-item"><span className="legend-dot" style={{background: '#ef4444'}}></span>Expenses</div>
                <div className="legend-item"><span className="legend-dot" style={{background: '#10b981'}}></span>Net Profit</div>
              </div>
            </div>

            {/* Bottom Rows */}
            <div className="dash-grid-row-3">
              
              <div className="dash-panel">
                <h3 className="panel-title">Cost Breakdown</h3>
                <div className="chart-wrapper flex-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.costBreakdown.length ? metrics.costBreakdown : [{name: 'No Data', value: 1, fill: '#2a2d3e'}]} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                        {metrics.costBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="chart-legend center">
                  {metrics.costBreakdown.map((entry, idx) => (
                    <div key={idx} className="legend-item"><span className="legend-dot" style={{background: entry.fill}}></span>{entry.name}</div>
                  ))}
                </div>
              </div>

              <div className="dash-panel-col">
                <div className="dash-panel flex-auto">
                  <h3 className="panel-title">Recent Transactions</h3>
                  <div className="transaction-list">
                    {metrics.recentTransactions.map((tx: any) => (
                      <div key={tx.id} className="tx-item">
                        <div className="tx-left">
                          <div className={`tx-icon ${tx.category === 'Revenue' ? 'pos' : 'neg'}`}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              {tx.category === 'Revenue' ? <path d="M5 12l5 5L20 7" /> : <line x1="5" y1="12" x2="19" y2="12" />}
                            </svg>
                          </div>
                          <div className="tx-info">
                            <h4>{tx.title}</h4>
                            <p>{tx.entryDate} · {tx.recordedBy ? tx.recordedBy.split(' ')[0] : 'System'}</p>
                          </div>
                        </div>
                        <div className={`tx-amount ${tx.category === 'Revenue' ? 'pos' : 'neg'}`}>
                          {tx.category === 'Revenue' ? '+' : '-'}BDT {tx.amount}
                        </div>
                      </div>
                    ))}
                    {metrics.recentTransactions.length === 0 && <p className="tx-empty">No recent transactions.</p>}
                  </div>
                </div>

                <div className="dash-panel flex-auto mt-16">
                  <h3 className="panel-title">Upcoming Bills</h3>
                  <div className="bill-item">
                    <div className="bill-info">
                      <h4>Internet</h4>
                      <p>Due: 2026-06-23</p>
                    </div>
                    <div className="bill-right">
                      <span className="bill-status pending">pending</span>
                      <span className="bill-amount">BDT 1.0K</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Investments Row */}
            <div className="dash-panel wide mt-16 investments-panel">
              <div className="inv-header">
                <h3 className="panel-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Investments <span className="inv-count">- 0 investors</span></h3>
                <button className="dash-tag-btn" onClick={() => alert("Add investment coming soon")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add</button>
              </div>
              <div className="inv-stats">
                <div className="inv-stat">
                  <span className="label">TOTAL RAISED</span>
                  <span className="val">BDT 0</span>
                </div>
                <div className="inv-stat">
                  <span className="label">EQUITY ALLOCATED</span>
                  <span className="val">0.00%</span>
                </div>
              </div>
              <div className="inv-empty">
                No investments recorded yet
              </div>
            </div>
          </>
        )}
      </div>

      {/* Reused Add Entry Modal */}
      {isModalOpen && (
        <div className="ge-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ge-modal" onClick={e => e.stopPropagation()}>
            <div className="ge-modal-header">
              <h2>New Global Entry</h2>
              <button className="ge-modal-close" onClick={() => setIsModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="ge-modal-body">
              {formError && <div style={{color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '6px', marginBottom: '16px'}}>{formError}</div>}
              <div className="ge-form-group"><label>Title</label><input type="text" className="ge-form-input" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Server Hosting Payment" /></div>
              <div className="ge-form-group"><label>Description</label><input type="text" className="ge-form-input" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Additional details..." /></div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div className="ge-form-group" style={{flex: 1}}><label>Amount</label><input type="number" className="ge-form-input" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" step="0.01" /></div>
                <div className="ge-form-group" style={{flex: 1}}><label>Date</label><input type="date" className="ge-form-input" value={formData.entryDate} onChange={e => setFormData({...formData, entryDate: e.target.value})} /></div>
              </div>
              <div style={{display: 'flex', gap: '16px'}}>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Company</label>
                  <select className="ge-form-select" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}>
                    <option value="XSRS IT">XSRS IT</option><option value="365 Frames">365 Frames</option><option value="EverAfter">EverAfter</option><option value="PrintDesk">PrintDesk</option>
                  </select>
                </div>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Category</label>
                  <select className="ge-form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="Expense">Expense</option><option value="Revenue">Revenue</option><option value="Asset">Asset</option><option value="Liability">Liability</option><option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="ge-modal-footer">
              <button className="ge-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="ge-btn-save" onClick={handleSaveEntry} disabled={!formData.title}>Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
