import { useState } from 'react'
import type { JSX } from 'react'
import './InventoryPage.css'

/* ─── Types ──────────────────────────────────── */
type InventoryItem = {
  id: number
  name: string
  subtitle: string
  unitId: string
  company: '365F' | 'XSRS' | 'EverAfter' | 'PrintDesk'
  type: string
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor'
  qty: number
  cost: number
  threshold: number
}

type WishlistItem = {
  id: number
  name: string
  subtitle: string
  priority: 'High' | 'Medium' | 'Low'
  estimatedCost: number
  notes: string
  link?: string
  status: 'Planned' | 'Approved' | 'Purchased' | 'Pending'
  requestedBy: string
  company: '365F' | 'XSRS' | 'EverAfter' | 'PrintDesk'
}

/* ─── Helpers ────────────────────────────────── */
const svgIcon = (paths: JSX.Element) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths}
  </svg>
)

const fmt = (n: number) => `BDT ${n.toLocaleString()}`

/* ─── Sample Data ────────────────────────────── */
const inventoryData: InventoryItem[] = [
  { id: 1, name: 'Sidande', subtitle: 'Background light', unitId: '365F-BAC-THI-SID', company: '365F', type: 'Equipment', condition: 'Good', qty: 1, cost: 0, threshold: 2 },
  { id: 2, name: 'Lazy Suzan', subtitle: 'Accessories', unitId: '365F-ACC-THI-LAZ', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 1 },
  { id: 3, name: 'Smoke Go', subtitle: 'Smoke Machine', unitId: '365F-SMO-THI-SMO', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 1 },
  { id: 4, name: 'Flash Trigger', subtitle: 'Flash Trigger', unitId: '365F-FLA-GOD-FLA', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 3 },
  { id: 5, name: 'Godox X3 Pro', subtitle: 'Flash Trigger', unitId: '365F-FLA-GOD-GOD', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 1 },
  { id: 6, name: 'DJI RS-4 Mini with Combo', subtitle: 'Gimbal Stabilizer', unitId: '365F-GIM-DJI-RS4', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 1 },
  { id: 7, name: 'DJI RS-4 mini', subtitle: 'Gimbal Stabilizer', unitId: '365F-GIM-DJI-RS4', company: '365F', type: 'Equipment', condition: 'Good', qty: 1, cost: 0, threshold: 1 },
  { id: 8, name: 'DC-L1 Photographic Monitor', subtitle: 'Monitor', unitId: '365F-MON-DCL-DCL', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 2 },
  { id: 9, name: 'Simpex Stand', subtitle: 'Light Stand', unitId: '365F-STD-SIM-SIM', company: '365F', type: 'Equipment', condition: 'Good', qty: 2, cost: 0, threshold: 4 },
  { id: 10, name: 'Monitor Wall Mount', subtitle: 'Mounting Bracket', unitId: '365F-MNT-WAL-MNT', company: '365F', type: 'Accessories', condition: 'Excellent', qty: 3, cost: 0, threshold: 3 },
  { id: 11, name: 'Spot Light Clamp', subtitle: 'Clamp Mount', unitId: '365F-CLM-SPT-CLM', company: '365F', type: 'Accessories', condition: 'Good', qty: 4, cost: 0, threshold: 6 },
  { id: 12, name: 'Spot Light', subtitle: 'LED Light', unitId: '365F-LED-SPT-LED', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 5, cost: 0, threshold: 10 },
  { id: 13, name: 'Mic Stand', subtitle: 'Audio Accessories', unitId: '365F-AUD-MIC-STD', company: '365F', type: 'Accessories', condition: 'Good', qty: 2, cost: 0, threshold: 3 },
  { id: 14, name: 'Simplex Backdrop', subtitle: 'Studio Backdrop', unitId: '365F-BKD-SIM-BKD', company: '365F', type: 'Accessories', condition: 'Fair', qty: 1, cost: 0, threshold: 1 },
  { id: 15, name: 'Simplex Umbrella', subtitle: 'Light Modifier', unitId: '365F-MOD-SIM-UMB', company: '365F', type: 'Accessories', condition: 'Excellent', qty: 2, cost: 0, threshold: 2 },
  { id: 16, name: 'Sony FE 50mm f/1.8', subtitle: 'Camera Lens', unitId: '365F-LNS-SNY-50M', company: '365F', type: 'Equipment', condition: 'Excellent', qty: 1, cost: 0, threshold: 3 },
  { id: 17, name: 'XLR Cable 10m', subtitle: 'Audio Cable', unitId: '365F-CBL-XLR-10M', company: '365F', type: 'Accessories', condition: 'Good', qty: 2, cost: 0, threshold: 2 },
]

const wishlistData: WishlistItem[] = [
  { id: 1, name: 'Sony A7 IV', subtitle: 'Full-frame Camera Body', priority: 'High', estimatedCost: 248999, notes: 'Upgrade from current A6400 for wedding coverage', link: 'https://sony.com', status: 'Approved', requestedBy: 'Ashraf', company: '365F' },
  { id: 2, name: 'DJI Mavic 3 Pro', subtitle: 'Drone', priority: 'High', estimatedCost: 189000, notes: 'Aerial shots for outdoor weddings and events', status: 'Planned', requestedBy: 'Ashraf', company: '365F' },
  { id: 3, name: 'Aputure 600D Pro', subtitle: 'LED Light', priority: 'Medium', estimatedCost: 165000, notes: 'Key light for large studio setups', link: 'https://aputure.com', status: 'Pending', requestedBy: 'Rafi', company: '365F' },
  { id: 4, name: 'Rode Wireless PRO', subtitle: 'Wireless Mic System', priority: 'Medium', estimatedCost: 32000, notes: 'Dual channel wireless for interviews', status: 'Approved', requestedBy: 'Ashraf', company: '365F' },
  { id: 5, name: 'Peak Design Travel Tripod', subtitle: 'Carbon Fiber Tripod', priority: 'Low', estimatedCost: 45000, notes: 'Compact travel tripod for on-location shoots', status: 'Planned', requestedBy: 'Sakib', company: '365F' },
  { id: 6, name: 'Atomos Ninja V+', subtitle: 'External Recorder', priority: 'Low', estimatedCost: 72000, notes: 'ProRes recording for cinema projects', status: 'Planned', requestedBy: 'Rafi', company: 'EverAfter' },
  { id: 7, name: 'Dell U2723QE', subtitle: '4K Monitor', priority: 'Medium', estimatedCost: 55000, notes: 'Color-accurate editing monitor', status: 'Purchased', requestedBy: 'Ashraf', company: 'XSRS' },
]

/* ─── Low-stock items ────────────────────────── */
function getLowStockItems(items: InventoryItem[]) {
  return items.filter(i => i.qty < i.threshold)
}

/* ═══════════════════════════════════════════════
   Component
   ═══════════════════════════════════════════════ */
export default function InventoryPage() {
  const [tab, setTab] = useState<'inventory' | 'wishlist'>('inventory')
  const [alertOpen, setAlertOpen] = useState(true)
  const [search, setSearch] = useState('')

  const lowStock = getLowStockItems(inventoryData)

  /* Filtered inventory */
  const filteredInventory = inventoryData.filter(
    i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      i.unitId.toLowerCase().includes(search.toLowerCase()),
  )

  /* Filtered wishlist */
  const filteredWishlist = wishlistData.filter(
    i =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.subtitle.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <main className="inventory-page">
      {/* Header */}
      <div className="ip-header">
        <h1>Inventory &amp; Assets</h1>
        <p>Track stock levels, equipment, and future purchases</p>
      </div>

      {/* Tabs */}
      <div className="ip-tabs">
        <button
          type="button"
          className={`ip-tab${tab === 'inventory' ? ' is-active' : ''}`}
          onClick={() => { setTab('inventory'); setSearch('') }}
        >
          Inventory
        </button>
        <button
          type="button"
          className={`ip-tab${tab === 'wishlist' ? ' is-active' : ''}`}
          onClick={() => { setTab('wishlist'); setSearch('') }}
        >
          Wish List
        </button>
      </div>

      {tab === 'inventory' ? (
        <InventoryTab
          items={filteredInventory}
          lowStock={lowStock}
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          search={search}
          setSearch={setSearch}
        />
      ) : (
        <WishlistTab
          items={filteredWishlist}
          search={search}
          setSearch={setSearch}
        />
      )}
    </main>
  )
}

/* ═══════════════════════════════════════════════
   Inventory Tab
   ═══════════════════════════════════════════════ */
function InventoryTab({
  items,
  lowStock,
  alertOpen,
  setAlertOpen,
  search,
  setSearch,
}: {
  items: InventoryItem[]
  lowStock: InventoryItem[]
  alertOpen: boolean
  setAlertOpen: (v: boolean) => void
  search: string
  setSearch: (v: string) => void
}) {
  return (
    <>
      {/* Toolbar */}
      <div className="ip-toolbar">
        <div className="ip-search">
          {svgIcon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>)}
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <button type="button" className="ip-filter">
          {svgIcon(<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />)}
          All…
          {svgIcon(<path d="m6 9 6 6 6-6" />)}
        </button>

        <div className="ip-toolbar-right">
          <button type="button" className="ip-btn ip-btn-ghost">
            {svgIcon(
              <>
                <path d="M6 9V2h12v7" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" rx="1" />
              </>,
            )}
            Print Labels
          </button>
          <button type="button" className="ip-btn ip-btn-primary">
            {svgIcon(<><path d="M12 5v14" /><path d="M5 12h14" /></>)}
            Add Item
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStock.length > 0 && (
        <div className="ip-alert">
          <div
            className="ip-alert-header"
            onClick={() => setAlertOpen(!alertOpen)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setAlertOpen(!alertOpen)}
          >
            <svg className="ip-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span className="ip-alert-title">Low Stock Alerts</span>
            <svg className={`ip-alert-chevron${alertOpen ? ' is-open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          {alertOpen && (
            <div className="ip-alert-body">
              {lowStock.map(item => (
                <div key={item.id} className="ip-alert-item">
                  <strong>{item.name}</strong> <span>— {item.qty} remaining (threshold: {item.threshold})</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="ip-table-wrap">
        <table className="ip-table">
          <thead>
            <tr>
              <th>
                Item
                <span className="sort-arrows">
                  {svgIcon(<path d="m18 15-6-6-6 6" />)}
                  {svgIcon(<path d="m6 9 6 6 6-6" />)}
                </span>
              </th>
              <th>Unit ID</th>
              <th>Company</th>
              <th>Type</th>
              <th>
                Condition
                <span className="sort-arrows">
                  {svgIcon(<path d="m18 15-6-6-6 6" />)}
                  {svgIcon(<path d="m6 9 6 6 6-6" />)}
                </span>
              </th>
              <th>
                Qty
                <span className="sort-arrows">
                  {svgIcon(<path d="m18 15-6-6-6 6" />)}
                  {svgIcon(<path d="m6 9 6 6 6-6" />)}
                </span>
              </th>
              <th>
                Cost
                <span className="sort-arrows">
                  {svgIcon(<path d="m18 15-6-6-6 6" />)}
                  {svgIcon(<path d="m6 9 6 6 6-6" />)}
                </span>
              </th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="ip-item-cell">
                    <span className="ip-item-name">{item.name}</span>
                    <span className="ip-item-sub">{item.subtitle}</span>
                  </div>
                </td>
                <td><span className="ip-unit-id">{item.unitId}</span></td>
                <td>
                  <span className={`ip-company-badge badge-${item.company.toLowerCase().replace(/\s/g, '')}`}>
                    {item.company}
                  </span>
                </td>
                <td>{item.type}</td>
                <td>
                  <span className={`ip-condition cond-${item.condition.toLowerCase()}`}>
                    {item.condition}
                  </span>
                </td>
                <td className="ip-qty">{item.qty}</td>
                <td className="ip-cost">{fmt(item.cost)}</td>
                <td className="ip-cost ip-cost-value">{fmt(item.cost * item.qty)}</td>
                <td>
                  <div className="ip-actions">
                    <button type="button" className="ip-action-btn" title="Tag">
                      {svgIcon(
                        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82ZM7 7h.01" />,
                      )}
                    </button>
                    <button type="button" className="ip-action-btn" title="Edit">
                      {svgIcon(
                        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></>,
                      )}
                    </button>
                    <button type="button" className="ip-action-btn action-delete" title="Delete">
                      {svgIcon(
                        <><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════
   Wish List Tab
   ═══════════════════════════════════════════════ */
function WishlistTab({
  items,
  search,
  setSearch,
}: {
  items: WishlistItem[]
  search: string
  setSearch: (v: string) => void
}) {
  return (
    <>
      {/* Toolbar */}
      <div className="ip-wishlist-header">
        <div className="ip-search">
          {svgIcon(<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></>)}
          <input
            type="text"
            placeholder="Search wishlist..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="ip-toolbar-right">
          <button type="button" className="ip-btn ip-btn-ghost">
            {svgIcon(
              <>
                <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
                <path d="M14 3v5h5M8 13h8M8 17h8" />
              </>,
            )}
            Export List
          </button>
          <button type="button" className="ip-btn ip-btn-primary">
            {svgIcon(<><path d="M12 5v14" /><path d="M5 12h14" /></>)}
            Add Wish
          </button>
        </div>
      </div>

      {/* Wish List Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        <SummaryCard label="Total Items" value={wishlistData.length.toString()} color="#60a5fa" icon={<><path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" /><path d="M3 8l9 5 9-5M12 13v8" /></>} />
        <SummaryCard label="Approved" value={wishlistData.filter(i => i.status === 'Approved').length.toString()} color="#22c55e" icon={<><path d="M20 6 9 17l-5-5" /></>} />
        <SummaryCard label="Est. Total" value={`৳${(wishlistData.reduce((s, i) => s + i.estimatedCost, 0) / 1000).toFixed(0)}K`} color="#f59e0b" icon={<><circle cx="12" cy="12" r="10" /><path d="M12 6v12M15 9.5a3 3 0 0 0-3-2.5c-1.7 0-3 1-3 2.5s1.3 2.5 3 2.5 3 1 3 2.5-1.3 2.5-3 2.5" /></>} />
        <SummaryCard label="High Priority" value={wishlistData.filter(i => i.priority === 'High').length.toString()} color="#ef4444" icon={<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} />
      </div>

      {/* Table */}
      <div className="ip-table-wrap">
        <table className="ip-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Company</th>
              <th>Priority</th>
              <th>Est. Cost</th>
              <th>Notes</th>
              <th>Requested By</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="ip-item-cell">
                    <span className="ip-item-name">{item.name}</span>
                    <span className="ip-item-sub">{item.subtitle}</span>
                  </div>
                </td>
                <td>
                  <span className={`ip-company-badge badge-${item.company.toLowerCase().replace(/\s/g, '')}`}>
                    {item.company}
                  </span>
                </td>
                <td>
                  <span className={`ip-priority priority-${item.priority.toLowerCase()}`}>
                    <span className="ip-priority-dot" />
                    {item.priority}
                  </span>
                </td>
                <td className="ip-cost">{fmt(item.estimatedCost)}</td>
                <td>
                  <span className="ip-note" title={item.notes}>{item.notes}</span>
                </td>
                <td>{item.requestedBy}</td>
                <td>
                  <span className={`ip-status status-${item.status.toLowerCase()}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <div className="ip-actions">
                    {item.link && (
                      <button type="button" className="ip-action-btn" title="Open link">
                        {svgIcon(
                          <><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><path d="M15 3h6v6" /><path d="M10 14 21 3" /></>,
                        )}
                      </button>
                    )}
                    <button type="button" className="ip-action-btn" title="Edit">
                      {svgIcon(
                        <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z" /></>,
                      )}
                    </button>
                    <button type="button" className="ip-action-btn action-delete" title="Remove">
                      {svgIcon(
                        <><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

/* ─── Summary Card ───────────────────────────── */
function SummaryCard({ label, value, color, icon }: { label: string; value: string; color: string; icon: JSX.Element }) {
  return (
    <div
      style={{
        background: 'var(--ip-surface)',
        border: '1px solid var(--ip-border)',
        borderRadius: 'var(--ip-radius)',
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${color}15`,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: 20, height: 20 }}
        >
          {icon}
        </svg>
      </div>
      <div>
        <div style={{ fontSize: 12, color: 'var(--ip-muted)', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--ip-text-strong)', letterSpacing: '-0.3px' }}>{value}</div>
      </div>
    </div>
  )
}
