import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './HowPracticesFitSection.module.css'

const connections = [
  {
    index: '01',
    title: 'Shared Client Base',
    body: 'The companies that hire us to restructure operations are often the same companies that need three excavators delivered by end of quarter. One relationship serves both.',
  },
  {
    index: '02',
    title: 'Operational Credibility',
    body: 'Running a trading operation means we have procured, shipped, and cleared goods through Ethiopian customs. That experience makes our supply-chain advice credible in a way pure consultancy cannot.',
  },
  {
    index: '03',
    title: 'Speed of Trust',
    body: 'A client we already advise does not need a long qualification process before buying equipment from us. And a buyer who knows us through trading is more likely to engage us for leadership work.',
  },
]

export function HowPracticesFitSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const mapInView = useInView(mapRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Subtle grid overlay */}
      <div className={styles.gridOverlay} />

      <div className={styles.container}>
        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>03</span>
          <span className={styles.labelText}>How the Practices Fit</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Main grid */}
        <div className={styles.grid}>
          {/* Left: map image */}
          <div ref={mapRef} className={styles.mapCol}>
            <motion.div
              className={styles.mapWrap}
              initial={{ opacity: 0, x: -40, scale: 0.97 }}
              animate={mapInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <img
                src="/assets/about%20assets/trade-corridor-map.webp"
                alt="Trade corridor map — Antra Business Group"
                className={styles.mapImage}
                loading="lazy"
              />
              <div className={styles.mapLabel}>
                <span className={styles.mapLabelText}>Djibouti Free Zone · Addis Ababa</span>
                <span className={styles.mapLabelSub}>Primary trade corridor</span>
              </div>
            </motion.div>
          </div>

          {/* Right: connections */}
          <div className={styles.connectionsCol}>
            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              Two practices.
              <br />
              <span className={styles.headingAccent}>One advantage.</span>
            </motion.h2>

            <motion.p
              className={styles.intro}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              Most firms pick one lane. We operate in two because the clients we serve benefit from both. The overlap is not accidental — it is the whole point.
            </motion.p>

            <div className={styles.connections}>
              {connections.map((c, i) => (
                <motion.div
                  key={c.index}
                  className={styles.connection}
                  initial={{ opacity: 0, x: 24 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.12, duration: 0.6 }}
                >
                  <span className={styles.connIndex}>{c.index}</span>
                  <div className={styles.connContent}>
                    <h3 className={styles.connTitle}>{c.title}</h3>
                    <p className={styles.connBody}>{c.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.7 }}
        >
          <div className={styles.ctaInner}>
            <div className={styles.ctaText}>
              <h3 className={styles.ctaHeading}>Ready to work with us?</h3>
              <p className={styles.ctaSub}>
                Tell us what you are working on. We will respond within one business day.
              </p>
            </div>
            <div className={styles.ctaActions}>
              <Link to="/contact" className={styles.ctaBtn + ' ' + styles.ctaBtnPrimary}>
                Start a conversation
              </Link>
              <Link to="/consultancy" className={styles.ctaBtn + ' ' + styles.ctaBtnGhost}>
                See our services
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
