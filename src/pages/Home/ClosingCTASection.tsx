import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import styles from './ClosingCTASection.module.css'

export function ClosingCTASection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      {/* Animated orange glow blobs */}
      <div className={styles.blob1} />
      <div className={styles.blob2} />

      <div className={styles.container}>
        <motion.span
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          LET'S WORK TOGETHER
        </motion.span>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
        >
          Tell us what you
          <br />
          are working on.
        </motion.h2>

        <motion.p
          className={styles.body}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          If you have a leadership challenge, a sourcing requirement, or a project
          that touches both — send us a note. One of our partners will respond
          within a business day.
        </motion.p>

        <motion.div
          className={styles.actions}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <Button variant="primary" href="/contact">Get in touch</Button>
          <Button variant="ghost" href="/about">Learn about us</Button>
        </motion.div>

        {/* Decorative divider line with orange pip */}
        <motion.div
          className={styles.divider}
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.5, duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        />
      </div>
    </section>
  )
}
