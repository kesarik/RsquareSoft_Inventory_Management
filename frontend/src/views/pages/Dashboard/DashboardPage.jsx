import AppLayout from '../../components/AppLayout'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className={styles.emptyWrap}>
        <div className={styles.emptyIcon}>🚧</div>
        <h2 className={styles.emptyTitle}>Dashboard coming soon</h2>
        <p className={styles.emptyDesc}>
          This space will show asset summaries, allocation stats, and stock alerts.
          Use the sidebar to navigate to any module.
        </p>
        <span className={styles.tag}>In Progress</span>
      </div>
    </AppLayout>
  )
}
