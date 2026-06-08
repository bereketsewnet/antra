import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './HowPracticesFitSection.module.css'

const connections = [
  {
    index: '01',
    title: 'Practical, Strategic, and Business-Driven Expertise',
    body: 'Real-world operational experience paired with strategic insight — we connect the boardroom view to the shop-floor reality.',
  },
  {
    index: '02',
    title: 'BHR-led Organizational Transformation',
    body: 'Business-HR-led change programs that connect people, structure, and strategy — not standalone HR initiatives.',
  },
  {
    index: '03',
    title: 'Africa-focused, Market-Relevant Solutions',
    body: 'Engagements shaped for Ethiopian and regional realities, not imported frameworks lifted from other markets.',
  },
  {
    index: '04',
    title: 'Partnership-Based Approach',
    body: 'We build alongside leadership teams rather than handing over a report and leaving. The client owns the outcome.',
  },
  {
    index: '05',
    title: 'End-to-End Support',
    body: 'From diagnosis through design into implementation — we stay in the room until the change is embedded.',
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
          <span className={styles.labelNumber}>04</span>
          <span className={styles.labelText}>What Makes Us Unique</span>
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
              What makes
              <br />
              <span className={styles.headingAccent}>us unique.</span>
            </motion.h2>

            <motion.p
              className={styles.intro}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.7 }}
            >
              Five things clients consistently tell us set Antra apart from other firms in the region — across both consultancy and trading.
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
