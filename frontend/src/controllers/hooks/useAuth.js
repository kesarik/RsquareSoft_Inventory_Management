export function useAuth() {
  const raw = sessionStorage.getItem('auth_user')
  if (!raw) return { user: null, role: null, isAuthenticated: false }
  try {
    const user = JSON.parse(raw)
    return { user, role: user.role, isAuthenticated: true }
  } catch {
    return { user: null, role: null, isAuthenticated: false }
  }
}

export function canAccess(role, allowedRoles) {
  if (!allowedRoles || allowedRoles.length === 0) return true
  return allowedRoles.includes(role)
}
