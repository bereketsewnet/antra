import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiJson } from '@/lib/api'
import { jobTimeLeft } from '@/lib/jobTime'
import type { AdminJob } from './types'
import s from './admin.module.css'

const statusBadge: Record<string, string> = {
  open: s.badgeOpen, draft: s.badgeDraft, closed: s.badgeClosed,
}

export function JobsManager() {
  const [jobs, setJobs] = useState<AdminJob[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    apiGet<{ jobs: AdminJob[] }>('/admin/jobs.php')
      .then(d => setJobs(d.jobs))
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => { load() }, [load])

  const remove = async (job: AdminJob) => {
    if (!confirm(`Delete "${job.title}"? This also removes its applications.`)) return
    await apiJson('DELETE', `/admin/jobs.php?id=${job.id}`)
    load()
  }

  const setStatus = async (job: AdminJob, status: string) => {
    await apiJson('PATCH', `/admin/jobs.php?id=${job.id}`, { status })
    load()
  }

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Jobs</h1>
          <p className={s.pageSub}>Create, publish, and close job postings.</p>
        </div>
        <Link to="/admin/jobs/new" className={`${s.btn} ${s.btnPrimary}`}>+ New job</Link>
      </div>

      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}

      {jobs === null && !error && <div className={s.empty}>Loading…</div>}
      {jobs && jobs.length === 0 && (
        <div className={s.empty}>No jobs yet. Create your first posting.</div>
      )}

      {jobs && jobs.length > 0 && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>Title</th><th>Status</th><th>Type</th><th>Applications</th><th></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>
                    <Link to={`/admin/jobs/${job.id}/edit`} className={s.rowLink}>{job.title}</Link>
                    <div className={s.muted}>{job.department || '—'}</div>
                  </td>
                  <td>
                    <span className={`${s.badge} ${statusBadge[job.status] ?? ''}`}>{job.status}</span>
                    {job.status === 'open' && (() => {
                      const tl = jobTimeLeft(job.closes_at)
                      return tl && tl.urgent && !tl.closed
                        ? <div className={s.muted} style={{ color: '#b5640c', marginTop: 4 }}>⏳ {tl.label}</div>
                        : null
                    })()}
                  </td>
                  <td>{job.employment_type.replace('_', '-')}</td>
                  <td>{job.application_count ?? 0}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {job.status !== 'open' && (
                      <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setStatus(job, 'open')}>Publish</button>
                    )}
                    {job.status === 'open' && (
                      <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setStatus(job, 'closed')}>Close</button>
                    )}
                    {' '}
                    <Link to={`/admin/jobs/${job.id}/edit`} className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}>Edit</Link>
                    {' '}
                    <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => remove(job)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
