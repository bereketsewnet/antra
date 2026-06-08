import { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styles from './HeroSection.module.css'

const STATS = [
  { value: 2006, suffix: '',  label: 'Founded in Addis Ababa' },
  { value: 18,   suffix: '+', label: 'Years of Experience' },
  { value: 2,    suffix: '',  label: 'Integrated Practices' },
  { value: 1,    suffix: '',  label: 'Business Day Response' },
]

const PILLS = [
  {
    src: '/assets/home%20assets/carasuol3.webp',
    alt: 'Global trading and logistics',
    cls: styles.pillLeft,
    pos: 'center center',
  },
  {
    src: '/assets/home%20assets/carasuol2.webp',
    alt: 'Strategy and team collaboration',
    cls: styles.pillCenter,
    pos: 'center 30%',
  },
  {
    src: '/assets/home%20assets/carasuol1.webp',
    alt: 'Leadership and consultancy',
    cls: styles.pillRight,
    pos: 'center 15%',
  },
]

export function HeroSection() {
  const statsRef  = useRef<HTMLDivElement>(null)
  const countEls  = useRef<(HTMLSpanElement | null)[]>([])
  const [activeIdx, setActiveIdx] = useState(1)   // center pill starts active
  const [paused, setPaused]       = useState(false)

  // Auto-cycle: center image (idx 1) stays 2x longer than side images
  useEffect(() => {
    if (paused) return
    const delay = activeIdx === 1 ? 6000 : 3000
    const id = setTimeout(() => setActiveIdx(i => (i + 1) % 3), delay)
    return () => clearTimeout(id)
  }, [paused, activeIdx])

  useEffect(() => {
    const container = statsRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        STATS.forEach((stat, i) => {
          const span = countEls.current[i]
          if (!span) return
          const started = performance.now()
          const tick = (now: number) => {
            const p      = Math.min((now - started) / 1400, 1)
            const eased  = 1 - (1 - p) ** 3
            span.textContent = String(Math.round(eased * stat.value))
            if (p < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.container}>

        {/* ── Left: text content ── */}
        <div className={styles.content}>

          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
          >
            Addis Ababa · Ethiopia
          </motion.span>

          <motion.h1
            className={styles.headline}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.65 }}
          >
            Enabling Growth <br />
            and{' '}
            <span className={styles.highlight}>
              Transformation
              <svg
                className={styles.svgUnderline}
                viewBox="0 0 200 15"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M5,10 Q100,0 195,10"
                  fill="none"
                  stroke="#D97911"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            className={styles.subhead}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            We are a management consultancy and a trading company based in Addis Ababa.
            Companies and institutions across Ethiopia work with us when they need to
            rebuild a leadership bench, sharpen how the business runs, or source
            equipment that is hard to find locally.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6 }}
          >
            <a href="/contact" className={styles.btnPrimary}>Start a conversation</a>
            <a href="/consultancy" className={styles.btnDemo}>
              <span className={styles.demoIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" />
                  <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                </svg>
              </span>
              See what we do
            </a>
          </motion.div>

          <motion.div
            ref={statsRef}
            className={styles.statsRow}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.72, duration: 0.6 }}
          >
            {STATS.map((stat, i) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statTop}>
                  <h3>
                    <span ref={el => { countEls.current[i] = el }}>{stat.value}</span>
                    {stat.suffix}
                  </h3>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <p>{stat.label}</p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* ── Right: overlapping pill images ── */}
        <motion.div
          className={styles.visuals}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          {PILLS.map((pill, i) => (
            <div
              key={pill.alt}
              className={`${styles.pill} ${pill.cls} ${i === activeIdx ? styles.pillActive : ''}`}
              onMouseEnter={() => { setPaused(true); setActiveIdx(i) }}
              onMouseLeave={() => setPaused(false)}
            >
              <img src={pill.src} alt={pill.alt} loading="eager" style={{ objectPosition: pill.pos }} />
            </div>
          ))}
          <div className={styles.carouselDots}>
            {PILLS.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === activeIdx ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  )
}
