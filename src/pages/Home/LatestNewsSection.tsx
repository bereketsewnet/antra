import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './LatestNewsSection.module.css'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function LatestNewsSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>

        {/* Section label */}
        <motion.div
          className={styles.labelRow}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className={styles.labelDot} />
          <span className={styles.labelText}>The latest from Antra</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Featured news card */}
        <motion.article
          className={styles.card}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
        >
          {/* Image */}
          <div className={styles.imageWrap}>
            <img
              src="/assets/home%20assets/ovid_contrat.jpg"
              alt="OVID and Antra Business Group signing ceremony"
              className={styles.image}
            />
            <div className={styles.imageOverlay} />
          </div>

          {/* Text */}
          <div className={styles.cardBody}>
            <div className={styles.meta}>
              <span className={styles.tag}>Partnership</span>
              <span className={styles.date}>2026</span>
            </div>
            <h3 className={styles.title}>
              OVID signs contract with Antra Business Group
            </h3>
            <p className={styles.body}>
              OVID has engaged Antra to support its growth and transformation
              agenda — a partnership that brings our consultancy and sourcing
              capabilities together for a single client.
            </p>
          </div>
        </motion.article>

      </div>
    </section>
  )
}
