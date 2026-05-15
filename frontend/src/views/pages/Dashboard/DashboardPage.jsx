import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import styles from './DashboardPage.module.css'

export default function DashboardPage() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('auth_user')) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname={location.pathname} />
        <main className={styles.content}>
          <div className={styles.emptyWrap}>
            <div className={styles.emptyIcon}>🚧</div>
            <h2 className={styles.emptyTitle}>Dashboard coming soon</h2>
            <p className={styles.emptyDesc}>
              This space will show asset summaries, allocation stats, and stock
              alerts. Use the sidebar to navigate to any module.
            </p>
            <span className={styles.tag}>In Progress</span>
          </div>
        </main>
      </div>
    </div>
  )
}
