import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './KeyPartnersSection.module.css'

const PARTNERS = [
  {
    name: 'NOVA Business School Africa',
    logo: '/assets/consultancy%20assets/nova_partner_logo.png',
  },
  {
    name: 'Batian Consulting',
    logo: '/assets/consultancy%20assets/Batian_partner_logo.png',
  },
]

const IMPACT_STATS = [
  {
    figure: '25–35%',
    caption: 'Improvement in project delivery efficiency',
    source: 'Industry research — large-scale transformation, McKinsey Global Institute',
  },
  {
    figure: '2×',
    caption: 'Higher leadership retention post-transformation',
    source: 'Industry research — organisational change & talent, Deloitte Human Capital',
  },
  {
    figure: '12%',
    caption: 'Reduction in rework hours through improved communication',
    source: 'Industry research — digital transformation impact, McKinsey',
  },
  {
    figure: '3–5×',
    caption: 'Return on transformation investment over 5 years',
    source: 'Industry research — organisational transformation ROI',
  },
]

export function KeyPartnersSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="key-partners" className={styles.section}>
      <div className={styles.topFade} aria-hidden="true" />
      <div className={styles.container}>

        <motion.div
          className={styles.labelRow}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>04</span>
          <span className={styles.labelText}>Key Partners</span>
          <div className={styles.labelLine} />
        </motion.div>

        <div className={styles.partnersGrid}>
          {PARTNERS.map((partner, index) => (
            <motion.div
              key={partner.name}
              className={styles.partnerCard}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + index * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
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
            </motion.div>
          ))}
        </div>

        <motion.div
          className={styles.impactIntro}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          <h3 className={styles.impactHeading}>
            Why structured transformation <span className={styles.impactHeadingAccent}>pays off</span>
          </h3>
          <p className={styles.impactSubtext}>
            Industry benchmarks — what organisations gain from structured transformation programs.
          </p>
        </motion.div>

        <div className={styles.statsGrid}>
          {IMPACT_STATS.map((stat, index) => (
            <motion.div
              key={stat.caption}
              className={styles.statCard}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <span className={styles.statFigure}>{stat.figure}</span>
              <span className={styles.statCaption}>{stat.caption}</span>
              <span className={styles.statSource}>{stat.source}</span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
