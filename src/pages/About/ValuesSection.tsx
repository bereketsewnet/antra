import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ValuesSection.module.css'

const mission = {
  label: 'Our Mission',
  text:
    'To be a trusted partner of choice for organizational transformation, leadership development, strategy and business alignment, training, coaching and mentoring, talent search, and consultancy services in Ethiopia and regional markets — and a preferred supplier of selected products to Ethiopia and the region.',
}

const values = [
  {
    number: '01',
    title: 'Integrity and Compliance',
    body: 'We turn down work that requires us to bend.',
  },
  {
    number: '02',
    title: 'Customer Focus and Excellence',
    body: 'Engagements end when the client has the outcome, not when the contract runs out.',
  },
  {
    number: '03',
    title: 'Efficiency and Effectiveness',
    body: 'We staff lean and bring in extra hands only when the work calls for it.',
  },
  {
    number: '04',
    title: 'Collaboration and Commitment',
    body: 'Our consultants train your team to take over what we built.',
  },
  {
    number: '05',
    title: 'Continuous Learning and Agility',
    body: 'Every consultant is expected to stay current on the sectors they cover.',
  },
]

export function ValuesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} data-theme-section="hero" className={styles.section}>
      <div className={styles.bgOverlay} />

      <div className={styles.container}>
        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>04</span>
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

        {/* Single combined mission */}
        <motion.div
          className={styles.missions}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          <motion.div
            className={styles.missionCard}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className={styles.missionTag}>{mission.label}</span>
            <p className={styles.missionText}>{mission.text}</p>
          </motion.div>
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

        {/* Closing micro-line */}
        <motion.p
          className={styles.cultureLine}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.7 }}
        >
          We aim to create a high-performing and rewarding culture.
        </motion.p>
      </div>
    </section>
  )
}
