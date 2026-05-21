import { useMemo } from 'react'
import { useEmployeeAllocations } from '../../../controllers/hooks/useAllocations'
import styles from './EmployeeDetail.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

function Row({ label, children }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{children}</span>
    </div>
  )
}

export default function EmployeeDetail({ employee, onClose }) {
  const { data: allocations = [], isPending } = useEmployeeAllocations(employee.id)

  const activeAllocations = useMemo(
    () => allocations.filter((a) => !a.actual_return_date),
    [allocations]
  )

  const allocationHistory = useMemo(
    () => allocations.filter((a) => a.actual_return_date),
    [allocations]
  )

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>{getInitials(employee.full_name)}</div>
            <div>
              <div className={styles.empName}>{employee.full_name}</div>
              <span className={styles.empIdBadge}>{employee.emp_id}</span>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Status badge */}
        <div className={styles.statusRow}>
          {employee.is_active
            ? <span className={styles.badgeActive}>Active</span>
            : <span className={styles.badgeInactive}>Inactive</span>
          }
          <span className={styles.assetCountBadge}>
            {isPending ? '…' : `${activeAllocations.length} asset${activeAllocations.length !== 1 ? 's' : ''} allocated`}
          </span>
        </div>

        <div className={styles.scrollBody}>

          {/* Employee info */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Employee Info</div>
            <Row label="Email">{employee.email}</Row>
            <Row label="Department">{employee.department ?? '—'}</Row>
            <Row label="Designation">{employee.designation ?? '—'}</Row>
            <Row label="Join Date">{formatDate(employee.join_date)}</Row>
          </div>

          {/* Currently allocated assets */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              Currently Allocated
              {!isPending && (
                <span className={styles.sectionCount}>{activeAllocations.length}</span>
              )}
            </div>

            {isPending ? (
              <div className={styles.loadingHint}>Loading allocations…</div>
            ) : activeAllocations.length === 0 ? (
              <div className={styles.emptyHint}>No assets currently allocated</div>
            ) : (
              <div className={styles.allocTable}>
                {activeAllocations.map((alloc) => (
                  <div key={alloc.id} className={styles.allocCard}>
                    <div className={styles.allocCardTop}>
                      <span className={styles.allocTag}>{alloc.asset_tag}</span>
                      <span className={styles.allocCategory}>{alloc.category}</span>
                    </div>
                    <div className={styles.allocModel}>{alloc.model_name}</div>
                    <div className={styles.allocMeta}>
                      Allocated on {formatDate(alloc.allocation_date)}
                      {alloc.remarks && <span className={styles.allocRemarks}> · {alloc.remarks}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Allocation history */}
          {allocationHistory.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                Allocation History
                <span className={styles.sectionCount}>{allocationHistory.length}</span>
              </div>
              <div className={styles.allocTable}>
                {allocationHistory.map((alloc) => (
                  <div key={alloc.id} className={`${styles.allocCard} ${styles.allocCardReturned}`}>
                    <div className={styles.allocCardTop}>
                      <span className={styles.allocTag}>{alloc.asset_tag}</span>
                      <span className={styles.allocCategory}>{alloc.category}</span>
                      <span className={styles.returnedBadge}>Returned</span>
                    </div>
                    <div className={styles.allocModel}>{alloc.model_name}</div>
                    <div className={styles.allocMeta}>
                      {formatDate(alloc.allocation_date)} → {formatDate(alloc.actual_return_date)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.closeFooterBtn} onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  )
}
