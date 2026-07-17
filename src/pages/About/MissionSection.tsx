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

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Our Mission
          <br />
          <span className={styles.headingAccent}>Enabling growth and transformation.</span>
        </motion.h2>

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
