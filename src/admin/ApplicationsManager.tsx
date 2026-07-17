import { useEffect, useState, useCallback } from 'react'
import { apiGet, apiJson } from '@/lib/api'
import { APPLICATION_STATUSES, type Application, type ApplicationStatus } from './types'
import s from './admin.module.css'

const statusBadge: Record<string, string> = {
  new: s.badgeNew, reviewing: s.badgeReviewing, shortlisted: s.badgeShortlisted,
  rejected: s.badgeRejected, hired: s.badgeHired,
}

export function ApplicationsManager() {
  const [apps, setApps] = useState<Application[] | null>(null)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Application | null>(null)

  const load = useCallback(() => {
    apiGet<{ applications: Application[] }>('/admin/applications.php')
      .then(d => setApps(d.applications))
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => { load() }, [load])

  const openDetail = async (id: number) => {
    const d = await apiGet<{ application: Application }>(`/admin/applications.php?id=${id}`)
    setSelected(d.application)
  }

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Applications</h1>
          <p className={s.pageSub}>Review candidates, preview CVs, and update status.</p>
        </div>
      </div>

      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}

      {apps === null && !error && <div className={s.empty}>Loading…</div>}
      {apps && apps.length === 0 && <div className={s.empty}>No applications yet.</div>}

      {apps && apps.length > 0 && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Applicant</th><th>Role</th><th>Applied</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id}>
                  <td>
                    <button className={s.rowLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onClick={() => openDetail(a.id)}>
                      {a.applicant_name}
                    </button>
                    <div className={s.muted}>{a.email}</div>
                  </td>
                  <td>{a.job_title}</td>
                  <td className={s.muted}>{a.created_at?.slice(0, 10)}</td>
                  <td><span className={`${s.badge} ${statusBadge[a.status] ?? ''}`}>{a.status}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => openDetail(a.id)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <ApplicationDetail
          app={selected}
          onClose={() => setSelected(null)}
          onUpdated={(status) => {
            setApps(prev => prev?.map(a => a.id === selected.id ? { ...a, status } : a) ?? null)
            setSelected(prev => prev ? { ...prev, status } : prev)
          }}
        />
      )}
    </>
  )
}

function ApplicationDetail({ app, onClose, onUpdated }: {
  app: Application
  onClose: () => void
  onUpdated: (status: ApplicationStatus) => void
}) {
  const [status, setStatus] = useState<ApplicationStatus>(app.status)
  const [note, setNote] = useState('')
  const [notify, setNotify] = useState(true)
  const [busy, setBusy] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const isPdf = (app.cv_filename ?? '').toLowerCase().endsWith('.pdf')
  const inlineUrl = `/api/admin/download-cv.php?id=${app.id}&inline=1`
  const downloadUrl = `/api/admin/download-cv.php?id=${app.id}`

  const save = async () => {
    setBusy(true); setFeedback('')
    try {
      const r = await apiJson<{ emailed: boolean; email_error: string | null }>(
        'PATCH', `/admin/applications.php?id=${app.id}`, { status, note, notify }
      )
      onUpdated(status)
      setFeedback(
        notify
          ? (r.emailed ? 'Status updated and the applicant was emailed.' : (r.email_error || 'Status updated, but the email failed.'))
          : 'Status updated.'
      )
      setNote('')
    } catch (e: any) {
      setFeedback(e.message || 'Could not update.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={s.centered} style={{ position: 'fixed', inset: 0, background: 'rgba(11,33,53,0.55)', zIndex: 100, padding: 20, alignItems: 'flex-start', overflowY: 'auto' }}
      onClick={onClose}>
      <div className={s.card} style={{ maxWidth: 640, width: '100%', margin: '40px auto' }} onClick={e => e.stopPropagation()}>
        <div className={s.pageHead} style={{ marginBottom: 18 }}>
          <h2 className={s.pageTitle} style={{ fontSize: 20 }}>{app.applicant_name}</h2>
          <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={onClose}>✕</button>
        </div>

        <dl className={s.detailGrid}>
          <dt>Role</dt><dd>{app.job_title}</dd>
          <dt>Email</dt><dd><a href={`mailto:${app.email}`} className={s.rowLink}>{app.email}</a></dd>
          <dt>Phone</dt><dd>{app.phone || '—'}</dd>
          <dt>Applied</dt><dd>{app.created_at?.slice(0, 16).replace('T', ' ')}</dd>
          <dt>Status</dt><dd><span className={`${s.badge} ${statusBadge[app.status] ?? ''}`}>{app.status}</span></dd>
        </dl>

        {app.cover_letter && (
          <div style={{ marginTop: 18 }}>
            <div className={s.label} style={{ marginBottom: 6 }}>Cover note</div>
            <p style={{ fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>{app.cover_letter}</p>
          </div>
        )}

        {/* CV */}
        <div style={{ marginTop: 20 }}>
          <div className={s.label} style={{ marginBottom: 8 }}>CV / Résumé</div>
          {app.has_cv ? (
            <>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {isPdf && (
                  <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setShowPreview(v => !v)}>
                    {showPreview ? 'Hide preview' : 'View in browser'}
                  </button>
                )}
                <a className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} href={inlineUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>
                <a className={`${s.btn} ${s.btnPrimary} ${s.btnSm}`} href={downloadUrl}>Download</a>
              </div>
              {showPreview && isPdf && (
                <iframe title="CV preview" src={inlineUrl}
                  style={{ width: '100%', height: 460, border: '1px solid #e3e8ef', borderRadius: 8, marginTop: 12 }} />
              )}
              {!isPdf && <p className={s.muted} style={{ marginTop: 8 }}>In-browser preview is only available for PDFs — use “Open in new tab” or “Download”.</p>}
            </>
          ) : (
            <p className={s.muted} style={{ margin: 0 }}>No CV was attached.</p>
          )}
        </div>

        {app.status_note && (
          <div style={{ marginTop: 18 }}>
            <div className={s.label} style={{ marginBottom: 6 }}>Last note sent</div>
            <p className={s.muted} style={{ margin: 0, whiteSpace: 'pre-line' }}>{app.status_note}</p>
          </div>
        )}

        {/* Status update */}
        <div className={s.card} style={{ marginTop: 22, background: '#f9fafc' }}>
          <div className={s.label} style={{ marginBottom: 12, fontSize: 14 }}>Update status</div>
          <div className={s.field} style={{ marginBottom: 12 }}>
            <select className={s.select} value={status} onChange={e => setStatus(e.target.value as ApplicationStatus)}>
              {APPLICATION_STATUSES.map(st => <option key={st} value={st}>{st}</option>)}
            </select>
          </div>
          <div className={s.field} style={{ marginBottom: 12 }}>
            <label className={s.label} style={{ fontWeight: 500 }}>Optional message to the applicant (added to the email)</label>
            <textarea className={s.textarea} style={{ minHeight: 80 }} value={note} onChange={e => setNote(e.target.value)}
              placeholder="e.g. We were impressed by your experience…" />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={notify} onChange={e => setNotify(e.target.checked)} />
            Email the applicant a professional status update
          </label>
          {feedback && <div className={`${s.notice} ${s.noticeInfo}`}>{feedback}</div>}
          <button className={`${s.btn} ${s.btnPrimary}`} onClick={save} disabled={busy}>
            {busy ? 'Saving…' : 'Update status'}
          </button>
        </div>
      </div>
    </div>
  )
}
