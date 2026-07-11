import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WhyBuyersSection.module.css'

const points = [
  {
    title: 'Direct relationships with manufacturers',
    text: 'Rather than working through layered distribution chains — better pricing, better technical answers, faster issue resolution.',
  },
  {
    title: 'Djibouti free zone operations',
    text: 'For faster and cheaper regional logistics.',
  },
  {
    title: 'Order sizes from single units to large fleet purchases',
    text: 'Same team, same standard regardless of order size.',
  },
]

export function WhyBuyersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="why-buyers-work-with-us" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>

          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: -40, scale: 0.97 }}
            animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <img
              src="/assets/trading%20assets/freezone-operations.webp"
              alt="Djibouti Free Zone operations"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.badge}>
              <span className={styles.badgeTitle}>Djibouti Free Zone</span>
              <span className={styles.badgeSub}>Registered operator</span>
            </div>
          </motion.div>

          <div className={styles.content}>
            <motion.div
              className={styles.sectionLabel}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.labelNumber}>02</span>
              <span className={styles.labelText}>Why Buyers Work With Us</span>
              <div className={styles.labelLine} />
            </motion.div>

            <motion.h3
              className={styles.heading}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.75 }}
            >
              Why buyers
              <br />
              <span className={styles.headingAccent}>work with us.</span>
            </motion.h3>

            <div className={styles.points}>
              {points.map((pt, i) => (
                <motion.div
                  key={pt.title}
                  className={styles.point}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
                >
                  <span className={styles.pointBar} />
                  <div>
                    <h4 className={styles.pointTitle}>{pt.title}</h4>
                    <p className={styles.pointText}>{pt.text}</p>
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
