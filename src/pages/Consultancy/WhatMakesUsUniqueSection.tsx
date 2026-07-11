import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WhatMakesUsUniqueSection.module.css'

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number]

const iconProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const differentiators = [
  {
    title: 'Practical, Strategic and Business-Driven Expertise',
    icon: (
      // Target — precision and strategic focus
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: 'BHR-led Organization Transformation',
    icon: (
      // Refresh arrows — change and transformation
      <svg {...iconProps}>
        <path d="M20 11a8 8 0 0 0-14.6-4.6M4 13a8 8 0 0 0 14.6 4.6" />
        <polyline points="4.5 4.5 5.4 6.4 3.5 7.3" />
        <polyline points="19.5 19.5 18.6 17.6 20.5 16.7" />
      </svg>
    ),
  },
  {
    title: 'Africa-focused and Market relevant solutions',
    icon: (
      // Map pin — regional / market focus
      <svg {...iconProps}>
        <path d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    ),
  },
  {
    title: 'Partnership-based approach',
    icon: (
      // Linked chain — partnership / working together
      <svg {...iconProps}>
        <path d="M14 7h2.5a4.5 4.5 0 0 1 0 9H14" />
        <path d="M10 16H7.5a4.5 4.5 0 0 1 0-9H10" />
        <line x1="8.5" y1="11.5" x2="15.5" y2="11.5" />
      </svg>
    ),
  },
  {
    title: 'End-to-end support',
    icon: (
      // Layers — full lifecycle, start to finish
      <svg {...iconProps}>
        <polygon points="12 3 3 8 12 13 21 8 12 3" />
        <polyline points="3 15 12 20 21 15" />
        <polyline points="3 11.5 12 16.5 21 11.5" />
      </svg>
    ),
  },
]

export function WhatMakesUsUniqueSection() {
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
          {differentiators.map((d, i) => (
            <motion.div
              key={d.title}
              className={styles.card}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.1, duration: 0.65, ease: EASE }}
            >
              <div className={styles.cardIcon}>{d.icon}</div>
              <p className={styles.cardTitle}>{d.title}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
