import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { apiGet, EMPLOYMENT_TYPE_LABELS, type JobListItem } from '@/lib/api'
import { jobTimeLeft } from '@/lib/jobTime'
import styles from './Careers.module.css'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Careers at Antra Business Group',
  url: 'https://antragroup.et/careers',
  description: 'Open positions at Antra Business Group — join our consulting and trading teams in Addis Ababa, Ethiopia.',
}

export function CareersPage() {
  const [jobs, setJobs] = useState<JobListItem[] | null>(null)
  const [error, setError] = useState(false)

  const listRef = useRef<HTMLDivElement>(null)
  const inView = useInView(listRef, { once: true, margin: '-80px' })

  useEffect(() => {
    let alive = true
    apiGet<{ jobs: JobListItem[] }>('/jobs.php')
      .then(d => { if (alive) setJobs(d.jobs) })
      .catch(() => { if (alive) setError(true) })
    return () => { alive = false }
  }, [])

  return (
    <>
      <SEO
        title="Careers at Antra Business Group | Jobs in Addis Ababa"
        description="Explore open positions at Antra Business Group. Join our management consulting and trading teams in Addis Ababa, Ethiopia."
        path="/careers"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">

        {/* Header */}
        <section data-theme-section="hero" className={styles.header}>
          <div className={styles.headerContainer}>
            <motion.p
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Careers
            </motion.p>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              Build what comes
              <br />
              <span className={styles.titleAccent}>next with us.</span>
            </motion.h1>
            <motion.p
              className={styles.sub}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              We hire people who do the work properly and stay until it is done.
              Open roles across our consulting and trading teams are listed below.
            </motion.p>
          </div>
        </section>

        {/* Listing */}
        <section className={styles.listSection}>
          <div ref={listRef} className={styles.listContainer}>

            {jobs === null && !error && (
              <div className={styles.state}>Loading open positions…</div>
            )}

            {error && (
              <div className={styles.state}>
                We couldn’t load open positions right now. Please refresh, or
                email <a href="mailto:info@antragroup.et" className={styles.stateLink}>info@antragroup.et</a>.
              </div>
            )}

            {jobs !== null && jobs.length === 0 && (
              <div className={styles.state}>
                There are no open positions at the moment. Check back soon —
                or send your CV to <a href="mailto:info@antragroup.et" className={styles.stateLink}>info@antragroup.et</a> and
                we’ll keep it on file.
              </div>
            )}

            {jobs && jobs.length > 0 && (
              <div className={styles.grid}>
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.05 + i * 0.07, duration: 0.55, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                  >
                    <Link to={`/careers/${job.slug}`} className={styles.card}>
                      {job.thumbnail && (
                        <div className={styles.cardImageWrap}>
                          <img src={job.thumbnail} alt="" className={styles.cardImage} loading="lazy" />
                        </div>
                      )}
                      <div className={styles.cardMeta}>
                        <span className={`${styles.metaTag} ${styles.metaType}`}>
                          {EMPLOYMENT_TYPE_LABELS[job.employment_type] ?? job.employment_type}
                        </span>
                        {job.department && <span className={styles.metaTag}>{job.department}</span>}
                        {(() => {
                          const tl = jobTimeLeft(job.closes_at)
                          return tl && tl.urgent && !tl.closed
                            ? <span className={`${styles.metaTag} ${styles.metaUrgent}`}>⏳ {tl.label}</span>
                            : null
                        })()}
                      </div>
                      <h2 className={styles.cardTitle}>{job.title}</h2>
                      {job.summary && <p className={styles.cardSummary}>{job.summary}</p>}
                      <div className={styles.cardFoot}>
                        {job.location && <span className={styles.cardLocation}>{job.location}</span>}
                        <span className={styles.cardCta} aria-hidden="true">View role →</span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

          </div>
        </section>

      </motion.main>
    </>
  )
}
