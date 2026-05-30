import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ValuesSection.module.css'

const missions = [
  {
    label: 'Management Consultancy',
    text:
      'To help leadership teams in Ethiopia and the wider region carry out what they decide — not just advise on it. We sit inside the problem, not outside it.',
  },
  {
    label: 'Trading & Supply',
    text:
      'To give Ethiopian buyers reliable access to technically capable suppliers in categories where that access has historically been inconsistent or absent.',
  },
]

const values = [
  {
    number: '01',
    title: 'Directness',
    body: 'We tell clients what we actually think. Soft-pedalling a diagnosis is not a service — it delays the fix.',
  },
  {
    number: '02',
    title: 'Reliability',
    body: 'One business day response. No exceptions. If we take on a matter, we are reachable for it.',
  },
  {
    number: '03',
    title: 'Local Expertise',
    body: 'Eighteen-plus years operating inside Ethiopia means our advice reflects local market reality, not imported frameworks.',
  },
  {
    number: '04',
    title: 'Long-term Thinking',
    body: 'We measure success by whether the client is still stronger twelve months after the engagement, not twelve days.',
  },
  {
    number: '05',
    title: 'Dual-lens Perspective',
    body: 'Having a foot in both consultancy and commerce means we understand the operational and financial side of a decision simultaneously.',
  },
]

export function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgOverlay} />

      <div className={styles.container}>
        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>02</span>
          <span className={styles.labelText}>What We Stand For</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Section heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          The principles that
          <br />
          <span className={styles.headingAccent}>don't bend.</span>
        </motion.h2>

        {/* Mission pair */}
        <motion.div
          className={styles.missions}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          {missions.map((m, i) => (
            <motion.div
              key={m.label}
              className={styles.missionCard}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.6 }}
            >
              <span className={styles.missionTag}>{m.label}</span>
              <p className={styles.missionText}>{m.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Divider */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.55, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        />

        {/* Values grid */}
        <div className={styles.valuesGrid}>
          {values.map((v, i) => (
            <motion.div
              key={v.number}
              className={styles.valueCard}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.65, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <span className={styles.valueNumber}>{v.number}</span>
              <h3 className={styles.valueTitle}>{v.title}</h3>
              <p className={styles.valueBody}>{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
