import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './KeySuppliersSection.module.css'

export function KeySuppliersSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>

        <motion.div
          className={styles.labelRow}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>03</span>
          <span className={styles.labelText}>Key Suppliers</span>
          <div className={styles.labelLine} />
        </motion.div>

        <motion.div
          className={styles.imageWrap}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          <img
            src="/assets/trading%20assets/suppliers_images.png"
            alt="Antra Key Suppliers — XCMG, DEVELON, ABA Trading FZCO, My Wish Enterprise"
            className={styles.image}
            loading="lazy"
          />
        </motion.div>

      </div>
    </section>
  )
}
