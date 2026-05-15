import styles from './Topbar.module.css'

const PAGE_TITLES = {
  '/dashboard':  { title: 'Dashboard',   crumb: 'Home / Dashboard' },
  '/assets':     { title: 'IT Assets',   crumb: 'Inventory / IT Assets' },
  '/facility':   { title: 'Facility',    crumb: 'Inventory / Facility' },
  '/employees':  { title: 'Employees',   crumb: 'People / Employees' },
  '/allocations':{ title: 'Allocations', crumb: 'People / Allocations' },
}

export default function Topbar({ pathname }) {
  const meta = PAGE_TITLES[pathname] ?? { title: 'Page', crumb: '' }
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <span className={styles.pageTitle}>{meta.title}</span>
        <span className={styles.breadcrumb}>{meta.crumb}</span>
      </div>
      <div className={styles.right}>
        <span className={styles.date}>{today}</span>
        <span className={styles.badge}>
          <span className={styles.dot} />
          Live
        </span>
      </div>
    </header>
  )
}
