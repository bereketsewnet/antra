import { useState } from 'react'
import { apiJson, type ApiError } from '@/lib/api'
import { useAuth } from './AuthContext'
import s from './admin.module.css'

export function Profile() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNew] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setMsg(''); setFieldErrors({})
    const payload: any = { name, email }
    if (newPassword) { payload.new_password = newPassword; payload.current_password = currentPassword }
    try {
      await apiJson('PATCH', '/admin/profile.php', payload)
      setMsg('Profile updated. (Name/email refresh on next sign-in.)')
      setCurrent(''); setNew('')
    } catch (e) {
      const ae = e as ApiError
      setError(ae.message); if (ae.fields) setFieldErrors(ae.fields)
    } finally { setBusy(false) }
  }

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>My profile</h1>
          <p className={s.pageSub}>Update your name, email, and password.</p>
        </div>
      </div>

      {msg && <div className={`${s.notice} ${s.noticeInfo}`}>{msg}</div>}
      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}

      <form onSubmit={save} className={s.card} style={{ maxWidth: 520 }}>
        <div className={s.form} style={{ maxWidth: '100%' }}>
          <div className={s.field}>
            <label className={s.label}>Name</label>
            <input className={`${s.input} ${fieldErrors.name ? s.inputError : ''}`} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Email</label>
            <input type="email" className={`${s.input} ${fieldErrors.email ? s.inputError : ''}`} value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ borderTop: '1px solid var(--a-border)', paddingTop: 16, marginTop: 4 }}>
            <div className={s.label} style={{ marginBottom: 12 }}>Change password</div>
            <div className={s.field} style={{ marginBottom: 12 }}>
              <label className={s.label} style={{ fontWeight: 500 }}>Current password</label>
              <input type="password" className={`${s.input} ${fieldErrors.current_password ? s.inputError : ''}`} value={currentPassword} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" />
            </div>
            <div className={s.field}>
              <label className={s.label} style={{ fontWeight: 500 }}>New password</label>
              <input type="password" className={`${s.input} ${fieldErrors.new_password ? s.inputError : ''}`} value={newPassword} onChange={e => setNew(e.target.value)} placeholder="Leave blank to keep current" autoComplete="new-password" />
            </div>
          </div>

          <div className={s.formActions}>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={busy}>{busy ? 'Saving…' : 'Save changes'}</button>
          </div>
        </div>
      </form>
    </>
  )
}
