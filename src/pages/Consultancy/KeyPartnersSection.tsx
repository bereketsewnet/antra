import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './KeyPartnersSection.module.css'

export function KeyPartnersSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.topFade} aria-hidden="true" />
      <div className={styles.container}>

        <motion.div
          className={styles.labelRow}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>04</span>
          <span className={styles.labelText}>Key Partners</span>
          <div className={styles.labelLine} />
        </motion.div>

        <motion.div
          className={styles.imageWrap}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          <img
            src="/assets/consultancy%20assets/partners-image.png"
            alt="Antra Key Partners — NOVA Business School Africa and Batian Consulting"
            className={styles.image}
            loading="lazy"
          />
        </motion.div>

      </div>
    </section>
  )
}
