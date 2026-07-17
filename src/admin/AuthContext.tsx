import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { apiGet, apiJson, apiPostJson } from '@/lib/api'
import type { AdminUser } from './types'

interface AuthState {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let alive = true
    apiGet<{ user: AdminUser }>('/auth/me.php')
      .then(d => { if (alive) setUser(d.user) })
      .catch(() => { if (alive) setUser(null) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const d = await apiPostJson<{ user: AdminUser }>('/auth/login.php', { email, password })
    setUser(d.user)
  }, [])

  const logout = useCallback(async () => {
    try { await apiJson('POST', '/auth/logout.php') } catch { /* ignore */ }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
