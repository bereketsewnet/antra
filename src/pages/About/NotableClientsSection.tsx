import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './NotableClientsSection.module.css'

/* TODO(client): replace text logos with image assets once client confirms permission to display */
const clients = [
  { name: 'Coca-Cola Company' },
  { name: 'MOENCO' },
  { name: 'Ethiopian Airlines' },
  { name: 'and more.' },
]

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
          <span className={styles.labelNumber}>03</span>
          <span className={styles.labelText}>Notable Engagements</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          We've worked with leading
          <br />
          <span className={styles.headingAccent}>institutions across the region.</span>
        </motion.h2>

        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          A selection of organizations we've supported across consultancy and trading.
        </motion.p>

        {/* Logo strip (text fallback) */}
        <div className={styles.logoStrip}>
          {clients.map((c, i) => (
            <motion.div
              key={c.name}
              className={styles.logoTile}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <span className={styles.logoText}>{c.name}</span>
            </motion.div>
          ))}
        </div>

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
            We are currently partnering with one of Ethiopia's largest construction firms
            to support its organizational transformation — strengthening leadership
            capabilities, enhancing organizational effectiveness, and driving sustainable
            business performance through tailored consultancy solutions.
          </p>
        </motion.div>

      </div>
    </section>
  )
}
