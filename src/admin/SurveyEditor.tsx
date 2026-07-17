import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { apiGet, apiJson, apiPostJson, type ApiError } from '@/lib/api'
import {
  QUESTION_TYPES, CHOICE_TYPES, defaultConfig, DEFAULT_SETTINGS,
  type SurveyQuestion, type SurveySettings, type SurveyFull, type QuestionType,
} from './surveyTypes'
import s from './admin.module.css'

export function SurveyEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'draft' | 'published' | 'closed'>('draft')
  const [settings, setSettings] = useState<SurveySettings>({ ...DEFAULT_SETTINGS })
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [locked, setLocked] = useState(false)   // true once responses exist
  const [loading, setLoading] = useState(isEdit)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    Promise.all([
      apiGet<{ survey: SurveyFull; questions: SurveyQuestion[] }>(`/admin/surveys.php?id=${id}`),
    ]).then(([d]) => {
      setTitle(d.survey.title)
      setDescription(d.survey.description ?? '')
      setStatus(d.survey.status)
      setSettings({ ...DEFAULT_SETTINGS, ...(d.survey.settings || {}) })
      setQuestions(d.questions.map(q => ({ ...q, config: q.config || {} })))
      setLocked((d.survey.response_count ?? 0) > 0)
    }).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [id, isEdit])

  const setS = (k: keyof SurveySettings, v: any) => setSettings(prev => ({ ...prev, [k]: v }))

  // ── question ops ──
  const addQuestion = () => setQuestions(prev => [
    ...prev,
    { type: 'short_text', title: '', help_text: '', is_required: false, config: {} },
  ])
  const updateQ = (i: number, patch: Partial<SurveyQuestion>) =>
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, ...patch } : q))
  const changeType = (i: number, type: QuestionType) =>
    updateQ(i, { type, config: defaultConfig(type) })
  const removeQ = (i: number) => setQuestions(prev => prev.filter((_, idx) => idx !== i))
  const moveQ = (i: number, dir: -1 | 1) => setQuestions(prev => {
    const next = [...prev]
    const j = i + dir
    if (j < 0 || j >= next.length) return prev
    ;[next[i], next[j]] = [next[j], next[i]]
    return next
  })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true); setError('')
    const payload: any = { title, description, status, settings }
    if (!locked) payload.questions = questions
    try {
      if (isEdit) await apiJson('PATCH', `/admin/surveys.php?id=${id}`, payload)
      else await apiPostJson('/admin/surveys.php', payload)
      navigate('/admin/surveys')
    } catch (err) {
      setError((err as ApiError).message || 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className={s.empty}>Loading…</div>

  return (
    <>
      <Link to="/admin/surveys" className={s.backLink}>← Back to surveys</Link>
      <div className={s.pageHead}>
        <h1 className={s.pageTitle}>{isEdit ? 'Edit survey' : 'New survey'}</h1>
      </div>

      {error && <div className={`${s.notice} ${s.noticeError}`}>{error}</div>}
      {locked && <div className={`${s.notice} ${s.noticeInfo}`}>This survey has responses, so its questions are locked. You can still edit the title, description, settings and status.</div>}

      <form onSubmit={save} style={{ maxWidth: 760 }}>
        {/* Meta */}
        <div className={s.card} style={{ marginBottom: 20 }}>
          <div className={s.field} style={{ marginBottom: 14 }}>
            <label className={s.label}>Survey title</label>
            <input className={s.input} value={title} onChange={e => setTitle(e.target.value)} placeholder="Employee Experience Survey" />
          </div>
          <div className={s.field}>
            <label className={s.label}>Description <span className={s.muted}>(shown at the top)</span></label>
            <textarea className={s.textarea} style={{ minHeight: 70 }} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
        </div>

        {/* Settings */}
        <div className={s.card} style={{ marginBottom: 20 }}>
          <div className={s.label} style={{ marginBottom: 14, fontSize: 14 }}>Settings</div>
          <div className={s.formRow}>
            <div className={s.field}>
              <label className={s.label}>Status</label>
              <select className={s.select} value={status} onChange={e => setStatus(e.target.value as any)}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (live on site)</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className={s.field}>
              <label className={s.label}>Response limit <span className={s.muted}>(0 = unlimited)</span></label>
              <input type="number" min={0} className={s.input} value={settings.response_limit ?? 0}
                onChange={e => setS('response_limit', Number(e.target.value) || null)} />
            </div>
          </div>
          <div className={s.field} style={{ marginTop: 12 }}>
            <label className={s.label}>Confirmation message <span className={s.muted}>(shown after submitting)</span></label>
            <input className={s.input} value={settings.confirmation_message} onChange={e => setS('confirmation_message', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.collect_email} onChange={e => setS('collect_email', e.target.checked)} />
              Collect respondent email
            </label>
            <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, cursor: 'pointer' }}>
              <input type="checkbox" checked={settings.show_progress} onChange={e => setS('show_progress', e.target.checked)} />
              Show progress bar
            </label>
          </div>
        </div>

        {/* Questions */}
        <div className={s.label} style={{ marginBottom: 10, fontSize: 14 }}>Questions ({questions.length})</div>
        {questions.map((q, i) => (
          <QuestionCard
            key={i} q={q} index={i} total={questions.length} disabled={locked}
            onChange={patch => updateQ(i, patch)} onType={t => changeType(i, t)}
            onRemove={() => removeQ(i)} onMove={dir => moveQ(i, dir)}
          />
        ))}

        {!locked && (
          <button type="button" className={`${s.btn} ${s.btnGhost}`} onClick={addQuestion} style={{ marginBottom: 24 }}>
            + Add question
          </button>
        )}

        <div className={s.formActions}>
          <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={busy}>
            {busy ? 'Saving…' : isEdit ? 'Save survey' : 'Create survey'}
          </button>
          <Link to="/admin/surveys" className={`${s.btn} ${s.btnGhost}`}>Cancel</Link>
        </div>
      </form>
    </>
  )
}

function QuestionCard({ q, index, total, disabled, onChange, onType, onRemove, onMove }: {
  q: SurveyQuestion; index: number; total: number; disabled: boolean
  onChange: (p: Partial<SurveyQuestion>) => void
  onType: (t: QuestionType) => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
}) {
  const isChoice = CHOICE_TYPES.includes(q.type)

  const setOpt = (oi: number, val: string) => {
    const options = [...(q.config.options ?? [])]
    options[oi] = val
    onChange({ config: { ...q.config, options } })
  }
  const addOpt = () => onChange({ config: { ...q.config, options: [...(q.config.options ?? []), `Option ${(q.config.options?.length ?? 0) + 1}`] } })
  const removeOpt = (oi: number) => onChange({ config: { ...q.config, options: (q.config.options ?? []).filter((_, x) => x !== oi) } })

  return (
    <div className={s.card} style={{ marginBottom: 14, opacity: disabled ? 0.85 : 1 }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, flexWrap: 'wrap' }}>
        <span className={s.muted} style={{ fontWeight: 700 }}>Q{index + 1}</span>
        <select className={s.select} style={{ width: 'auto', flex: 1, minWidth: 180 }} value={q.type}
          disabled={disabled} onChange={e => onType(e.target.value as QuestionType)}>
          {QUESTION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        {!disabled && (
          <span style={{ display: 'flex', gap: 4 }}>
            <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => onMove(-1)} disabled={index === 0}>↑</button>
            <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => onMove(1)} disabled={index === total - 1}>↓</button>
            <button type="button" className={`${s.btn} ${s.btnDanger} ${s.btnSm}`} onClick={onRemove}>✕</button>
          </span>
        )}
      </div>

      <div className={s.field} style={{ marginBottom: 10 }}>
        <input className={s.input} value={q.title} disabled={disabled}
          onChange={e => onChange({ title: e.target.value })} placeholder="Question text" />
      </div>
      <div className={s.field} style={{ marginBottom: 10 }}>
        <input className={s.input} value={q.help_text ?? ''} disabled={disabled}
          onChange={e => onChange({ help_text: e.target.value })} placeholder="Help text (optional)" style={{ fontSize: 13 }} />
      </div>

      {/* Choice options */}
      {isChoice && (
        <div style={{ marginBottom: 10 }}>
          {(q.config.options ?? []).map((opt, oi) => (
            <div key={oi} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <input className={s.input} value={opt} disabled={disabled} onChange={e => setOpt(oi, e.target.value)} />
              {!disabled && <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={() => removeOpt(oi)}>✕</button>}
            </div>
          ))}
          {!disabled && <button type="button" className={`${s.btn} ${s.btnGhost} ${s.btnSm}`} onClick={addOpt}>+ Add option</button>}
        </div>
      )}

      {/* Linear scale */}
      {q.type === 'linear_scale' && (
        <div className={s.formRow} style={{ marginBottom: 10 }}>
          <div className={s.field}>
            <label className={s.label} style={{ fontWeight: 500 }}>Scale</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="number" className={s.input} style={{ width: 70 }} value={q.config.min ?? 1} disabled={disabled}
                onChange={e => onChange({ config: { ...q.config, min: Number(e.target.value) } })} />
              <span className={s.muted}>to</span>
              <input type="number" className={s.input} style={{ width: 70 }} value={q.config.max ?? 5} disabled={disabled}
                onChange={e => onChange({ config: { ...q.config, max: Number(e.target.value) } })} />
            </div>
          </div>
          <div className={s.field}>
            <label className={s.label} style={{ fontWeight: 500 }}>Labels (low / high)</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className={s.input} value={q.config.minLabel ?? ''} disabled={disabled}
                onChange={e => onChange({ config: { ...q.config, minLabel: e.target.value } })} placeholder="Low" />
              <input className={s.input} value={q.config.maxLabel ?? ''} disabled={disabled}
                onChange={e => onChange({ config: { ...q.config, maxLabel: e.target.value } })} placeholder="High" />
            </div>
          </div>
        </div>
      )}

      {/* Rating */}
      {q.type === 'rating' && (
        <div className={s.field} style={{ marginBottom: 10, maxWidth: 160 }}>
          <label className={s.label} style={{ fontWeight: 500 }}>Number of stars</label>
          <input type="number" min={3} max={10} className={s.input} value={q.config.max ?? 5} disabled={disabled}
            onChange={e => onChange({ config: { ...q.config, max: Number(e.target.value) } })} />
        </div>
      )}

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13, cursor: disabled ? 'default' : 'pointer' }}>
        <input type="checkbox" checked={q.is_required} disabled={disabled} onChange={e => onChange({ is_required: e.target.checked })} />
        Required
      </label>
    </div>
  )
}
