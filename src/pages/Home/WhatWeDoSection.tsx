import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './WhatWeDoSection.module.css'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  }),
}

const slideRight = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const slideLeft = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

const tiles = [
  {
    label: 'Management Consultancy',
    desc: 'Leadership, strategy, and people solutions.',
    href: '/consultancy',
    number: '01',
  },
  {
    label: 'Trading & Supply',
    desc: 'Equipment sourcing via Djibouti Freezone.',
    href: '/trading',
    number: '02',
  },
]

export function WhatWeDoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const tilesInView = useInView(tilesRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        {/* ── Top row: label + content ── */}
        <div className={styles.topRow}>

          {/* Left: rotated label */}
          <motion.div
            className={styles.labelCol}
            variants={slideRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className={styles.rotatedLabel}>WHAT WE DO</div>
            <div className={styles.labelLine} />
          </motion.div>

          {/* Right: text content */}
          <div className={styles.contentCol}>
            <motion.h2
              className={styles.heading}
              variants={slideLeft}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              Two practices.<br />One partner.
            </motion.h2>

            <motion.div
              className={styles.body}
              variants={fadeUp}
              custom={1}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <p>
                Antra runs two practices that often serve the same kind of client.
                Our consultancy team provides leadership development programs,
                trainings, talent search and assessments, consultancy, coaching
                and mentorship, and organizational transformation.
              </p>
              <p>
                Our trading division supplies the same kinds of organizations
                with equipment they cannot easily source inside Ethiopia, from
                electric vehicles to medical equipment, through our operations
                in the Djibouti Freezone.
              </p>
            </motion.div>

            {/* Orange accent line */}
            <motion.div
              className={styles.accentLine}
              initial={{ scaleX: 0, originX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.5, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            />
          </div>
        </div>

        {/* ── Bottom tiles ── */}
        <div ref={tilesRef} className={styles.tiles}>
          {tiles.map((tile, i) => (
            <motion.a
              key={tile.label}
              href={tile.href}
              className={styles.tile}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              animate={tilesInView ? 'visible' : 'hidden'}
              whileHover="hover"
            >
              <motion.div
                className={styles.tileInner}
                variants={{
                  hover: { y: -4, transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
                }}
              >
                <div className={styles.tileTop}>
                  <span className={styles.tileNumber}>{tile.number}</span>
                  <motion.div
                    className={styles.tileArrow}
                    variants={{
                      hover: { x: 4, opacity: 1, transition: { duration: 0.2 } },
                    }}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
                <h3 className={styles.tileLabel}>{tile.label}</h3>
                <p className={styles.tileDesc}>{tile.desc}</p>
                <div className={styles.tileBorder} />
              </motion.div>
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  )
}
