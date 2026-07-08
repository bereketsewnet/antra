import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WhoWeAreSection.module.css'

const points = [
  { label: 'Management Consultancy', text: 'Leadership, strategy, and people solutions built around how Ethiopian and regional organisations actually operate.' },
  { label: 'Trading & Supply', text: 'Sourcing equipment that cannot be easily found inside Ethiopia — directly from manufacturers via the Djibouti Free Zone.' },
  { label: 'Our Reach', text: 'Based in Addis Ababa, serving corporations and institutions across Ethiopia and the wider East African region.' },
]

export function WhoWeAreSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        <div className={styles.grid}>
          {/* Left col */}
          <div className={styles.leftCol}>
            <motion.div
              className={styles.sectionLabel}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.labelNumber}>01</span>
              <span className={styles.labelText}>Who We Are</span>
              <div className={styles.labelLine} />
            </motion.div>

            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              A business group
              <br />
              <span className={styles.headingAccent}>built for Ethiopia.</span>
            </motion.h2>

            <motion.div
              className={styles.divider}
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            />
          </div>

          {/* Right col */}
          <div className={styles.rightCol}>
            <motion.p
              className={styles.lead}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              We are a management consultancy and a trading company based in Addis Ababa.
              Companies and institutions across Ethiopia work with us when they need to rebuild
              an organisation's leadership bench, sharpen how the business runs, or source
              equipment that is hard to find locally.
            </motion.p>

            <div className={styles.points}>
              {points.map((p, i) => (
                <motion.div
                  key={p.label}
                  className={styles.point}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
                >
                  <div className={styles.pointBar} />
                  <div>
                    <div className={styles.pointLabel}>{p.label}</div>
                    <p className={styles.pointText}>{p.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
