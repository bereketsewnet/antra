import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { SEO } from '@/components/SEO'
import {
  apiGet, apiPostForm, EMPLOYMENT_TYPE_LABELS,
  type JobDetail, type ApiError,
} from '@/lib/api'
import { jobTimeLeft } from '@/lib/jobTime'
import styles from './JobDetail.module.css'

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number]

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function JobDetailPage() {
  const { slug } = useParams()

  const [job, setJob] = useState<JobDetail | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  const formRef = useRef<HTMLDivElement>(null)
  const inView = useInView(formRef, { once: true, margin: '-60px' })

  const [form, setForm] = useState({ name: '', email: '', phone: '', cover_letter: '' })
  const [cv, setCv] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [message, setMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    let alive = true
    setJob(null)
    setLoadError(null)
    apiGet<{ job: JobDetail }>(`/jobs.php?slug=${encodeURIComponent(slug ?? '')}`)
      .then(d => { if (alive) setJob(d.job) })
      .catch((e: ApiError) => { if (alive) setLoadError(e.message || 'Job not found.') })
    return () => { alive = false }
  }, [slug])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => {
      if (!prev[name]) return prev
      const next = { ...prev }; delete next[name]; return next
    })
  }, [])

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!job) return

    const errs: Record<string, string> = {}
    if (!form.name.trim()) errs.name = 'Please enter your full name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'Please enter a valid email.'
    if (Object.keys(errs).length) { setFieldErrors(errs); setStatus('error'); setMessage('Please fix the highlighted fields.'); return }

    const fd = new FormData()
    fd.append('job_id', String(job.id))
    fd.append('name', form.name)
    fd.append('email', form.email)
    fd.append('phone', form.phone)
    fd.append('cover_letter', form.cover_letter)
    if (cv) fd.append('cv', cv)

    setStatus('sending'); setMessage(''); setFieldErrors({})
    try {
      await apiPostForm('/apply.php', fd)
      setStatus('sent')
    } catch (err) {
      const e = err as ApiError
      setStatus('error')
      setMessage(e.message || 'Something went wrong. Please try again.')
      if (e.fields) setFieldErrors(e.fields)
    }
  }, [job, form, cv])

  // ── Load / error states ──
  if (loadError) {
    return (
      <>
        <SEO title="Position not found | Antra Business Group" description="This job posting is no longer available." path="/careers" />
        <main className={styles.notFound}>
          <p className={styles.notFoundText}>{loadError}</p>
          <Link to="/careers" className={styles.backLink}>← Back to all openings</Link>
        </main>
      </>
    )
  }

  if (!job) {
    return <main className={styles.loading}>Loading…</main>
  }

  return (
    <>
      <SEO
        title={`${job.title} | Careers — Antra Business Group`}
        description={job.summary || `Apply for ${job.title} at Antra Business Group in Addis Ababa.`}
        path={`/careers/${job.slug}`}
      />
      <main>
        {/* Banner */}
        <section data-theme-section="hero" className={styles.banner}>
          <div className={styles.bannerContainer}>
            <motion.div className={styles.breadcrumb} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link to="/careers">Careers</Link>
              <span>/</span>
              <span className={styles.breadcrumbCurrent}>{job.title}</span>
            </motion.div>
            <motion.h1 className={styles.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.7, ease: EASE }}>
              {job.title}
            </motion.h1>
            <motion.div className={styles.meta} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}>
              {job.department && <span className={styles.metaTag}>{job.department}</span>}
              {job.location && <span className={styles.metaTag}>{job.location}</span>}
              <span className={styles.metaTag}>{EMPLOYMENT_TYPE_LABELS[job.employment_type] ?? job.employment_type}</span>
              {job.salary_range && <span className={styles.metaTag}>{job.salary_range}</span>}
              {(() => {
                const tl = jobTimeLeft(job.closes_at)
                return tl && tl.urgent && !tl.closed
                  ? <span className={`${styles.metaTag} ${styles.metaUrgent}`}>⏳ {tl.label}</span>
                  : null
              })()}
            </motion.div>
          </div>
        </section>

        {/* Body: description + apply form */}
        <section className={styles.body}>
          <div className={styles.bodyContainer}>

            {/* Left: description */}
            <div className={styles.content}>
              {job.description && (
                <div className={styles.block}>
                  <h2 className={styles.blockTitle}>About the role</h2>
                  <p className={styles.blockText}>{job.description}</p>
                </div>
              )}
              {job.requirements && (
                <div className={styles.block}>
                  <h2 className={styles.blockTitle}>What we’re looking for</h2>
                  <p className={styles.blockText}>{job.requirements}</p>
                </div>
              )}
              {job.closes_at && (
                <p className={styles.deadline}>Applications close on {job.closes_at}.</p>
              )}
            </div>

            {/* Right: apply form */}
            <div ref={formRef} className={styles.formCol}>
              <div className={styles.formCard}>
                <h2 className={styles.formTitle}>Apply for this role</h2>

                {status === 'sent' ? (
                  <div className={styles.success}>
                    <span className={styles.successIcon}>✓</span>
                    <h3 className={styles.successTitle}>Application received.</h3>
                    <p className={styles.successText}>Thank you — our team will review your application and be in touch if there’s a fit.</p>
                    <Link to="/careers" className={styles.backLink}>← Back to all openings</Link>
                  </div>
                ) : (
                  <form className={styles.form} onSubmit={onSubmit} noValidate>
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
                      style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="name">Full Name *</label>
                      <input id="name" name="name" type="text" value={form.name} onChange={onChange}
                        className={`${styles.input} ${fieldErrors.name ? styles.inputError : ''}`} placeholder="Solomon Tadesse" />
                      {fieldErrors.name && <span className={styles.errText}>{fieldErrors.name}</span>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" value={form.email} onChange={onChange}
                        className={`${styles.input} ${fieldErrors.email ? styles.inputError : ''}`} placeholder="solomon@email.com" />
                      {fieldErrors.email && <span className={styles.errText}>{fieldErrors.email}</span>}
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="phone">Phone Number</label>
                      <input id="phone" name="phone" type="tel" value={form.phone} onChange={onChange}
                        className={styles.input} placeholder="+251 9__ __ __ __" />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="cv">CV / Résumé (PDF or Word, max 5 MB)</label>
                      <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        className={styles.fileInput}
                        onChange={e => setCv(e.target.files?.[0] ?? null)} />
                    </div>

                    <div className={styles.field}>
                      <label className={styles.label} htmlFor="cover_letter">Cover note</label>
                      <textarea id="cover_letter" name="cover_letter" rows={4} value={form.cover_letter} onChange={onChange}
                        className={`${styles.input} ${styles.textarea}`} placeholder="Tell us briefly why this role interests you…" />
                    </div>

                    <button type="submit" className={styles.submit} disabled={status === 'sending'}>
                      {status === 'sending' ? 'Submitting…' : 'Submit application'}
                    </button>

                    {status === 'error' && message && <p className={styles.formError}>{message}</p>}
                    <p className={styles.privacy}>Your details are shared only with our hiring team.</p>
                  </form>
                )}
              </div>
            </div>

          </div>
        </section>
      </main>
    </>
  )
}
