import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './LoginPage.module.css'
import logo from "./assets/COMPANY_LOGO.png";

const STATIC_USERS = [
  { username: 'superadmin', password: 'super123',  role: 'SuperAdmin', name: 'Super Admin' },
  { username: 'admin',      password: 'admin123',  role: 'Admin',      name: 'Kesari Kadam' },
  { username: 'employee',   password: 'emp123',    role: 'Employee',   name: 'Rahul Sharma' },
]

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [authError, setAuthError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.username.trim()) errs.username = 'Username is required'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
    setAuthError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    setLoading(true)

    // Simulate async check
    setTimeout(() => {
      const user = STATIC_USERS.find(
        (u) => u.username === form.username && u.password === form.password
      )

      if (user) {
        sessionStorage.setItem('auth_user', JSON.stringify({ name: user.name, role: user.role }))
        navigate('/dashboard')
      } else {
        setAuthError('Invalid username or password. Please try again.')
      }
      setLoading(false)
    }, 600)
  }

  return (
    <div className={styles.page}>
      {/* ── Left branding panel ── */}
      <div className={styles.leftPanel}>
        <div className={styles.brandWrap}>
          <div className={styles.brandIcon}><img src={logo} alt="Logo" /></div>
          <div className={styles.brandName}>RsquareSoft</div>
          <div className={styles.brandSub}>Inventory Management System</div>

          <ul className={styles.featureList}>
            {[
              'Track IT assets across the organisation',
              'Manage facility & office inventory',
              'Allocate assets to employees instantly',
              'Monitor stock levels & low-stock alerts',
            ].map((f) => (
              <li key={f} className={styles.featureItem}>
                <span className={styles.featureDot} />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className={styles.rightPanel}>
        <div className={styles.formWrap}>
          <div className={styles.formHeader}>
            <h1 className={styles.formTitle}>Welcome back</h1>
            <p className={styles.formSubtitle}>Sign in to your account to continue</p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.username ? styles.hasError : ''}`}
                />
              </div>
              {errors.username && <span className={styles.errorText}>{errors.username}</span>}
            </div>

            {/* Password */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <div className={styles.inputWrap}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.passwordInput} ${errors.password ? styles.hasError : ''}`}
                />
                <button
                  type="button"
                  className={styles.toggleBtn}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            {/* Auth error */}
            {authError && <div className={styles.alertError}>{authError}</div>}

            {/* Submit */}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>

            {/* Demo credentials hint */}
            <div className={styles.divider}>demo credentials</div>
            <div className={styles.demoCredentials}>
              <div className={styles.demoTitle}>Test accounts</div>
              <div className={styles.demoGrid}>
                <span className={styles.demoKey}>SuperAdmin</span>
                <span>superadmin / super123</span>
                <span className={styles.demoKey}>Admin</span>
                <span>admin / admin123</span>
                <span className={styles.demoKey}>Employee</span>
                <span>employee / emp123</span>
              </div>
            </div>
          </form>

          <div className={styles.footer}>
            © {new Date().getFullYear()} RsquareSoft Technologies
          </div>
        </div>
      </div>
    </div>
  )
}
