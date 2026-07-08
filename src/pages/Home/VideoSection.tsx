import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './VideoSection.module.css'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function VideoSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      {/* Background video */}
      <video
        className={styles.video}
        src="/assets/webpage2_video.mp4"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className={styles.overlay} />
      <div className={styles.vignette} />

      <div className={styles.container}>

        {/* Eyebrow */}
        <motion.div
          className={styles.eyebrow}
          initial={{ opacity: 0, y: -16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <span className={styles.eyebrowDot} />
          <span className={styles.eyebrowText}>Who We Are</span>
        </motion.div>

        {/* Split headline — large left block */}
        <div className={styles.headlineBlock}>
          {[
            { text: 'Proven practices.', accent: false, delay: 0.1 },
            { text: 'Deep expertise.', accent: false, delay: 0.22 },
            { text: 'Real results.', accent: true, delay: 0.34 },
          ].map(({ text, accent, delay }) => (
            <motion.span
              key={text}
              className={`${styles.headlineLine} ${accent ? styles.headlineAccent : ''}`}
              initial={{ opacity: 0, y: 36 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay, duration: 0.85, ease: EASE }}
            >
              {text}
            </motion.span>
          ))}
        </div>

        {/* Body + CTA column */}
        <motion.div
          className={styles.bodyCol}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45, duration: 0.85, ease: EASE }}
        >
          <p className={styles.body}>
            We bring proven practices, deep cross-industry knowledge, and global
            expertise to support and drive organizational transformation —
            backed by more than <strong>20 years</strong> of corporate experience
            and a proven track record of excellence.
          </p>

          <span className={styles.btnPending}>In progress…</span>
        </motion.div>

      </div>
    </section>
  )
}
