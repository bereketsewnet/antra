import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './PartnersSection.module.css'

const PARTNERS = [
  {
    name: 'NOVA Business School Africa',
    logo: '/assets/consultancy%20assets/nova_partner_logo.png',
    url: 'https://nova.edu.gh',
  },
  {
    name: 'Batian Consulting',
    logo: '/assets/consultancy%20assets/Batian_partner_logo.png',
    url: 'https://www.batian-consulting.com',
  },
]

export function PartnersSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className={styles.section}>
      <div className={styles.container}>

        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.eyebrow}>Our Partners</span>
          <h2 className={styles.heading}>
            Working alongside <span className={styles.headingAccent}>trusted institutions.</span>
          </h2>
        </motion.div>

        <div className={styles.partnersGrid}>
          {PARTNERS.map((partner, index) => (
            <motion.a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.partnerCard}
              aria-label={`${partner.name} — opens in a new tab`}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + index * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <div className={styles.logoWrap}>
                <img
                  src={partner.logo}
                  alt={`${partner.name} logo`}
                  className={styles.logo}
                  loading="lazy"
                />
              </div>
              <span className={styles.partnerName}>{partner.name}</span>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  )
}
