import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './KeySuppliersSection.module.css'

const SUPPLIERS = [
  {
    name: 'XCMG',
    logo: '/assets/trading%20assets/XCMG_logo.webp',
  },
  {
    name: 'DEVELON',
    logo: '/assets/trading%20assets/develon_partner_logo.png',
  },
  {
    name: 'ABA Trading FZCO',
    logo: '/assets/trading%20assets/ABA_trading_logo.png',
  },
  {
    name: 'My Wish Enterprise',
    logo: '/assets/trading%20assets/my_whish_partner_logo.png',
  },
]

export function KeySuppliersSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="suppliers" className={styles.section}>
      <div className={styles.topFade} aria-hidden="true" />
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

        <div className={styles.suppliersGrid}>
          {SUPPLIERS.map((supplier, index) => (
            <motion.div
              key={supplier.name}
              className={styles.supplierCard}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <div className={styles.logoWrap}>
                <img
                  src={supplier.logo}
                  alt={`${supplier.name} logo`}
                  className={styles.logo}
                  loading="lazy"
                />
              </div>
              <span className={styles.supplierName}>{supplier.name}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
