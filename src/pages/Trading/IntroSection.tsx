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
          {/* Left: copy */}
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
              Hard-to-source categories,
              <br />
              <span className={styles.headingAccent}>handled end to end.</span>
            </motion.h2>

            <motion.p
              className={styles.body}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.32, duration: 0.7 }}
            >
              Our trading work is concentrated in product categories where buyers in
              Ethiopia have a hard time finding consistent, technically capable
              suppliers. Most shipments come through our operations in the Djibouti
              Freezone, which keeps logistics costs and lead times manageable. We sell
              to fleet operators, contractors, hospitals, government buyers, and
              distributors — and most of our clients have worked with us on more than
              one purchase, which is the standard we measure ourselves against.
            </motion.p>

            <motion.p
              className={styles.bodySecondary}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              We offer trading solutions that connect clients with quality products,
              trusted suppliers, and efficient route-to-market strategies across
              Ethiopia and regional markets.
            </motion.p>

            <motion.div
              className={styles.accentLine}
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            />
          </div>

          {/* Right: image */}
          <motion.div
            className={styles.imageCol}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <img
              src="/assets/trading%20assets/freezone-operations.webp"
              alt="Antra Trading and Supply — Djibouti Freezone operations"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.imageCorner} />
          </motion.div>
        </div>

      </div>
    </section>
  )
}
