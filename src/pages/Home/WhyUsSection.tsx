import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WhyUsSection.module.css'

// Two labeled groups of differentiators — Consultancy (primary) + Trading.
// Consultancy descriptions mirror About's HowPracticesFitSection for consistency.
const groups = [
  {
    name: 'Management Consultancy',
    items: [
      {
        title: 'Practical, Strategic & Business-Driven Expertise',
        body: 'Real-world operational experience paired with strategic insight — we connect the boardroom view to the shop-floor reality.',
      },
      {
        title: 'BHR-led Organizational Transformation',
        body: 'Business-HR-led change programs that connect people, structure, and strategy — not standalone HR initiatives.',
      },
      {
        title: 'Africa-focused, Market-Relevant Solutions',
        body: 'Engagements shaped for Ethiopian and regional realities, not imported frameworks lifted from other markets.',
      },
      {
        title: 'Partnership-Based Approach',
        body: 'We build alongside leadership teams rather than handing over a report and leaving. The client owns the outcome.',
      },
      {
        title: 'End-to-End Support',
        body: 'From diagnosis through design into implementation — we stay in the room until the change is embedded.',
      },
    ],
  },
  {
    name: 'Trading & Supply',
    items: [
      {
        title: 'Distribution & Retail Expertise',
        body: 'Deep experience moving product through Ethiopian and regional distribution and retail channels.',
      },
      {
        title: 'Brand-Building Capability',
        body: 'We help product lines build a credible presence in the market, not just land a shipment.',
      },
      {
        title: 'Handling Fleet Customers & Traders',
        body: 'Set up to serve high-volume fleet buyers and trade partners — from a single order to full procurement.',
      },
    ],
  },
]

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} data-theme-section="hero" className={styles.section}>
      {/* Background image with overlay */}
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      <div className={styles.container}>

        {/* Section header */}
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            WHAT MAKES US UNIQUE
          </motion.span>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            What makes
            <br />
            <span className={styles.titleAccent}>us unique.</span>
          </motion.h2>
        </div>

        {/* Differentiator groups */}
        {groups.map((group, gi) => (
          <div key={group.name} className={styles.group}>
            <motion.div
              className={styles.groupLabel}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15 + gi * 0.1, duration: 0.6 }}
            >
              <span className={styles.groupDot} />
              {group.name}
            </motion.div>

            <div className={styles.grid}>
              {group.items.map((r, i) => (
                <motion.div
                  key={r.title}
                  className={styles.card}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + gi * 0.1 + i * 0.08, duration: 0.65, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                >
                  <div className={styles.cardIcon}>
                    <div className={styles.iconDot} />
                  </div>
                  <h4 className={styles.cardTitle}>{r.title}</h4>
                  <p className={styles.cardBody}>{r.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </section>
  )
}
