import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useAuth, canAccess } from '../../controllers/hooks/useAuth'
import styles from './AppLayout.module.css'

function AccessDenied({ userRole, allowedRoles }) {
  const navigate = useNavigate()
  const roleList = allowedRoles.join(' and ')
  return (
    <div className={styles.accessDenied}>
      <div className={styles.adIconWrap}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className={styles.adTitle}>Access Restricted</h2>
      <p className={styles.adDesc}>
        This page is only accessible to <strong>{roleList}</strong> users.
        You are signed in as <span className={styles.adRolePill}>{userRole}</span>.
      </p>
      <button className={styles.adBtn} onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  )
}

export default function AppLayout({ children, allowedRoles = null }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, role, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  const hasAccess = canAccess(role, allowedRoles)

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar pathname={location.pathname} />
        <main className={styles.content}>
          {hasAccess ? children : (
            <AccessDenied userRole={role} allowedRoles={allowedRoles} />
          )}
        </main>
      </div>
    </div>
  )
}
