import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { apiGet, apiJson } from '@/lib/api'
import type { SurveyListItem } from './surveyTypes'
import s from './admin.module.css'

const statusBadge: Record<string, string> = {
  published: s.badgeOpen, draft: s.badgeDraft, closed: s.badgeClosed,
}

export function SurveysManager() {
  const [surveys, setSurveys] = useState<SurveyListItem[] | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    apiGet<{ surveys: SurveyListItem[] }>('/admin/surveys.php')
      .then(d => setSurveys(d.surveys))
      .catch(e => setError(e.message))
  }, [])

  useEffect(() => { load() }, [load])

  const setStatus = async (sv: SurveyListItem, status: string) => {
    await apiJson('PATCH', `/admin/surveys.php?id=${sv.id}`, { status })
    load()
  }
  const remove = async (sv: SurveyListItem) => {
    if (!confirm(`Delete "${sv.title}"? All its responses will be removed too.`)) return
    await apiJson('DELETE', `/admin/surveys.php?id=${sv.id}`)
    load()
  }

  return (
    <>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>Surveys</h1>
          <p className={s.pageSub}>Build surveys, publish them to the site, and review responses.</p>
        </div>
        <Link to="/admin/surveys/new" className={`${s.btn} ${s.btnPrimary}`}>+ New survey</Link>
      </div>

      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}
      {surveys === null && !error && <div className={s.empty}>Loading…</div>}
      {surveys && surveys.length === 0 && <div className={s.empty}>No surveys yet. Create your first one.</div>}

      {surveys && surveys.length > 0 && (
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr><th>Title</th><th>Status</th><th>Questions</th><th>Responses</th><th></th></tr>
            </thead>
            <tbody>
              {surveys.map(sv => (
                <tr key={sv.id}>
                  <td><Link to={`/admin/surveys/${sv.id}/edit`} className={s.rowLink}>{sv.title}</Link></td>
                  <td><span className={`${s.badge} ${statusBadge[sv.status] ?? ''}`}>{sv.status}</span></td>
                  <td>{sv.question_count}</td>
                  <td>{sv.response_count}</td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    {sv.status !== 'published'
                      ? <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setStatus(sv, 'published')}>Publish</button>
                      : <button className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => setStatus(sv, 'closed')}>Close</button>}
                    {' '}
                    <Link to={`/admin/surveys/${sv.id}/results`} className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}>Results</Link>
                    {' '}
                    <Link to={`/admin/surveys/${sv.id}/edit`} className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}>Edit</Link>
                    {' '}
                    <button className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={() => remove(sv)}>Delete</button>
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
