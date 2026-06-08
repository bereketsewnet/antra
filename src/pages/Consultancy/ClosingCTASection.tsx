import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './ClosingCTASection.module.css'

export function ConsultancyClosingCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Animated glow blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        {/* Divider line */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.0, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        />

        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Book a discovery call
        </motion.p>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          If any of this is on your desk —
          <br />
          <span className={styles.headingAccent}>let's talk.</span>
        </motion.h2>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          We spend the first session understanding the business before we propose anything. No qualification gauntlet — just a direct conversation about what you need.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link to="/contact" className={styles.btnPrimary}>
            Book a discovery call
          </Link>
          <Link to="/about" className={styles.btnGhost}>
            Learn more about us
          </Link>
        </motion.div>

        {/* Bottom stat strip */}
        <motion.div
          className={styles.stats}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          {[
            { value: '18+', label: 'Years in Ethiopia' },
            { value: '1', label: 'Business day response' },
            { value: '2', label: 'Integrated practices' },
          ].map((s) => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
