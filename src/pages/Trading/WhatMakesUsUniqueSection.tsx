import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WhatMakesUsUniqueSection.module.css'

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number]

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const groups = [
  {
    title: 'Distribution and Retail Expertise',
    icon: (
      // Truck — distribution and logistics
      <svg {...iconProps}>
        <rect x="1.5" y="7" width="12" height="9" rx="1" />
        <path d="M13.5 10.5h4l3.5 3v2.5h-7.5z" />
        <circle cx="6" cy="19" r="1.8" />
        <circle cx="17" cy="19" r="1.8" />
      </svg>
    ),
    points: [
      'Distribution capabilities, including Logistics (Cars & Parts) Training & organizational setup ready to operate',
      'Deep knowledge; leading performance via Retail',
      'Price positioning and competitive value offerings',
    ],
  },
  {
    title: 'Brand Building Capability',
    icon: (
      // Trending up — growth and brand building
      <svg {...iconProps}>
        <polyline points="3 17 9 11 13 15 21 7" />
        <polyline points="14 7 21 7 21 14" />
      </svg>
    ),
    points: [
      'Consistent marketing & messaging from start',
      'Aligned to OEM brand building strategy & execution',
      'Prioritized model & Partnership leverage',
      'Immediate investment in marketing channels',
    ],
  },
  {
    title: 'Handling Fleet Customers and Traders',
    icon: (
      // People — customer and trader relationships
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
        <circle cx="17.5" cy="8.5" r="2.4" />
        <path d="M16 14.3c2.6.5 4.2 2.6 4.2 5.7" />
      </svg>
    ),
    points: [
      'Excellent and close cooperation with Fleet customers',
      'Close engagement with both Government and business owners to capture every opportunity',
      'Build trust and confidence of major traders and fleet customers through long history of strong relationship',
    ],
  },
]

export function WhatMakesUsUniqueSection() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} id="what-makes-us-unique" className={styles.section}>
      <div className={styles.container}>

        <motion.div
          className={styles.labelRow}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelDot} />
          <span className={styles.labelText}>What Makes Us Unique</span>
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
        >
          What makes
          <br />
          <span className={styles.headingAccent}>us unique.</span>
        </motion.h2>

        <div className={styles.grid}>
          {groups.map((g, gi) => (
            <motion.div
              key={g.title}
              className={styles.card}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + gi * 0.12, duration: 0.65, ease: EASE }}
            >
              <div className={styles.cardHead}>
                <div className={styles.cardIcon}>{g.icon}</div>
                <h3 className={styles.cardTitle}>{g.title}</h3>
              </div>

              <ul className={styles.cardPoints}>
                {g.points.map((pt) => (
                  <li key={pt} className={styles.cardPoint}>
                    <span className={styles.cardPointDot} />
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
