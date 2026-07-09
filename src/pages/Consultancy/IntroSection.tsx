import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './IntroSection.module.css'

export function IntroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        <div className={styles.grid}>
          {/* Left: image */}
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <img
              src="/assets/consultancy%20assets/leadership-development.webp"
              alt="Antra Management Consultancy — leadership development"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.imageCorner} />
          </motion.div>

          {/* Right: copy */}
          <div className={styles.textCol}>
            <motion.span
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.55 }}
            >
              Our Approach
            </motion.span>

            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 28 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.22, duration: 0.75, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              Practical solutions,
              <br />
              <span className={styles.headingAccent}>not theory.</span>
            </motion.h2>

            <motion.p
              className={styles.body}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.32, duration: 0.7 }}
            >
              Our Management Consultancy services partner closely with clients to
              deliver practical, customer-focused solutions that address real business
              challenges and create sustainable value. Rather than providing theoretical
              recommendations, we work alongside leaders and teams to transform
              underperforming or dysfunctional, growing organizations through the journey
              of combining strategic insight, real-world operational experience, and
              hands-on implementation support to achieve measurable business outcomes.
            </motion.p>

            <motion.div
              className={styles.accentLine}
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            />
          </div>
        </div>

      </div>
    </section>
  )
}
