import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './MissionSection.module.css'

const pillars = [
  { num: '01', title: 'Enable Growth', text: 'We exist to help organisations grow — in capability, in performance, and in market reach.' },
  { num: '02', title: 'Drive Transformation', text: 'Change that sticks requires the right leadership, the right structure, and the right support across every level.' },
  { num: '03', title: 'Connect Ethiopia', text: 'Bridging Ethiopian businesses to global products, standards, and best practices — reliably and at scale.' },
]

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgOverlay} aria-hidden="true" />
      <div className={styles.container}>

        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>02</span>
          <span className={styles.labelText}>Our Mission</span>
          <div className={styles.labelLine} />
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          To enable sustainable growth
          <br />
          <span className={styles.headingAccent}>and organisational excellence.</span>
        </motion.h2>

        <motion.p
          className={styles.statement}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Across Ethiopia and the wider region — by combining world-class management consultancy
          with reliable strategic trade, backed by professional and academic excellence.
        </motion.p>

        <div className={styles.pillars}>
          {pillars.map((p, i) => (
            <motion.div
              key={p.num}
              className={styles.pillar}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35 + i * 0.14, duration: 0.65 }}
            >
              <span className={styles.pillarNum}>{p.num}</span>
              <h3 className={styles.pillarTitle}>{p.title}</h3>
              <p className={styles.pillarText}>{p.text}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
