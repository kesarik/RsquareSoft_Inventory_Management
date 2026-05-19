import styles from './Badge.module.css'

const STATUS_VARIANT = {
  Available:           'green',
  Allocated:           'indigo',
  'Under Maintenance': 'yellow',
  Damaged:             'red',
  Scrap:               'gray',
  Replaced:            'purple',
}

const CONDITION_VARIANT = {
  New:  'green',
  Good: 'blue',
  Fair: 'yellow',
  Poor: 'red',
}

export default function Badge({ label, type = 'status' }) {
  const map = type === 'condition' ? CONDITION_VARIANT : STATUS_VARIANT
  const variant = map[label] ?? 'gray'
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      <span className={styles.dot} />
      {label}
    </span>
  )
}
