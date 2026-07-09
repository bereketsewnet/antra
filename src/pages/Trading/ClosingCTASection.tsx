import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './ClosingCTASection.module.css'

const categories = [
  { label: 'Electric Vehicles' },
  { label: 'Construction Machinery' },
  { label: 'Sanitary Equipment' },
  { label: 'Medical Equipment' },
]

export function TradingClosingCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
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
          Request a quote
        </motion.p>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Request
          <span className={styles.headingAccent}> a quote.</span>
        </motion.h2>

        <motion.p
          className={styles.sub}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.7 }}
        >
          Send us the specifications, the quantity, and your timeline, and we will come back with options and a price.
        </motion.p>

        {/* Category tags */}
        <motion.div
          className={styles.tags}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.55, duration: 0.6 }}
        >
          {categories.map((c) => (
            <span key={c.label} className={styles.tag}>{c.label}</span>
          ))}
        </motion.div>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <Link to="/contact" className={styles.btnPrimary}>
            Request a quote
          </Link>
          <Link to="/about" className={styles.btnGhost}>
            About Antra
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
