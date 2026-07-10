import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ProblemsSection.module.css'

const problems = [
  'Organizational restructuring that needs to land without breaking the business.',
  'A leadership pipeline that is thinner than it should be.',
  'Difficulty attracting, retaining, or developing the right talent.',
  'Inconsistent culture or low engagement across teams.',
  'Compliance, governance, or risk gaps surfacing as the business scales.',
  'Rapid growth outrunning the systems and structure that were supposed to support it.',
]

export function ProblemsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="what-clients-bring-us" className={styles.section}>
      <div className={styles.container}>

        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>03</span>
          <span className={styles.labelText}>What Clients Bring Us</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          The kinds of problems
          <br />
          <span className={styles.headingAccent}>we walk into.</span>
        </motion.h2>

        {/* Bullets grid */}
        <div className={styles.grid}>
          {problems.map((p, i) => (
            <motion.div
              key={p}
              className={styles.item}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <div className={styles.itemIcon}>
                <div className={styles.iconDot} />
              </div>
              <p className={styles.itemBody}>{p}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
