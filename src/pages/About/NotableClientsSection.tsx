import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './NotableClientsSection.module.css'

export function NotableClientsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>06</span>
          <span className={styles.labelText}>Selected Engagement</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Trusted with
          <br />
          <span className={styles.headingAccent}>transformation that matters.</span>
        </motion.h2>

        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          We take on work where the outcome is measurable and the stakes are real.
        </motion.p>

        {/* Current engagement note */}
        <motion.div
          className={styles.engagementCard}
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <span className={styles.engagementTag}>Current Engagement</span>
          <p className={styles.engagementBody}>
            {/* TODO(client): swap anonymized phrase with named firm once permission is granted */}
            We are currently partnering with one of Ethiopia's largest and most respected
            construction companies to support its organizational transformation journey —
            strengthening leadership capabilities, enhancing organizational effectiveness,
            and driving sustainable business performance through tailored consultancy
            solutions.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
