import { useState, useMemo } from 'react'
import AppLayout from '../../components/AppLayout'
import Badge from '../../components/Badge'
import ConfirmDialog from '../../components/ConfirmDialog'
import AssetDetail from './AssetDetail'
import AssetForm from './AssetForm'
import { useAssets, useDeleteAsset } from '../../../controllers/hooks/useAssets'
import { ASSET_STATUSES, ASSET_CONDITIONS } from '../../../models/asset'
import AllocationForm from '../Allocations/AllocationForm'
import styles from './AssetList.module.css'

/* ── Stat card definitions ── */
const STAT_CARDS = [
  {
    key: 'total',
    label: 'Total Assets',
    status: null,
    colorClass: styles.statBlue,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    key: 'available',
    label: 'Available',
    status: 'Available',
    colorClass: styles.statGreen,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    key: 'allocated',
    label: 'Allocated',
    status: 'Allocated',
    colorClass: styles.statIndigo,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" />
      </svg>
    ),
  },
  {
    key: 'maintenance',
    label: 'Under Maintenance',
    status: 'Under Maintenance',
    colorClass: styles.statYellow,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
  },
  {
    key: 'damaged',
    label: 'Damaged',
    status: 'Damaged',
    colorClass: styles.statRed,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
]

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function isExpired(dateStr) {
  return dateStr && new Date(dateStr) < new Date()
}

/* ── Component ── */
export default function AssetList() {
  const [search, setSearch]     = useState('')
  const [status, setStatus]     = useState('')
  const [category, setCategory] = useState('')
  const [activeStatKey, setActiveStatKey] = useState(null)

  /* modal state */
  const [viewAsset, setViewAsset]       = useState(null)
  const [editAsset, setEditAsset]       = useState(null)  // null=closed, {}=create, asset=edit
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [allocateTarget, setAllocateTarget] = useState(null)

  const { data: assets = [], isPending } = useAssets()
  const deleteMutation = useDeleteAsset()

  /* dynamic category list from real data */
  const categoryOptions = useMemo(
    () => [...new Set(assets.map((a) => a.category))].sort(),
    [assets]
  )

  /* client-side filtering */
  const filtered = useMemo(() => {
    let data = assets

    const effectiveStatus = activeStatKey
      ? STAT_CARDS.find((c) => c.key === activeStatKey)?.status
      : status

    if (effectiveStatus) data = data.filter((a) => a.status === effectiveStatus)
    if (category)         data = data.filter((a) => a.category === category)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (a) =>
          a.model_name.toLowerCase().includes(q) ||
          a.asset_tag.toLowerCase().includes(q) ||
          a.serial_number.toLowerCase().includes(q) ||
          (a.assigned_to && a.assigned_to.toLowerCase().includes(q))
      )
    }
    return data
  }, [assets, search, status, category, activeStatKey])

  /* stat counts */
  const counts = useMemo(() => ({
    total:       assets.length,
    available:   assets.filter((a) => a.status === 'Available').length,
    allocated:   assets.filter((a) => a.status === 'Allocated').length,
    maintenance: assets.filter((a) => a.status === 'Under Maintenance').length,
    damaged:     assets.filter((a) => a.status === 'Damaged').length,
  }), [assets])

  const handleStatClick = (key) => {
    setActiveStatKey((prev) => (prev === key ? null : key))
    setStatus('')
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setCategory('')
    setActiveStatKey(null)
  }

  const hasActiveFilters = search || status || category || activeStatKey

  /* modal handlers */
  const openView     = (asset) => { setViewAsset(asset); setEditAsset(null); setAllocateTarget(null) }
  const openEdit     = (asset) => { setEditAsset(asset); setViewAsset(null); setAllocateTarget(null) }
  const openCreate   = ()      => { setEditAsset({}); setViewAsset(null); setAllocateTarget(null) }
  const openAllocate = (asset) => { setAllocateTarget(asset); setViewAsset(null); setEditAsset(null) }
  const closeModals  = ()      => { setViewAsset(null); setEditAsset(null); setAllocateTarget(null) }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    try {
      await deleteMutation.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
    } catch (err) {
      const msg = err?.response?.data?.detail ?? 'Delete failed.'
      alert(msg)
      setDeleteTarget(null)
    }
  }

  return (
    <AppLayout allowedRoles={['Admin', 'SuperAdmin']}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>IT Assets</h1>
          <p className={styles.pageSubtitle}>
            Manage and track all IT equipment across the organisation
          </p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Asset
        </button>
      </div>

      {/* Stats row — clickable to filter */}
      <div className={styles.statsRow}>
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className={`${styles.statCard} ${card.colorClass} ${activeStatKey === card.key ? styles.active : ''}`}
            onClick={() => handleStatClick(card.key)}
            title={`Filter by: ${card.label}`}
          >
            <div className={styles.statIconWrap}>{card.icon}</div>
            <div className={styles.statBody}>
              <div className={styles.statValue}>
                {isPending ? '—' : counts[card.key]}
              </div>
              <div className={styles.statLabel}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by model, tag, serial no. or assignee…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveStatKey(null) }}
          />
        </div>

        <select
          className={styles.select}
          value={status}
          onChange={(e) => { setStatus(e.target.value); setActiveStatKey(null) }}
        >
          <option value="">All Statuses</option>
          {ASSET_STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className={styles.select}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            Clear
          </button>
        )}

        <span className={styles.resultCount}>
          {isPending ? '…' : `${filtered.length} of ${assets.length} assets`}
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Model</th>
                <th>Category</th>
                <th>Vendor</th>
                <th>Serial No.</th>
                <th>Status</th>
                <th>Condition</th>
                <th>Assigned To</th>
                <th>Purchase Date</th>
                <th>Warranty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isPending
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className={styles.skeletonRow}>
                      {Array.from({ length: 10 }).map((_, j) => (
                        <td key={j}>
                          <div className={styles.skeletonCell} style={{ width: j === 0 ? '140px' : '80px' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={10}>
                      <div className={styles.emptyState}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <p>No assets found</p>
                        <span>Try adjusting your search or filter criteria</span>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((asset) => (
                    <tr key={asset.id}>
                      <td>
                        <div className={styles.modelName}>{asset.model_name}</div>
                        <div className={styles.assetTagSub}>{asset.asset_tag}</div>
                      </td>
                      <td>{asset.category}</td>
                      <td>
                        <div className={styles.secondary} style={{ marginTop: 0 }}>{asset.vendor}</div>
                      </td>
                      <td>
                        <span className={styles.mono}>{asset.serial_number}</span>
                      </td>
                      <td>
                        <Badge label={asset.status} type="status" />
                      </td>
                      <td>
                        <Badge label={asset.condition} type="condition" />
                      </td>
                      <td>
                        {asset.assigned_to
                          ? <span className={styles.assignedTo}>{asset.assigned_to}</span>
                          : <span className={styles.unassigned}>Unassigned</span>
                        }
                      </td>
                      <td>
                        <span className={styles.dateText}>{formatDate(asset.purchase_date)}</span>
                      </td>
                      <td>
                        {isExpired(asset.warranty_expiry)
                          ? <span className={styles.warrantyExpired}>Expired</span>
                          : <span className={styles.dateText}>{formatDate(asset.warranty_expiry)}</span>
                        }
                      </td>
                      <td>
                        <div className={styles.actions}>
                          {asset.status === 'Available' ? (
                            <button
                              className={`${styles.iconBtn} ${styles.allocate}`}
                              title="Allocate to employee"
                              onClick={() => openAllocate(asset)}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="17 1 21 5 17 9" />
                                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                                <polyline points="7 23 3 19 7 15" />
                                <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                              </svg>
                            </button>
                          ) : asset.status === 'Allocated' ? (
                            <span className={styles.allocatedTick} title="Currently allocated">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          ) : asset.status === 'Under Maintenance' ? (
                            <span className={styles.statusEmoji} title="Under maintenance">🔧</span>
                          ) : asset.status === 'Damaged' ? (
                            <span className={styles.statusEmoji} title="Damaged">⚠️</span>
                          ) : asset.status === 'Scrap' ? (
                            <span className={styles.statusEmoji} title="Scrapped">🗑️</span>
                          ) : asset.status === 'Replaced' ? (
                            <span className={styles.statusEmoji} title="Replaced">🔄</span>
                          ) : (
                            <span className={styles.iconBtnGhost} />
                          )}
                          <button
                            className={styles.iconBtn}
                            title="View details"
                            onClick={() => openView(asset)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                          <button
                            className={styles.iconBtn}
                            title="Edit asset"
                            onClick={() => openEdit(asset)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                          </button>
                          <button
                            className={`${styles.iconBtn} ${styles.danger}`}
                            title="Delete asset"
                            onClick={() => setDeleteTarget(asset)}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {viewAsset && (
        <AssetDetail
          asset={viewAsset}
          onClose={closeModals}
          onEdit={(a) => { setViewAsset(null); setEditAsset(a) }}
        />
      )}

      {editAsset !== null && (
        <AssetForm
          asset={Object.keys(editAsset).length === 0 ? null : editAsset}
          onClose={closeModals}
        />
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete Asset"
          message={`Are you sure you want to delete "${deleteTarget.model_name}" (${deleteTarget.asset_tag})? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={deleteMutation.isPending}
        />
      )}

      {allocateTarget && (
        <AllocationForm
          asset={allocateTarget}
          onClose={() => setAllocateTarget(null)}
        />
      )}
    </AppLayout>
  )
}
