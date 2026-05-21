import { useState, useMemo } from 'react'
import AppLayout from '../../components/AppLayout'
import ConfirmDialog from '../../components/ConfirmDialog'
import { useAllocations, useReturnAllocation } from '../../../controllers/hooks/useAllocations'
import styles from './AllocationList.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

/* ── IT Assets Tab ── */
function ITAssetsTab() {
  const [search, setSearch]       = useState('')
  const [activeOnly, setActiveOnly] = useState(false)
  const [returnTarget, setReturnTarget] = useState(null)

  const { data: allocations = [], isPending } = useAllocations(false)
  const returnMutation = useReturnAllocation()

  const filtered = useMemo(() => {
    let data = allocations
    if (activeOnly) data = data.filter((a) => !a.actual_return_date)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (a) =>
          a.model_name.toLowerCase().includes(q) ||
          a.asset_tag.toLowerCase().includes(q) ||
          a.employee_name.toLowerCase().includes(q) ||
          a.emp_id.toLowerCase().includes(q) ||
          (a.department && a.department.toLowerCase().includes(q))
      )
    }
    return data
  }, [allocations, search, activeOnly])

  const activeCount   = useMemo(() => allocations.filter((a) => !a.actual_return_date).length, [allocations])
  const returnedCount = useMemo(() => allocations.filter((a) => a.actual_return_date).length, [allocations])

  const handleReturn = async () => {
    if (!returnTarget) return
    try {
      await returnMutation.mutateAsync(returnTarget.id)
      setReturnTarget(null)
    } catch (err) {
      alert(err?.response?.data?.detail ?? 'Return failed.')
      setReturnTarget(null)
    }
  }

  return (
    <>
      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="17 1 21 5 17 9" />
              <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              <polyline points="7 23 3 19 7 15" />
              <path d="M21 13v2a4 4 0 0 1-4 4H3" />
            </svg>
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{isPending ? '—' : allocations.length}</div>
            <div className={styles.statLabel}>Total Records</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{isPending ? '—' : activeCount}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statGray}`}>
          <div className={styles.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{isPending ? '—' : returnedCount}</div>
            <div className={styles.statLabel}>Returned</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by asset, employee, Emp ID, department…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <label className={styles.toggleLabel}>
          <input
            type="checkbox"
            className={styles.toggleCheck}
            checked={activeOnly}
            onChange={(e) => setActiveOnly(e.target.checked)}
          />
          Active only
        </label>
        <span className={styles.resultCount}>
          {isPending ? '…' : `${filtered.length} of ${allocations.length} records`}
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Department</th>
                <th>Allocated On</th>
                <th>Returned On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isPending
                ? Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className={styles.skeletonRow}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j}>
                          <div className={styles.skeletonCell} style={{ width: j === 0 ? '130px' : '80px' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                  <tr>
                    <td colSpan={8}>
                      <div className={styles.emptyState}>
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polyline points="17 1 21 5 17 9" />
                          <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                          <polyline points="7 23 3 19 7 15" />
                          <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                        </svg>
                        <p>No allocations found</p>
                        <span>Allocate assets from the IT Assets page using the allocate button</span>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((alloc) => (
                    <tr key={alloc.id}>
                      <td>
                        <div className={styles.assetName}>{alloc.model_name}</div>
                        <div className={styles.assetTagSub}>{alloc.asset_tag}</div>
                      </td>
                      <td>{alloc.category}</td>
                      <td>
                        <div className={styles.empName}>{alloc.employee_name}</div>
                        <div className={styles.empId}>{alloc.emp_id}</div>
                      </td>
                      <td>{alloc.department ?? '—'}</td>
                      <td className={styles.dateText}>{formatDate(alloc.allocation_date)}</td>
                      <td className={styles.dateText}>{formatDate(alloc.actual_return_date)}</td>
                      <td>
                        {alloc.actual_return_date
                          ? <span className={styles.badgeReturned}>Returned</span>
                          : <span className={styles.badgeActive}>Active</span>
                        }
                      </td>
                      <td>
                        {!alloc.actual_return_date && (
                          <button
                            className={styles.returnBtn}
                            onClick={() => setReturnTarget(alloc)}
                            title="Record asset return"
                          >
                            Return
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {returnTarget && (
        <ConfirmDialog
          title="Return Asset"
          message={`Mark "${returnTarget.model_name}" (${returnTarget.asset_tag}) as returned from ${returnTarget.employee_name}? The asset will become Available again.`}
          onConfirm={handleReturn}
          onCancel={() => setReturnTarget(null)}
          isLoading={returnMutation.isPending}
          confirmLabel="Return"
          loadingLabel="Returning…"
        />
      )}
    </>
  )
}

/* ── Facility placeholder ── */
function FacilityTab() {
  return (
    <div className={styles.comingSoon}>
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
      <p>Facility allocations coming soon</p>
      <span>Facility stock tracking will be available in the next release</span>
    </div>
  )
}

/* ── Main page ── */
export default function AllocationList() {
  const [activeTab, setActiveTab] = useState('it')

  return (
    <AppLayout allowedRoles={['Admin', 'SuperAdmin']}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Allocations</h1>
          <p className={styles.pageSubtitle}>
            Track IT asset and facility allocations across the organisation
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar}>
        <button
          className={`${styles.tab} ${activeTab === 'it' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('it')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          IT Asset
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'facility' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('facility')}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Facility
        </button>
      </div>

      {activeTab === 'it' ? <ITAssetsTab /> : <FacilityTab />}
    </AppLayout>
  )
}
