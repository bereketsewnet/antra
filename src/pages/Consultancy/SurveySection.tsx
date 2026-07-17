import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { apiGet } from '@/lib/api'
import styles from './SurveySection.module.css'

interface PublishedSurvey {
  id: number
  slug: string
  title: string
  description: string | null
}

// Shows published surveys as simple cards. Renders nothing when there are
// none, so the section only appears when the admin has published a survey.
// The section mounts *after* its data loads (at an unpredictable scroll
// position), so it animates on mount rather than gating on scroll-into-view —
// otherwise the content could stay invisible (an empty dark box).
export function SurveySection() {
  const [surveys, setSurveys] = useState<PublishedSurvey[]>([])

  useEffect(() => {
    let alive = true
    apiGet<{ surveys: PublishedSurvey[] }>('/survey.php')
      .then(d => { if (alive) setSurveys(d.surveys || []) })
      .catch(() => { if (alive) setSurveys([]) })
    return () => { alive = false }
  }, [])

  if (surveys.length === 0) return null

  return (
    <section id="surveys" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelDot} />
          <span className={styles.labelText}>Your Voice</span>
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          Share your feedback.
        </motion.h2>

        <div className={styles.grid}>
          {surveys.map((sv, i) => (
            <motion.div
              key={sv.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
            >
              <Link to={`/survey/${sv.slug}`} className={styles.card}>
                <span className={styles.cardTag}>Survey</span>
                <h3 className={styles.cardTitle}>{sv.title}</h3>
                {sv.description && <p className={styles.cardDesc}>{sv.description}</p>}
                <span className={styles.cardCta}>Take the survey →</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
