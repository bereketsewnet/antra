import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './LeaderSection.module.css'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export function LeaderSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>

        {/* Left — photo */}
        <motion.div
          className={styles.photoWrap}
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <img
            src="/assets/home%20assets/leader_image.jpg"
            alt="Anteneh Tegegn — Managing Director"
            className={styles.photo}
          />
          <div className={styles.photoGlow} />
        </motion.div>

        {/* Right — content */}
        <div className={styles.content}>

          <motion.div
            className={styles.labelRow}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className={styles.labelDot} />
            <span className={styles.labelText}>Meet Our Leaders</span>
          </motion.div>

          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
          >
            The people behind<br />
            <span className={styles.headingAccent}>the practice.</span>
          </motion.h2>

          <motion.div
            className={styles.leader}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.75, ease: EASE }}
          >
            <div className={styles.leaderAccent} />
            <div className={styles.leaderInfo}>
              <span className={styles.leaderName}>Anteneh Tegegn</span>
              <span className={styles.leaderTitle}>Managing Director · PhD</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
