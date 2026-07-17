import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import type { ApiError } from '@/lib/api'
import s from './admin.module.css'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
      navigate('/admin', { replace: true })
    } catch (err) {
      setError((err as ApiError).message || 'Login failed.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={s.loginWrap}>
      <form className={s.loginCard} onSubmit={onSubmit}>
        <h1 className={s.loginLogo}>Antra Admin</h1>
        <p className={s.loginSub}>Sign in to manage jobs, applications and surveys.</p>

        {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}

        <div className={s.form}>
          <div className={s.field}>
            <label className={s.label} htmlFor="email">Email</label>
            <input id="email" type="email" className={s.input} value={email}
              onChange={e => setEmail(e.target.value)} autoComplete="username" required />
          </div>
          <div className={s.field}>
            <label className={s.label} htmlFor="password">Password</label>
            <input id="password" type="password" className={s.input} value={password}
              onChange={e => setPassword(e.target.value)} autoComplete="current-password" required />
          </div>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}
