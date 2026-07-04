import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './WhatWeDoSection.module.css'

const ease = [0.4, 0, 0.2, 1] as [number, number, number, number]

// SVG coordinate space: 520 × 420 (preserveAspectRatio="none" → matches container %)
// Source node: (36, 210) — vertically centered on left
// Branch fork:  (110, 210)
// Consultancy endpoint: (178, 108) — left-center of consultancy card
// Trading endpoint:     (162, 308) — left-center of trading card
const PATHS = {
  stem:  'M 36 210 L 110 210',
  upper: 'M 110 210 C 152 210 152 108 178 108',
  lower: 'M 110 210 C 152 210 152 308 162 308',
}

export function WhatWeDoSection() {
  const sectionRef  = useRef<HTMLElement>(null)
  const isInView    = useInView(sectionRef, { once: true, margin: '-80px' })
  const [dots, setDots] = useState(false)

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        {/* ══════════════════════════════════════════
            LEFT — branching path + glass cards
        ══════════════════════════════════════════ */}
        <div className={styles.visual} aria-hidden="true">

          {/* SVG: paths + nodes */}
          <svg
            className={styles.svg}
            viewBox="0 0 520 420"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <filter id="wd-glow-dot">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="wd-glow-path">
                <feGaussianBlur stdDeviation="2" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Dim ghost lines (always visible as layout hint) */}
            <path d={PATHS.stem}  stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d={PATHS.upper} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
            <path d={PATHS.lower} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

            {/* Animated draw — stem */}
            <motion.path
              d={PATHS.stem}
              stroke="#D97911"
              strokeWidth="1.5"
              filter="url(#wd-glow-path)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
            />

            {/* Animated draw — upper branch (Consultancy) */}
            <motion.path
              id="wd-upper"
              d={PATHS.upper}
              stroke="#D97911"
              strokeWidth="1.5"
              filter="url(#wd-glow-path)"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{ duration: 0.55, delay: 0.55, ease: 'easeOut' }}
            />

            {/* Animated draw — lower branch (Trading) */}
            <motion.path
              id="wd-lower"
              d={PATHS.lower}
              stroke="#D97911"
              strokeWidth="1.5"
              filter="url(#wd-glow-path)"
              opacity="0.55"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.55 } : {}}
              transition={{ duration: 0.55, delay: 0.6, ease: 'easeOut' }}
              onAnimationComplete={() => setDots(true)}
            />

            {/* Source node — pulsing origin dot */}
            <motion.circle cx="36" cy="210" r="7" fill="#D97911"
              filter="url(#wd-glow-dot)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.3, delay: 0.08 }}
            />
            {/* Pulse ring */}
            <motion.circle cx="36" cy="210" r="16" fill="none"
              stroke="#D97911" strokeWidth="1"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={isInView ? { scale: [0.4, 1.6, 1.6], opacity: [0, 0.35, 0] } : {}}
              transition={{ duration: 1.8, delay: 0.5, repeat: Infinity, repeatDelay: 1.2 }}
            />

            {/* Fork node */}
            <motion.circle cx="110" cy="210" r="4.5" fill="#0B2135"
              stroke="#D97911" strokeWidth="1.5"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.2, delay: 0.58 }}
            />

            {/* Endpoint dot — Consultancy */}
            <motion.circle cx="178" cy="108" r="5" fill="#D97911"
              filter="url(#wd-glow-dot)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.25, delay: 1.1 }}
            />
            {/* Endpoint dot — Trading */}
            <motion.circle cx="162" cy="308" r="3.5" fill="#D97911"
              filter="url(#wd-glow-dot)"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 0.65 } : {}}
              transition={{ duration: 0.25, delay: 1.15 }}
            />

            {/* Traveling dots — only after paths are drawn */}
            {dots && (
              <>
                {/* Consultancy branch — brighter, faster */}
                <circle r="4" fill="#FFB347" filter="url(#wd-glow-dot)">
                  <animateMotion dur="2.2s" repeatCount="indefinite" begin="0s"
                    calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1">
                    <mpath href="#wd-upper" />
                  </animateMotion>
                </circle>
                {/* Trading branch — dimmer, slower */}
                <circle r="2.8" fill="#D97911" filter="url(#wd-glow-dot)" opacity="0.7">
                  <animateMotion dur="3.1s" repeatCount="indefinite" begin="1.1s"
                    calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.6 1">
                    <mpath href="#wd-lower" />
                  </animateMotion>
                </circle>
              </>
            )}
          </svg>

          {/* ── Consultancy card — MAIN / PROMINENT ── */}
          {/* Positioned at left=34.2% top=5% matching SVG endpoint (178,108) = card center-left */}
          <motion.div
            className={`${styles.card} ${styles.cardMain}`}
            initial={{ opacity: 0, x: 24, y: -8 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 1.0, ease }}
          >
            {/* Floating bob animation wrapper */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className={styles.cardNumRow}>
                <span className={styles.cardNum}>01</span>
                <span className={styles.cardBadge}>Primary Practice</span>
              </div>
              <h3 className={styles.cardTitle}>Management<br />Consultancy</h3>
              <p className={styles.cardDesc}>Leadership, strategy, and people solutions.</p>
              <div className={styles.cardTags}>
                <span>Leadership Dev</span>
                <span>Talent Search</span>
                <span>Coaching</span>
                <span>Org. Transformation</span>
              </div>
              <Link to="/consultancy" className={styles.cardCta}>
                Explore
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* ── Trading card — SECONDARY ── */}
          {/* Positioned at left=31.2% top=59% matching SVG endpoint (162,308) = card center-left */}
          <motion.div
            className={`${styles.card} ${styles.cardSub}`}
            initial={{ opacity: 0, x: 24, y: 8 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 1.15, ease }}
          >
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            >
              <div className={styles.cardNumRow}>
                <span className={styles.cardNumSub}>02</span>
              </div>
              <h3 className={styles.cardTitleSub}>Trading &amp; Supply</h3>
              <p className={styles.cardDescSub}>Equipment sourcing via Djibouti Freezone.</p>
              <Link to="/trading" className={styles.cardCtaSub}>
                Explore →
              </Link>
            </motion.div>
          </motion.div>

        </div>

        {/* ══════════════════════════════════════════
            RIGHT — text content
        ══════════════════════════════════════════ */}
        <div className={styles.textCol}>

          <motion.div
            className={styles.label}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease }}
          >
            <span className={styles.labelDot} />
            <span className={styles.labelText}>WHAT WE DO</span>
          </motion.div>

          <motion.h2
            className={styles.heading}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.2, ease }}
          >
            Two practices.<br />One partner.
          </motion.h2>

          <motion.div
            className={styles.body}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35, ease }}
          >
            <p>
              Antra runs two practices that often serve the same kind of client.
              Our consultancy team provides leadership development programs,
              trainings, talent search and assessments, consultancy, coaching
              and mentorship, and organizational transformation.
            </p>
            <p>
              Our trading division supplies the same kinds of organizations with
              equipment they cannot easily source inside Ethiopia, from electric
              vehicles to medical equipment, through our operations in the
              Djibouti Freezone.
            </p>
          </motion.div>

          <motion.div
            className={styles.accentLine}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.55, duration: 0.7, ease }}
          />

        </div>

      </div>
    </section>
  )
}
