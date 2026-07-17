import { useEffect, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { apiGet, apiPostJson, type ApiError } from '@/lib/api'
import styles from './Survey.module.css'

interface PublicQuestion {
  id: number
  type: string
  title: string
  help_text: string | null
  is_required: boolean
  config: { options?: string[]; min?: number; max?: number; minLabel?: string; maxLabel?: string }
}
interface PublicSurvey {
  id: number
  slug: string
  title: string
  description: string | null
  settings: { collect_email: boolean; show_progress: boolean; confirmation_message: string }
}

type AnswerValue = string | string[]

export function SurveyPage() {
  const { slug } = useParams()
  const [survey, setSurvey] = useState<PublicSurvey | null>(null)
  const [questions, setQuestions] = useState<PublicQuestion[]>([])
  const [closedMsg, setClosedMsg] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({})
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [doneMsg, setDoneMsg] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    apiGet<any>(`/survey.php?slug=${encodeURIComponent(slug ?? '')}`)
      .then(d => {
        if (!alive) return
        if (d.closed) { setClosedMsg(d.message || 'This survey is closed.'); return }
        setSurvey(d.survey); setQuestions(d.questions)
      })
      .catch((e: ApiError) => { if (alive) setLoadError(e.message || 'Survey not found.') })
    return () => { alive = false }
  }, [slug])

  const answered = useMemo(() => {
    return questions.filter(q => {
      const v = answers[q.id]
      return Array.isArray(v) ? v.length > 0 : (v ?? '') !== ''
    }).length
  }, [answers, questions])

  const setAnswer = (qid: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [qid]: value }))
    setFieldErrors(prev => { if (!prev[qid]) return prev; const n = { ...prev }; delete n[String(qid)]; return n })
  }

  const toggleCheckbox = (qid: number, opt: string) => {
    const cur = (answers[qid] as string[]) ?? []
    setAnswer(qid, cur.includes(opt) ? cur.filter(o => o !== opt) : [...cur, opt])
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!survey) return

    const errs: Record<string, string> = {}
    if (survey.settings.collect_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email.'
    }
    questions.forEach(q => {
      if (!q.is_required) return
      const v = answers[q.id]
      const empty = Array.isArray(v) ? v.length === 0 : (v ?? '') === ''
      if (empty) errs[q.id] = 'This question is required.'
    })
    if (Object.keys(errs).length) { setFieldErrors(errs); setError('Please answer the required questions.'); return }

    setStatus('sending'); setError('')
    try {
      const r = await apiPostJson<{ message: string }>('/survey-submit.php', {
        survey_id: survey.id, email, answers,
      })
      setDoneMsg(r.message); setStatus('done')
    } catch (err) {
      const ae = err as ApiError
      setError(ae.message || 'Could not submit.')
      if (ae.fields) setFieldErrors(ae.fields)
      setStatus('idle')
    }
  }

  // ── states ──
  if (loadError) {
    return <ClosedShell title="Survey unavailable" text={loadError} />
  }
  if (closedMsg) {
    return <ClosedShell title="Survey closed" text={closedMsg} />
  }
  if (!survey) {
    return <main className={styles.loading}>Loading…</main>
  }
  if (status === 'done') {
    return (
      <main className={styles.wrap}>
        <SEO title={`${survey.title} — Antra Business Group`} description="Survey" path={`/survey/${survey.slug}`} />
        <div className={styles.container}>
          <div className={styles.doneCard}>
            <span className={styles.doneIcon}>✓</span>
            <h1 className={styles.doneTitle}>{doneMsg}</h1>
            <Link to="/" className={styles.homeLink}>← Back to antragroup.et</Link>
          </div>
        </div>
      </main>
    )
  }

  const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0

  return (
    <main className={styles.wrap}>
      <SEO title={`${survey.title} — Antra Business Group`} description={survey.description || 'Survey'} path={`/survey/${survey.slug}`} />
      <div className={styles.container}>
        <motion.div className={styles.header} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className={styles.brandBar} />
          <h1 className={styles.title}>{survey.title}</h1>
          {survey.description && <p className={styles.description}>{survey.description}</p>}
        </motion.div>

        {survey.settings.show_progress && (
          <div className={styles.progressWrap}>
            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${pct}%` }} /></div>
            <span className={styles.progressText}>{answered} / {questions.length}</span>
          </div>
        )}

        <form onSubmit={submit} className={styles.form}>
          {survey.settings.collect_email && (
            <div className={styles.qCard}>
              <label className={styles.qTitle}>Your email <span className={styles.req}>*</span></label>
              <input type="email" className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`}
                value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" />
              {fieldErrors.email && <span className={styles.errText}>{fieldErrors.email}</span>}
            </div>
          )}

          {questions.map((q, i) => (
            <div key={q.id} className={styles.qCard}>
              <label className={styles.qTitle}>
                <span className={styles.qNum}>{i + 1}.</span> {q.title}
                {q.is_required && <span className={styles.req}> *</span>}
              </label>
              {q.help_text && <p className={styles.qHelp}>{q.help_text}</p>}
              <QuestionInput q={q} value={answers[q.id]} onChange={v => setAnswer(q.id, v)} onToggle={opt => toggleCheckbox(q.id, opt)} />
              {fieldErrors[q.id] && <span className={styles.errText}>{fieldErrors[q.id]}</span>}
            </div>
          ))}

          {error && <div className={styles.formError}>{error}</div>}

          <button type="submit" className={styles.submit} disabled={status === 'sending'}>
            {status === 'sending' ? 'Submitting…' : 'Submit'}
          </button>
          <p className={styles.privacy}>Powered by Antra Business Group</p>
        </form>
      </div>
    </main>
  )
}

function QuestionInput({ q, value, onChange, onToggle }: {
  q: PublicQuestion
  value: AnswerValue | undefined
  onChange: (v: AnswerValue) => void
  onToggle: (opt: string) => void
}) {
  const s = styles
  const opts = q.config.options ?? []

  switch (q.type) {
    case 'paragraph':
      return <textarea className={`${s.input} ${s.textarea}`} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)} />
    case 'multiple_choice':
      return (
        <div className={s.options}>
          {opts.map(o => (
            <label key={o} className={s.optionRow}>
              <input type="radio" name={`q${q.id}`} checked={value === o} onChange={() => onChange(o)} />{o}
            </label>
          ))}
        </div>
      )
    case 'checkboxes':
      return (
        <div className={s.options}>
          {opts.map(o => (
            <label key={o} className={s.optionRow}>
              <input type="checkbox" checked={((value as string[]) ?? []).includes(o)} onChange={() => onToggle(o)} />{o}
            </label>
          ))}
        </div>
      )
    case 'dropdown':
      return (
        <select className={s.input} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)}>
          <option value="">Select…</option>
          {opts.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      )
    case 'linear_scale': {
      const min = q.config.min ?? 1, max = q.config.max ?? 5
      const nums = Array.from({ length: max - min + 1 }, (_, i) => min + i)
      return (
        <div className={s.scaleRow}>
          {q.config.minLabel && <span className={s.scaleLabel}>{q.config.minLabel}</span>}
          {nums.map(n => (
            <label key={n} className={s.scaleItem}>
              <input type="radio" name={`q${q.id}`} checked={value === String(n)} onChange={() => onChange(String(n))} />
              <span>{n}</span>
            </label>
          ))}
          {q.config.maxLabel && <span className={s.scaleLabel}>{q.config.maxLabel}</span>}
        </div>
      )
    }
    case 'rating': {
      const max = q.config.max ?? 5
      const cur = Number(value ?? 0)
      return (
        <div className={s.stars}>
          {Array.from({ length: max }, (_, i) => i + 1).map(n => (
            <button type="button" key={n} className={`${s.star} ${n <= cur ? s.starOn : ''}`} onClick={() => onChange(String(n))}>★</button>
          ))}
        </div>
      )
    }
    case 'date':
      return <input type="date" className={s.input} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)} />
    case 'email':
      return <input type="email" className={s.input} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)} />
    case 'number':
      return <input type="number" className={s.input} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)} />
    default:
      return <input type="text" className={s.input} value={(value as string) ?? ''} onChange={e => onChange(e.target.value)} />
  }
}

function ClosedShell({ title, text }: { title: string; text: string }) {
  return (
    <main className={styles.wrap}>
      <div className={styles.container}>
        <div className={styles.doneCard}>
          <h1 className={styles.doneTitle}>{title}</h1>
          <p className={styles.description} style={{ textAlign: 'center' }}>{text}</p>
          <Link to="/" className={styles.homeLink}>← Back to antragroup.et</Link>
        </div>
      </div>
    </main>
  )
}
