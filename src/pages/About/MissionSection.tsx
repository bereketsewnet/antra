import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './MissionSection.module.css'

const pillars = [
  {
    num: '01',
    title: 'Management Consultancy',
    text: 'To be a trusted partner of choices for organizational transformation, leadership development, strategy & business alignment, training, coaching and mentoring, talent search and consultancy services in Ethiopia & regional markets.',
  },
  {
    num: '02',
    title: 'Trading & Supply',
    text: 'To be a preferred supplier for selected products for Ethiopia and regional markets.',
  },
]

export function MissionSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="our-mission" data-theme-section="hero" className={styles.section}>
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
          Our mission is to
          <br />
          <span className={styles.headingAccent}>empower organisations.</span>
        </motion.h2>

        <motion.p
          className={styles.statement}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          Our mission is to empower organizations by delivering exceptional management consulting
          and reliable sourcing solutions that drive performance, efficiency, and sustainable growth.
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
