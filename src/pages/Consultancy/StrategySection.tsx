import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './StrategySection.module.css'

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number]

const points = [
  'Strategy formulation and refinement aligned to organizational purpose, market realities, and growth ambitions',
  'Translating strategy into clear priorities, operating models, and performance objectives',
  'Aligning organizational structure, leadership, and capabilities to strategic direction',
  'Supporting leadership teams to drive strategy execution, not just strategy design',
  'Ensuring coherence between strategy, functional transformation, and people outcomes',
]

export function StrategySection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="organizational-strategy" className={styles.section}>
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

          {/* Right — strategy support points */}
          <div className={styles.pointsList}>
            {points.map((pt, i) => (
              <motion.div
                key={pt}
                className={styles.pointItem}
                initial={{ opacity: 0, x: 32 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.65, ease: EASE }}
              >
                <span className={styles.pointNum}>{String(i + 1).padStart(2, '0')}</span>
                <p className={styles.pointText}>{pt}</p>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
