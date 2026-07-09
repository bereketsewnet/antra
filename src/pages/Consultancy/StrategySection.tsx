import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './StrategySection.module.css'

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number]

export function StrategySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>

        <div className={styles.grid}>

          {/* Left — text */}
          <div className={styles.textCol}>
            <motion.div
              className={styles.labelRow}
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.labelDot} />
              <span className={styles.labelText}>Strategy Practice</span>
            </motion.div>

            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12, duration: 0.8, ease: EASE }}
            >
              Organizational Strategy
              <br />
              <span className={styles.headingAccent}>and Business Alignment</span>
            </motion.h2>

            <motion.p
              className={styles.body}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              We support organizations to define clear, actionable strategies that are grounded
              in their context and translated into execution through structures, people, and
              capabilities. Our strategy support includes:
            </motion.p>
          </div>

          {/* Right — image */}
          <motion.div
            className={styles.imageWrap}
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.18, duration: 0.9, ease: EASE }}
          >
            <img
              src="/assets/consultancy%20assets/chaise_image.png"
              alt="Organizational Strategy and Business Alignment"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.imageCorner} />
          </motion.div>

        </div>

      </div>
    </section>
  )
}
