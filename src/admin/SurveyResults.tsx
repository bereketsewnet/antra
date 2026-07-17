import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { apiGet } from '@/lib/api'
import s from './admin.module.css'

interface Aggregate {
  question_id: number
  type: string
  title: string
  is_choice: boolean
  counts: Record<string, number>
  values: string[]
}
interface ResultsData {
  survey: { id: number; title: string; slug: string }
  questions: { id: number; title: string }[]
  total: number
  aggregates: Aggregate[]
  responses: { id: number; email: string | null; created_at: string; answers: Record<string, string> }[]
}

export function SurveyResults() {
  const { id } = useParams()
  const [data, setData] = useState<ResultsData | null>(null)
  const [error, setError] = useState('')
  const [view, setView] = useState<'summary' | 'individual'>('summary')

  useEffect(() => {
    apiGet<ResultsData>(`/admin/survey-results.php?id=${id}`)
      .then(setData).catch(e => setError(e.message))
  }, [id])

  if (error) return <div className={`${s.notice} ${s.noticeError}`}>{error}</div>
  if (!data) return <div className={s.empty}>Loading…</div>

  return (
    <>
      <Link to="/admin/surveys" className={s.backLink}>← Back to surveys</Link>
      <div className={s.pageHead}>
        <div>
          <h1 className={s.pageTitle}>{data.survey.title}</h1>
          <p className={s.pageSub}>{data.total} response{data.total === 1 ? '' : 's'}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a className={`${s.btn} ${s.btnGhost}`} href={`/api/admin/survey-results.php?id=${id}&format=csv`}>Export CSV</a>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        <button className={`${s.btn} ${view === 'summary' ? s.btnPrimary : s.btnGhost} ${s.btnSm}`} onClick={() => setView('summary')}>Summary</button>
        <button className={`${s.btn} ${view === 'individual' ? s.btnPrimary : s.btnGhost} ${s.btnSm}`} onClick={() => setView('individual')}>Individual</button>
      </div>

      {data.total === 0 && <div className={s.empty}>No responses yet.</div>}

      {data.total > 0 && view === 'summary' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {data.aggregates.map(a => (
            <div key={a.question_id} className={s.card}>
              <div className={s.label} style={{ fontSize: 15, marginBottom: 14 }}>{a.title}</div>
              {a.is_choice ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(a.counts).length === 0 && <div className={s.muted}>No answers.</div>}
                  {Object.entries(a.counts).sort((x, y) => y[1] - x[1]).map(([opt, n]) => {
                    const pct = Math.round((n / data.total) * 100)
                    return (
                      <div key={opt}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                          <span>{opt}</span><span className={s.muted}>{n} ({pct}%)</span>
                        </div>
                        <div style={{ height: 8, background: '#eef1f6', borderRadius: 100 }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: '#d97911', borderRadius: 100 }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {a.values.length === 0 && <div className={s.muted}>No answers.</div>}
                  {a.values.map((v, i) => (
                    <div key={i} style={{ fontSize: 14, padding: '8px 12px', background: '#f7f9fc', borderRadius: 6 }}>{v}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {data.total > 0 && view === 'individual' && (
        <div className={s.tableWrap} style={{ overflowX: 'auto' }}>
          <table className={s.table}>
            <thead>
              <tr>
                <th>#</th><th>Submitted</th>
                {data.questions.map(q => <th key={q.id}>{q.title}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.responses.map((r, i) => (
                <tr key={r.id}>
                  <td>{i + 1}</td>
                  <td className={s.muted}>{r.created_at?.slice(0, 16).replace('T', ' ')}</td>
                  {data.questions.map(q => <td key={q.id}>{r.answers[q.id] || <span className={s.muted}>—</span>}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
