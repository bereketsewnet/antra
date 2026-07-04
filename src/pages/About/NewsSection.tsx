import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './NewsSection.module.css'

/* TODO(client): replace sample announcement with confirmed news copy, date, and logo. */
const news = [
  {
    date: 'Recent',
    tag: 'Partnership',
    title: 'OVID signs contract with Antra Business Group',
    body: 'OVID has engaged Antra to support its growth and transformation agenda — a partnership that brings our consultancy and sourcing capabilities together for a single client.',
  },
]

export function NewsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgOverlay} />

      <div className={styles.container}>

        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>06</span>
          <span className={styles.labelText}>In the News</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          What's <span className={styles.headingAccent}>new.</span>
        </motion.h2>

        {/* News cards */}
        <div className={styles.list}>
          {news.map((n, i) => (
            <motion.article
              key={n.title}
              className={styles.card}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <div className={styles.meta}>
                <span className={styles.tag}>{n.tag}</span>
                <span className={styles.date}>{n.date}</span>
              </div>
              <h3 className={styles.title}>{n.title}</h3>
              <p className={styles.body}>{n.body}</p>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  )
}
