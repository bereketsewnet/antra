import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiJson, apiPostJson, type ApiError } from '@/lib/api'
import { useAuth } from './AuthContext'
import type { StaffUser } from './types'
import s from './admin.module.css'

export function UsersManager() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<StaffUser[] | null>(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState<StaffUser | 'new' | null>(null)

  const load = useCallback(() => {
    apiGet<{ users: StaffUser[] }>('/admin/users.php').then(d => setUsers(d.users)).catch(e => setError(e.message))
  }, [])
  useEffect(() => { load() }, [load])

  const toggleActive = async (u: StaffUser) => {
    try { await apiJson('PATCH', `/admin/users.php?id=${u.id}`, { is_active: !Number(u.is_active) }); load() }
    catch (e) { alert((e as ApiError).message) }
  }
  const remove = async (u: StaffUser) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return
    try { await apiJson('DELETE', `/admin/users.php?id=${u.id}`); load() }
    catch (e) { alert((e as ApiError).message) }
  }

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Staff</h1>
          <p className={s.pageSub}>Manage admin and HR accounts, roles, and passwords.</p>
        </div>
        <button className={`${s.btn} ${s.btnPrimary}`} onClick={() => setEditing('new')}>+ Add staff</button>
      </div>

      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}
      {users === null && !error && <div className={s.empty}>Loading…</div>}

      {users && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Last login</th><th></th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}{me?.id === u.id && <span className={s.muted}> (you)</span>}</td>
                  <td className={s.muted}>{u.email}</td>
                  <td><span className={`${s.badge} ${u.role === 'admin' ? s.badgeShortlisted : u.role === 'survey' ? s.badgeDraft : s.badgeReviewing}`}>{u.role}</span></td>
                  <td><span className={`${s.badge} ${Number(u.is_active) ? s.badgeOpen : s.badgeClosed}`}>{Number(u.is_active) ? 'active' : 'inactive'}</span></td>
                  <td className={s.muted}>{u.last_login_at ? u.last_login_at.slice(0, 10) : '—'}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setEditing(u)}>Edit</button>{' '}
                    {me?.id !== u.id && (
                      <>
                        <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => toggleActive(u)}>{Number(u.is_active) ? 'Deactivate' : 'Activate'}</button>{' '}
                        <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => remove(u)}>Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <StaffEditor user={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load() }} />
      )}
    </>
  )
}

function StaffEditor({ user, onClose, onSaved }: { user: StaffUser | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !user
  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [role, setRole] = useState<'admin' | 'hr' | 'survey'>(user?.role ?? 'hr')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const save = async () => {
    setBusy(true); setError(''); setFieldErrors({})
    try {
      if (isNew) {
        await apiPostJson('/admin/users.php', { name, email, role, password })
      } else {
        const patch: any = { name, email, role }
        if (password) patch.password = password
        await apiJson('PATCH', `/admin/users.php?id=${user!.id}`, patch)
      }
      onSaved()
    } catch (e) {
      const ae = e as ApiError
      setError(ae.message); if (ae.fields) setFieldErrors(ae.fields)
    } finally { setBusy(false) }
  }

  return (
    <div className={s.centered} style={{ position: 'fixed', inset: 0, background: 'rgba(11,33,53,0.55)', zIndex: 100, padding: 20 }} onClick={onClose}>
      <div className={s.card} style={{ maxWidth: 460, width: '100%' }} onClick={e => e.stopPropagation()}>
        <div className={s.pageHead}>
          <h2 className={s.pageTitle} style={{ fontSize: 20 }}>{isNew ? 'Add staff' : 'Edit staff'}</h2>
          <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={onClose}>✕</button>
        </div>
        {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}
        <div className={s.form} style={{ maxWidth: '100%' }}>
          <div className={s.field}>
            <label className={s.label}>Name</label>
            <input className={`${s.input} ${fieldErrors.name ? s.inputError : ''}`} value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Email</label>
            <input type="email" className={`${s.input} ${fieldErrors.email ? s.inputError : ''}`} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className={s.field}>
            <label className={s.label}>Role</label>
            <select className={s.select} value={role} onChange={e => setRole(e.target.value as any)}>
              <option value="hr">HR (jobs + applications)</option>
              <option value="survey">Survey (surveys only)</option>
              <option value="admin">Admin (full access)</option>
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>{isNew ? 'Password' : 'Reset password (leave blank to keep)'}</label>
            <input type="text" className={`${s.input} ${fieldErrors.password ? s.inputError : ''}`} value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" autoComplete="new-password" />
          </div>
          <div className={s.formActions}>
            <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save'}</button>
            <button className={`${s.btn} ${s.btnGhost}`} onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  )
}
