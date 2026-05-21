import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../controllers/hooks/useAuth'
import styles from './Sidebar.module.css'
import companyLogo from '../pages/Login/assets/COMPANY_LOGO.png'

/* ── Icons ── */
const Icon = ({ d, extra }) => (
  <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    {d}
    {extra}
  </svg>
)

const ICONS = {
  dashboard: <Icon d={<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>} />,
  assets:    <Icon d={<><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></>} />,
  facility:  <Icon d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />,
  employees: <Icon d={<><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>} />,
  allocations:<Icon d={<><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>} />,
  myAssets:  <Icon d={<><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></>} />,
  profile:   <Icon d={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />,
  categories:<Icon d={<><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>} />,
  vendors:   <Icon d={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/><circle cx="12" cy="7" r="1"/></>} />,
}

/* ── Nav config per role ── */
const NAV_CONFIG = {
  Employee: [
    {
      label: 'Main',
      items: [{ to: '/dashboard', icon: ICONS.dashboard, label: 'Dashboard' }],
    },
    {
      label: 'My Space',
      items: [
        { to: '/my-assets', icon: ICONS.myAssets,  label: 'My Assets' },
        { to: '/profile',   icon: ICONS.profile,   label: 'My Profile' },
      ],
    },
  ],
  Admin: [
    {
      label: 'Main',
      items: [{ to: '/dashboard', icon: ICONS.dashboard, label: 'Dashboard' }],
    },
    {
      label: 'Inventory',
      items: [
        { to: '/assets',   icon: ICONS.assets,   label: 'IT Assets' },
        { to: '/facility', icon: ICONS.facility,  label: 'Facility' },
      ],
    },
    {
      label: 'People',
      items: [
        { to: '/employees',   icon: ICONS.employees,    label: 'Employees' },
        { to: '/allocations', icon: ICONS.allocations,  label: 'Allocations' },
      ],
    },
  ],
  SuperAdmin: [
    {
      label: 'Main',
      items: [{ to: '/dashboard', icon: ICONS.dashboard, label: 'Dashboard' }],
    },
    {
      label: 'Inventory',
      items: [
        { to: '/assets',   icon: ICONS.assets,   label: 'IT Assets' },
        { to: '/facility', icon: ICONS.facility,  label: 'Facility' },
      ],
    },
    {
      label: 'People',
      items: [
        { to: '/employees',   icon: ICONS.employees,   label: 'Employees' },
        { to: '/allocations', icon: ICONS.allocations, label: 'Allocations' },
      ],
    },
    {
      label: 'Master Data',
      items: [
        { to: '/categories', icon: ICONS.categories, label: 'Categories' },
        { to: '/vendors',    icon: ICONS.vendors,    label: 'Vendors' },
      ],
    },
  ],
}

const ROLE_BADGE = {
  Employee:   styles.roleEmployee,
  Admin:      styles.roleAdmin,
  SuperAdmin: styles.roleSuperAdmin,
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, role } = useAuth()
  const name     = user?.name ?? 'User'
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const nav      = NAV_CONFIG[role] ?? NAV_CONFIG.Employee

  const handleLogout = () => {
    sessionStorage.removeItem('auth_user')
    navigate('/login')
  }

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <div className={styles.brand}>
        <img src={companyLogo} alt="RsquareSoft" className={styles.brandLogo} />
        <div className={styles.brandText}>
          <span className={styles.brandName}>RsquareSoft</span>
          <span className={styles.brandSub}>Inventory</span>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {nav.map((section) => (
          <div key={section.label}>
            <div className={styles.sectionLabel}>{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ''}`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className={styles.footer}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>{initials}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{name}</div>
            <span className={`${styles.roleBadge} ${ROLE_BADGE[role] ?? styles.roleEmployee}`}>
              {role ?? 'Employee'}
            </span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sign out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  )
}
