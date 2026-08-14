import { useState, useEffect, useCallback } from 'react'
import TopHeader from './shared/TopHeader'
import { useAuth } from '../context/AuthContext'
import '../styles/GlobalEntryPage.css'

interface GlobalEntry {
  id: number
  title: string
  description: string
  amount: number | null
  category: string
  company: string
  entryDate: string
  recordedBy: string
}

export default function GlobalEntryPage() {
  const { logout } = useAuth()
  const [entries, setEntries] = useState<GlobalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  const [searchTerm, setSearchTerm] = useState('')
  const [companyFilter, setCompanyFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')

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

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/global-entries', { credentials: 'include' })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) throw new Error('Failed to fetch entries')
      const data = await res.json()
      setEntries(data)
    } catch {
      setError('Could not load global entries.')
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    const init = async () => {
      await fetchEntries()
    }
    init()
  }, [fetchEntries])

  const handleSave = async () => {
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
      
      await fetchEntries()
      setIsModalOpen(false)
      setFormData({
        title: '',
        description: '',
        amount: '',
        category: 'Expense',
        company: 'XSRS IT',
        entryDate: new Date().toISOString().split('T')[0]
      })
    } catch {
      setFormError('Failed to save the entry. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return
    
    try {
      const res = await fetch(`/api/global-entries/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (!res.ok) throw new Error('Failed to delete')
      setEntries(entries.filter(e => e.id !== id))
    } catch {
      alert('Could not delete entry.')
    }
  }

  const filteredEntries = entries.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (e.description && e.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCompany = companyFilter === 'All' || e.company === companyFilter
    const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter
    return matchesSearch && matchesCompany && matchesCategory
  }).sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())

  return (
    <div className="global-entry-page">
      <TopHeader
        className="ge-header"
        leftContent={
          <span className="ge-header-title">Global Entry Hub</span>
        }
        rightContent={
          <button className="ge-add-btn" onClick={() => setIsModalOpen(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Entry
          </button>
        }
      />

      <div className="ge-body">
        <div className="ge-title-row">
          <div className="ge-title-text">
            <h1>Global Ledger</h1>
            <p>Unified view of cross-company entries, expenses, and records.</p>
          </div>
        </div>

        <div className="ge-filters-row">
          <input 
            type="text" 
            className="ge-filter-input search-input" 
            placeholder="Search entries..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="ge-filter-select"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
          >
            <option value="All">All Companies</option>
            <option value="XSRS IT">XSRS IT</option>
            <option value="365 Frames">365 Frames</option>
            <option value="EverAfter">EverAfter</option>
            <option value="PrintDesk">PrintDesk</option>
          </select>
          <select 
            className="ge-filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="All">All Categories</option>
            <option value="Expense">Expense</option>
            <option value="Revenue">Revenue</option>
            <option value="Asset">Asset</option>
            <option value="Liability">Liability</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="ge-table-container">
          <div className="ge-table-header">
            <div className="ge-col date">Date</div>
            <div className="ge-col title">Title & Details</div>
            <div className="ge-col category">Category</div>
            <div className="ge-col company">Company</div>
            <div className="ge-col amount">Amount</div>
            <div className="ge-col actions"></div>
          </div>
          
          {loading ? (
            <div className="ge-empty"><p>Loading entries...</p></div>
          ) : error ? (
            <div className="ge-empty"><p style={{color: '#f87171'}}>{error}</p></div>
          ) : filteredEntries.length === 0 ? (
            <div className="ge-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              <p>No global entries found matching your criteria.</p>
            </div>
          ) : (
            filteredEntries.map(entry => (
              <div key={entry.id} className="ge-table-row">
                <div className="ge-col date ge-date-text">{entry.entryDate}</div>
                <div className="ge-col title">
                  <div className="ge-title-main">{entry.title}</div>
                  {entry.description && <div className="ge-desc-text">{entry.description}</div>}
                </div>
                <div className="ge-col category">
                  <span className="ge-category-tag">{entry.category}</span>
                </div>
                <div className="ge-col company ge-company-text">{entry.company}</div>
                <div className="ge-col amount ge-amount-text">
                  {entry.amount != null ? `$${entry.amount.toFixed(2)}` : '-'}
                </div>
                <div className="ge-col actions">
                  <button className="ge-action-btn" onClick={() => handleDelete(entry.id)}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="ge-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="ge-modal" onClick={e => e.stopPropagation()}>
            <div className="ge-modal-header">
              <h2>New Global Entry</h2>
              <button className="ge-modal-close" onClick={() => setIsModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="ge-modal-body">
              {formError && <div style={{color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '6px'}}>{formError}</div>}
              
              <div className="ge-form-group">
                <label>Title</label>
                <input 
                  type="text" 
                  className="ge-form-input" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Server Hosting Payment"
                />
              </div>
              
              <div className="ge-form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  className="ge-form-input" 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Additional details..."
                />
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Amount (Optional)</label>
                  <input 
                    type="number" 
                    className="ge-form-input" 
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Date</label>
                  <input 
                    type="date" 
                    className="ge-form-input" 
                    value={formData.entryDate}
                    onChange={e => setFormData({...formData, entryDate: e.target.value})}
                  />
                </div>
              </div>

              <div style={{display: 'flex', gap: '16px'}}>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Company</label>
                  <select 
                    className="ge-form-select"
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                  >
                    <option value="XSRS IT">XSRS IT</option>
                    <option value="365 Frames">365 Frames</option>
                    <option value="EverAfter">EverAfter</option>
                    <option value="PrintDesk">PrintDesk</option>
                  </select>
                </div>
                <div className="ge-form-group" style={{flex: 1}}>
                  <label>Category</label>
                  <select 
                    className="ge-form-select"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    <option value="Expense">Expense</option>
                    <option value="Revenue">Revenue</option>
                    <option value="Asset">Asset</option>
                    <option value="Liability">Liability</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

            </div>
            <div className="ge-modal-footer">
              <button className="ge-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="ge-btn-save" onClick={handleSave} disabled={!formData.title}>Save Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
