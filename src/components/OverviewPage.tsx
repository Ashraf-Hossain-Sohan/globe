import { useState, useEffect } from 'react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import '../styles/OverviewPage.css'
import '../styles/GlobalEntryPage.css' // Reuse modal styles

interface OverviewMetrics {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: string
  inventoryValue: number
  accountsPayable: number
  monthlyBurnRate: number
  workingCapital: number
  revenueByCompany: any[]
  costDistribution: any[]
  monthlyTrend: any[]
  recentActivity: any[]
}

export default function OverviewPage() {
  const { user, logout } = useAuth()
  const [metrics, setMetrics] = useState<OverviewMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [timeFilter, setTimeFilter] = useState(6) // default 6 months

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
    company: 'XSRS IT',
    entryDate: new Date().toISOString().split('T')[0]
  })
  const [formError, setFormError] = useState('')

  useEffect(() => {
    fetchOverview()
  }, [timeFilter])

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications', { credentials: 'include' })
      if (res.ok) {
        setNotifications(await res.json())
      }
    } catch (e) { console.error(e) }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST', credentials: 'include' })
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (e) { console.error(e) }
  }

  const fetchOverview = async () => {
    setLoading(true)
    setError('')
    try {
      const url = timeFilter > 0 
        ? `/api/dashboard/overview?months=${timeFilter}` 
        : `/api/dashboard/overview`
      const res = await fetch(url, { credentials: 'include' })
      if (!res.ok) throw new Error('Failed to load overview data')
      const data = await res.json()
      setMetrics(data)
    } catch (err) {
      setError('Could not load overview metrics.')
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
      
      await fetchOverview() // Instant refresh
      setIsModalOpen(false)
      setFormData({
        title: '', description: '', amount: '',
        category: 'Expense', company: 'XSRS IT',
        entryDate: new Date().toISOString().split('T')[0]
      })
    } catch (err) {
      setFormError('Failed to save the entry.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this transaction across the group?')) return
    try {
      const res = await fetch(`/api/global-entries/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to delete')
      fetchOverview() // Instant refresh
    } catch (err) {
      alert('Could not delete entry.')
    }
  }

  const formatCurrency = (val: number) => {
    if (val >= 1000) return `BDT ${(val / 1000).toFixed(1)}K`
    return `BDT ${val.toFixed(1)}`
  }

  return (
    <div className="overview-page">
      <header className="overview-header">
        <div className="overview-header-left">
          <div className="dash-company-select">
            <span>All Companies</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </div>
        </div>
        <div className="overview-header-right">
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

      <div className="overview-body">
        <div className="dash-title-section">
          <div className="overview-title">
            <h1>Group Overview</h1>
            <p style={{margin:0}}>Performance across all 4 companies</p>
          </div>
          <div className="dash-time-filters">
            <button className={timeFilter === 3 ? 'active' : ''} onClick={() => setTimeFilter(3)}>Last 3 months</button>
            <button className={timeFilter === 6 ? 'active' : ''} onClick={() => setTimeFilter(6)}>Last 6 months</button>
            <button className={timeFilter === 12 ? 'active' : ''} onClick={() => setTimeFilter(12)}>Last 12 months</button>
            <button className={timeFilter === 0 ? 'active' : ''} onClick={() => setTimeFilter(0)}>All time</button>
          </div>
        </div>

        {loading ? <div style={{padding:'20px'}}>Loading dashboard...</div> : error ? <div style={{color:'red'}}>{error}</div> : metrics && (
          <>
            {/* Top 8 Metrics */}
            <div className="overview-metrics-grid" style={{marginTop:'24px'}}>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">TOTAL REVENUE</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.totalRevenue)}</div>
                <div className="om-trend">— 0% from last month</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">TOTAL EXPENSES</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.totalExpenses)}</div>
                <div className="om-trend">— 0% from last month</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">NET PROFIT</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.netProfit)}</div>
                <div className="om-trend">— 0% from last month</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">PROFIT MARGIN</span>
                  <div className="om-icon">%</div>
                </div>
                <div className="om-value">{metrics.profitMargin}</div>
                <div className="om-trend">— 0% from last month</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">INVENTORY VALUE</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.inventoryValue)}</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">ACCOUNTS PAYABLE</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.accountsPayable)}</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">MONTHLY BURN RATE</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.monthlyBurnRate)}</div>
              </div>
              <div className="overview-metric">
                <div className="om-header">
                  <span className="om-label">WORKING CAPITAL</span>
                  <div className="om-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg></div>
                </div>
                <div className="om-value">{formatCurrency(metrics.workingCapital)}</div>
              </div>
            </div>

            {/* Middle Charts */}
            <div className="overview-charts-mid">
              <div className="ov-chart-card">
                <h3>Revenue by Company</h3>
                <div className="ov-chart-wrap">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.revenueByCompany} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                      <XAxis dataKey="company" stroke="#5c6270" fontSize={10} tickLine={false} axisLine={{stroke: '#2a2d3e'}} />
                      <YAxis stroke="#5c6270" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `BDT ${(val/1000).toFixed(1)}K`} />
                      <RechartsTooltip cursor={{fill: '#1a1c25'}} contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                      <Bar dataKey="revenue" fill="#3b82f6" radius={[4,4,0,0]} barSize={40} name="Revenue" />
                      <Bar dataKey="expenses" fill="#ef4444" radius={[4,4,0,0]} barSize={40} name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="ov-chart-card">
                <h3>Cost Distribution</h3>
                <div className="ov-chart-wrap flex-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={metrics.costDistribution.length ? metrics.costDistribution : [{name: 'No Data', value: 1, fill: '#2a2d3e'}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                        {metrics.costDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <RechartsTooltip contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="ov-chart-legend">
                  <div className="leg-item"><span style={{background: '#3b82f6'}} />XSRS</div>
                  <div className="leg-item"><span style={{background: '#f97316'}} />365F</div>
                  <div className="leg-item"><span style={{background: '#ef4444'}} />EA</div>
                  <div className="leg-item"><span style={{background: '#10b981'}} />PD</div>
                </div>
              </div>
            </div>

            {/* Bottom Line Chart */}
            <div className="ov-chart-card wide">
              <h3>Monthly Trend</h3>
              <div className="ov-chart-wrap large">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={metrics.monthlyTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2d3e" vertical={false} />
                    <XAxis dataKey="month" stroke="#5c6270" fontSize={10} tickLine={false} axisLine={{stroke: '#2a2d3e'}} />
                    <YAxis stroke="#5c6270" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `BDT ${(val/1000).toFixed(1)}K`} />
                    <RechartsTooltip contentStyle={{backgroundColor: '#161821', borderColor: '#2a2d3e', color: '#e8eaf0'}} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{r:4, fill:'#0b0c10', stroke:'#3b82f6', strokeWidth:2}} name="Revenue" />
                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} dot={{r:4, fill:'#0b0c10', stroke:'#ef4444', strokeWidth:2}} name="Expenses" />
                    <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} dot={{r:4, fill:'#0b0c10', stroke:'#10b981', strokeWidth:2}} name="Net Profit" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="ov-chart-legend bottom">
                <div className="leg-item"><span style={{background: '#3b82f6'}} />revenue</div>
                <div className="leg-item"><span style={{background: '#ef4444'}} />expenses</div>
                <div className="leg-item"><span style={{background: '#10b981'}} />profit</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="ov-chart-card wide activity" style={{marginTop:'16px'}}>
              <h3>Recent Activity</h3>
              <div className="ov-activity-list">
                {metrics.recentActivity.map((tx: any) => {
                  const shortName = tx.company === 'XSRS IT' ? 'XSRS' : tx.company === '365 Frames' ? '365F' : tx.company === 'EverAfter' ? 'EA' : 'PD'
                  const color = tx.company === 'XSRS IT' ? '#3b82f6' : tx.company === '365 Frames' ? '#f97316' : tx.company === 'EverAfter' ? '#ef4444' : '#10b981'
                  return (
                    <div key={tx.id} className="ov-activity-item">
                      <div className="ov-act-left">
                        <div className={`ov-act-icon ${tx.category === 'Revenue' ? 'pos' : 'neg'}`}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            {tx.category === 'Revenue' ? <path d="M5 12l5 5L20 7" /> : <line x1="5" y1="12" x2="19" y2="12" />}
                          </svg>
                        </div>
                        <div className="ov-act-info">
                          <h4>{tx.title}</h4>
                          <p>{tx.entryDate}</p>
                        </div>
                      </div>
                      <div className="ov-act-right">
                        <span className="ov-act-badge" style={{background: `${color}20`, color: color}}>{shortName}</span>
                        <span className={`ov-act-amt ${tx.category === 'Revenue' ? 'pos' : 'neg'}`}>
                          {tx.category === 'Revenue' ? '+' : '-'}BDT {tx.amount}
                        </span>
                        <button className="ov-act-edit" onClick={() => alert("Edit coming soon")}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></button>
                        <button className="ov-act-del" onClick={() => handleDelete(tx.id)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                      </div>
                    </div>
                  )
                })}
                {metrics.recentActivity.length === 0 && <p className="ov-empty">No activity found.</p>}
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
