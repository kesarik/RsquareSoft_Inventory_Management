import Badge from '../../components/Badge'
import styles from './AssetDetail.module.css'

function Row({ label, children }) {
  return (
    <div className={styles.row}>
      <span className={styles.rowLabel}>{label}</span>
      <span className={styles.rowValue}>{children}</span>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function isExpired(dateStr) {
  return dateStr && new Date(dateStr) < new Date()
}

export default function AssetDetail({ asset, onClose, onEdit }) {
  if (!asset) return null

  const specs = asset.specifications
  const specEntries = specs && typeof specs === 'object' ? Object.entries(specs) : []

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div>
            <div className={styles.assetTag}>{asset.asset_tag}</div>
            <div className={styles.modelName}>{asset.model_name}</div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} title="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Status row */}
        <div className={styles.badgeRow}>
          <Badge label={asset.status} type="status" />
          <Badge label={asset.condition} type="condition" />
        </div>

        {/* Details */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Asset Info</div>
          <Row label="Category">{asset.category}</Row>
          <Row label="Vendor">{asset.vendor}</Row>
          <Row label="Serial No.">
            <span className={styles.mono}>{asset.serial_number}</span>
          </Row>
          <Row label="Purchase Date">{formatDate(asset.purchase_date)}</Row>
          <Row label="Warranty">
            {isExpired(asset.warranty_expiry)
              ? <span className={styles.expired}>Expired ({formatDate(asset.warranty_expiry)})</span>
              : formatDate(asset.warranty_expiry)}
          </Row>
          <Row label="Assigned To">
            {asset.assigned_to
              ? <span className={styles.assigned}>{asset.assigned_to}</span>
              : <span className={styles.unassigned}>Unassigned</span>}
          </Row>
        </div>

        {/* Specifications */}
        {specEntries.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Specifications</div>
            {specEntries.map(([key, val]) => (
              <Row key={key} label={key.replace(/_/g, ' ')}>
                {String(val)}
              </Row>
            ))}
          </div>
        )}

        {/* Footer actions */}
        <div className={styles.footer}>
          <button className={styles.editBtn} onClick={() => onEdit(asset)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Edit Asset
          </button>
          <button className={styles.closeFooterBtn} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
