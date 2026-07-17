import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiJson, apiPostJson, type ApiError } from '@/lib/api'
import { EMPLOYMENT_TYPES, type AdminJob } from './types'
import s from './admin.module.css'

const EMPTY = {
  title: '', department: '', location: '', employment_type: 'full_time',
  status: 'draft', summary: '', description: '', requirements: '',
  salary_range: '', closes_at: '',
}

export function JobEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({ ...EMPTY })
  const [loading, setLoading] = useState(isEdit)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!isEdit) return
    apiGet<{ job: AdminJob }>(`/admin/jobs.php?id=${id}`)
      .then(d => {
        const j = d.job
        setForm({
          title: j.title ?? '', department: j.department ?? '', location: j.location ?? '',
          employment_type: j.employment_type ?? 'full_time', status: j.status ?? 'draft',
          summary: j.summary ?? '', description: j.description ?? '', requirements: j.requirements ?? '',
          salary_range: j.salary_range ?? '', closes_at: j.closes_at ?? '',
        })
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [id, isEdit])

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }))

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError(''); setFieldErrors({})
    try {
      if (isEdit) {
        await apiJson('PATCH', `/admin/jobs.php?id=${id}`, form)
      } else {
        await apiPostJson('/admin/jobs.php', form)
      }
      navigate('/admin/jobs')
    } catch (err) {
      const ae = err as ApiError
      setError(ae.message || 'Could not save.')
      if (ae.fields) setFieldErrors(ae.fields)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className={s.empty}>Loading…</div>

  return (
    <>
      <Link to="/admin/jobs" className={s.backLink}>← Back to jobs</Link>
      <div className={s.pageHead}>
        <h1 className={s.pageTitle}>{isEdit ? 'Edit job' : 'New job'}</h1>
      </div>

      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}

      <form className={s.form} onSubmit={save}>
        <div className={s.field}>
          <label className={s.label}>Job title *</label>
          <input className={`${s.input} ${fieldErrors.title ? s.inputError : ''}`}
            value={form.title} onChange={e => set('title', e.target.value)} placeholder="Management Consultant" />
          {fieldErrors.title && <span className={s.errText}>{fieldErrors.title}</span>}
        </div>

        <div className={s.formRow}>
          <div className={s.field}>
            <label className={s.label}>Department</label>
            <input className={s.input} value={form.department} onChange={e => set('department', e.target.value)} placeholder="Consultancy" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Location</label>
            <input className={s.input} value={form.location} onChange={e => set('location', e.target.value)} placeholder="Addis Ababa, Ethiopia" />
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.field}>
            <label className={s.label}>Employment type</label>
            <select className={s.select} value={form.employment_type} onChange={e => set('employment_type', e.target.value)}>
              {EMPLOYMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div className={s.field}>
            <label className={s.label}>Status</label>
            <select className={s.select} value={form.status} onChange={e => set('status', e.target.value)}>
              <option value="draft">Draft (hidden)</option>
              <option value="open">Open (visible on site)</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <div className={s.formRow}>
          <div className={s.field}>
            <label className={s.label}>Salary range</label>
            <input className={s.input} value={form.salary_range} onChange={e => set('salary_range', e.target.value)} placeholder="Optional" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Applications close</label>
            <input type="date" className={s.input} value={form.closes_at} onChange={e => set('closes_at', e.target.value)} />
          </div>
        </div>

        <div className={s.field}>
          <label className={s.label}>Summary <span className={s.muted}>(short teaser on the listing card)</span></label>
          <textarea className={s.textarea} style={{ minHeight: 70 }} value={form.summary} onChange={e => set('summary', e.target.value)} />
        </div>

        <div className={s.field}>
          <label className={s.label}>About the role</label>
          <textarea className={s.textarea} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>

        <div className={s.field}>
          <label className={s.label}>What we’re looking for</label>
          <textarea className={s.textarea} value={form.requirements} onChange={e => set('requirements', e.target.value)} />
        </div>

        <div className={s.formActions}>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={busy}>
            {busy ? 'Saving…' : isEdit ? 'Save changes' : 'Create job'}
          </button>
          <Link to="/admin/jobs" className={`${s.btn} ${s.btnGhost}`}>Cancel</Link>
        </div>
      </form>
    </>
  )
}
