import { useState, useMemo } from 'react'
import AppLayout from '../../components/AppLayout'
import { useEmployees } from '../../../controllers/hooks/useEmployees'
import EmployeeDetail from './EmployeeDetail'
import styles from './EmployeeList.module.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default function EmployeeList() {
  const [search, setSearch]             = useState('')
  const [filterDept, setFilterDept]     = useState('')
  const [viewEmployee, setViewEmployee] = useState(null)

  const { data: employees = [], isPending } = useEmployees()

  const departmentOptions = useMemo(
    () => [...new Set(employees.map((e) => e.department).filter(Boolean))].sort(),
    [employees]
  )

  const filtered = useMemo(() => {
    let data = employees
    if (filterDept) data = data.filter((e) => e.department === filterDept)
    if (search) {
      const q = search.toLowerCase()
      data = data.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.emp_id.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          (e.designation && e.designation.toLowerCase().includes(q))
      )
    }
    return data
  }, [employees, search, filterDept])

  const activeCount = useMemo(() => employees.filter((e) => e.is_active).length, [employees])
  const deptCount   = useMemo(
    () => new Set(employees.map((e) => e.department).filter(Boolean)).size,
    [employees]
  )

  const clearFilters = () => { setSearch(''); setFilterDept('') }
  const hasFilters   = search || filterDept

  return (
    <AppLayout allowedRoles={['Admin', 'SuperAdmin']}>

      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Employees</h1>
          <p className={styles.pageSubtitle}>View employees and their allocated assets</p>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} ${styles.statBlue}`}>
          <div className={styles.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{isPending ? '—' : employees.length}</div>
            <div className={styles.statLabel}>Total Employees</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statGreen}`}>
          <div className={styles.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{isPending ? '—' : activeCount}</div>
            <div className={styles.statLabel}>Active</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.statIndigo}`}>
          <div className={styles.statIconWrap}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <div className={styles.statBody}>
            <div className={styles.statValue}>{isPending ? '—' : deptCount}</div>
            <div className={styles.statLabel}>Departments</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, Emp ID, email, designation…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className={styles.select}
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
        >
          <option value="">All Departments</option>
          {departmentOptions.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {hasFilters && (
          <button className={styles.clearBtn} onClick={clearFilters}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
            Clear
          </button>
        )}

        <span className={styles.resultCount}>
          {isPending ? '…' : `${filtered.length} of ${employees.length} employees`}
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Emp ID</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Join Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isPending
                ? Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className={styles.skeletonRow}>
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j}>
                          <div className={styles.skeletonCell} style={{ width: j === 0 ? '160px' : '90px' }} />
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
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                        </svg>
                        <p>No employees found</p>
                        <span>Try adjusting your search or filter</span>
                      </div>
                    </td>
                  </tr>
                )
                : filtered.map((emp) => (
                    <tr key={emp.id}>
                      <td>
                        <div className={styles.empCell}>
                          <div className={styles.avatar}>{getInitials(emp.full_name)}</div>
                          <div className={styles.empName}>{emp.full_name}</div>
                        </div>
                      </td>
                      <td>
                        <span className={styles.empIdBadge}>{emp.emp_id}</span>
                      </td>
                      <td className={styles.emailCell}>{emp.email}</td>
                      <td>{emp.department ?? '—'}</td>
                      <td className={styles.designationCell}>{emp.designation ?? '—'}</td>
                      <td className={styles.dateText}>{formatDate(emp.join_date)}</td>
                      <td>
                        {emp.is_active
                          ? <span className={styles.badgeActive}>Active</span>
                          : <span className={styles.badgeInactive}>Inactive</span>
                        }
                      </td>
                      <td>
                        <button
                          className={styles.viewBtn}
                          onClick={() => setViewEmployee(emp)}
                          title="View allocations"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          View
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail slide-in panel */}
      {viewEmployee && (
        <EmployeeDetail
          employee={viewEmployee}
          onClose={() => setViewEmployee(null)}
        />
      )}

    </AppLayout>
  )
}
