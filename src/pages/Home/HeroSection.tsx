import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import styles from './HeroSection.module.css'

const DROP_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

// Cited third-party industry-research benchmarks (owner-approved: sourced
// external research, NOT Antra's own metrics — keep the attributions).
const IMPACT_STATS = [
  { figure: '25–35%', caption: 'Improvement in project delivery efficiency',            source: 'McKinsey Global Institute' },
  { figure: '2×',     caption: 'Higher leadership retention post-transformation',        source: 'Deloitte Human Capital' },
  { figure: '12%',    caption: 'Reduction in rework hours via better communication',     source: 'McKinsey' },
  { figure: '3–5×',   caption: 'Return on transformation investment over 5 years',       source: 'Industry research' },
]

export function HeroSection() {
  const navigate = useNavigate()

  // ── Draggable 3D cube — cursor grabs and spins it; a tap navigates ──
  const cubeRX = useMotionValue(-16)   // tilt (up/down)
  const cubeRY = useMotionValue(-24)   // spin (left/right)
  const cubeTransform = useMotionTemplate`rotateX(${cubeRX}deg) rotateY(${cubeRY}deg)`
  const dragRef = useRef<{ active: boolean; px: number; py: number; rx: number; ry: number; moved: number }>(
    { active: false, px: 0, py: 0, rx: 0, ry: 0, moved: 0 }
  )
  const [grabbing, setGrabbing] = useState(false)
  const [cubeHover, setCubeHover] = useState(false)

  // A tap: the cube links to the Consultancy page's "What Clients Bring Us"
  // section (its 6 faces are the same 6 problems listed there). Dragging still
  // spins it — we only navigate if the pointer barely moved.
  const CLICK_DRAG_THRESHOLD = 6

  const onCubePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    dragRef.current = { active: true, px: e.clientX, py: e.clientY, rx: cubeRX.get(), ry: cubeRY.get(), moved: 0 }
    setGrabbing(true)
  }, [cubeRX, cubeRY])

  const onCubePointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d.active) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    d.moved = Math.max(d.moved, Math.hypot(dx, dy))
    cubeRY.set(d.ry + dx * 0.5)
    cubeRX.set(Math.max(-75, Math.min(75, d.rx - dy * 0.5)))
  }, [cubeRX, cubeRY])

  const onCubePointerUp = useCallback((e: React.PointerEvent) => {
    const wasClick = dragRef.current.active && dragRef.current.moved < CLICK_DRAG_THRESHOLD
    dragRef.current.active = false
    setGrabbing(false)
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch { /* noop */ }
    if (wasClick) navigate('/consultancy#what-clients-bring-us')
  }, [navigate])

  // Auto-rotate loop — spins continuously when idle, pauses while dragging,
  // and eases the tilt back to rest after you let go.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (!dragRef.current.active) {
        cubeRY.set(cubeRY.get() + 0.2)
        const rx = cubeRX.get()
        cubeRX.set(rx + (-16 - rx) * 0.03)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cubeRX, cubeRY])

  return (
    <section className={styles.hero} data-theme-reset>

      <video
        className={styles.video}
        src="/assets/home%20assets/hero-video.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Darkening overlay for text legibility */}
      <div className={styles.overlay} aria-hidden="true" />

      {/* Top fade — blends video into the navbar */}
      <div className={styles.topNavFade} aria-hidden="true" />

      {/* Bottom seam fade — melts the hero into the next section's navy */}
      <div className={styles.seamFade} aria-hidden="true" />

      {/* ══ 3D draggable glass cube — left side ══ */}
      <div className={styles.infoPanel}>
        <div className={styles.cubeStage}>
          <motion.div
            className={styles.cubeScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.2, ease: DROP_EASE }}
          >
            {/* Floor reflection glow */}
            <div className={styles.cubeGlow} />

            {/* Drag surface — captures pointer, spins the cube; a tap navigates */}
            <div
              className={`${styles.cubeGrab} ${grabbing ? styles.cubeGrabbing : ''}`}
              onPointerDown={onCubePointerDown}
              onPointerMove={onCubePointerMove}
              onPointerUp={onCubePointerUp}
              onPointerCancel={onCubePointerUp}
              onPointerEnter={() => setCubeHover(true)}
              onPointerLeave={() => setCubeHover(false)}
              role="link"
              tabIndex={0}
              aria-label="Go to Consultancy — What Clients Bring Us"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  navigate('/consultancy#what-clients-bring-us')
                }
              }}
            />

            {/* Hover hint — reveals where the cube leads */}
            <motion.div
              className={styles.cubeHint}
              initial={false}
              animate={{ opacity: cubeHover ? 1 : 0, y: cubeHover ? 0 : 6 }}
              transition={{ duration: 0.25, ease: DROP_EASE }}
            >
              <span className={styles.cubeHintNum}>03</span>
              <span className={styles.cubeHintText}>What Clients Bring Us</span>
              <span className={styles.cubeHintArrow}>→</span>
            </motion.div>

            {/* The cube — rotation driven by cursor drag */}
            <motion.div className={styles.cube} style={{ transform: cubeTransform }}>
              <div className={`${styles.face} ${styles.faceFront} ${styles.facePrimary}`}>
                <span className={styles.faceTag}>01</span>
                <span className={styles.faceTitle}>Organizational restructuring that needs to land without breaking the business.</span>
                <span className={styles.faceDot} />
              </div>

              <div className={`${styles.face} ${styles.faceRight}`}>
                <span className={styles.faceTag}>02</span>
                <span className={styles.faceTitle}>A leadership pipeline that is thinner than it should be.</span>
              </div>

              <div className={`${styles.face} ${styles.faceBack}`}>
                <span className={styles.faceTag}>03</span>
                <span className={styles.faceTitle}>Difficulty attracting, retaining, or developing the right talent.</span>
              </div>

              <div className={`${styles.face} ${styles.faceLeft}`}>
                <span className={styles.faceTag}>04</span>
                <span className={styles.faceTitle}>Inconsistent culture or low engagement across teams.</span>
              </div>

              <div className={`${styles.face} ${styles.faceTop}`}>
                <span className={styles.faceTag}>05</span>
                <span className={styles.faceTitle}>Compliance, governance, or risk gaps surfacing as the business scales.</span>
              </div>

              <div className={`${styles.face} ${styles.faceBottom}`}>
                <span className={styles.faceTag}>06</span>
                <span className={styles.faceTitle}>Rapid growth outrunning the systems and structure that were supposed to support it.</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Floating credential chips — orbit the cube */}
          <motion.div
            className={`${styles.chip} ${styles.chip1}`}
            initial={{ opacity: 0, y: 18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.1, duration: 0.9, ease: DROP_EASE }}
          >
            <span className={styles.chipDot} />
            <span className={styles.chipLabel}>Challenges</span>
          </motion.div>

          <motion.div
            className={`${styles.chip} ${styles.chip2}`}
            initial={{ opacity: 0, y: 18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.35, duration: 0.9, ease: DROP_EASE }}
          >
            <span className={styles.chipDot} />
            <span className={styles.chipLabel}>we help</span>
          </motion.div>

          <motion.div
            className={`${styles.chip} ${styles.chip3}`}
            initial={{ opacity: 0, y: 18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.6, duration: 0.9, ease: DROP_EASE }}
          >
            <span className={styles.chipDot} />
            <span className={styles.chipLabel}>you solve</span>
          </motion.div>
        </div>
      </div>

      {/* ══ Text content — right side ══ */}
      <div className={styles.content}>
        <div className={styles.textCol}>
          <div className={styles.textStack}>

            <div className={styles.groupHero}>
              <motion.div
                className={styles.eyebrowRow}
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 1.05, ease: DROP_EASE }}
              >
                <span className={styles.eyebrowDot} />
                <span className={styles.eyebrow}>Addis Ababa · Ethiopia</span>
              </motion.div>

              <h1 className={styles.headline}>
                <motion.span
                  className={styles.headlineLine}
                  initial={{ opacity: 0, y: -34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 1.05, ease: DROP_EASE }}
                >
                  Enabling
                </motion.span>
                <motion.span
                  className={styles.headlineLine}
                  initial={{ opacity: 0, y: -34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.62, duration: 1.05, ease: DROP_EASE }}
                >
                  Growth&nbsp;&amp;
                </motion.span>
                <motion.span
                  className={`${styles.headlineLine} ${styles.headlineAccent}`}
                  initial={{ opacity: 0, y: -34 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.74, duration: 1.15, ease: DROP_EASE }}
                >
                  Transformation<span className={styles.headlinePeriod}>.</span>
                </motion.span>
              </h1>
            </div>

            <motion.div
              className={styles.groupSub}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.9, ease: DROP_EASE }}
            >
              <p className={styles.subhead}>
                We bring proven practices, deep cross-industry knowledge, and global
                expertise to support and drive organizational transformation —
                backed by more than <strong>20 years</strong> of corporate experience
                and a proven track record of excellence.
              </p>

              <div className={styles.actions}>
                <Link to="/contact" className={styles.btnPrimary}>
                  <span>Start a conversation</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
                <Link to="/consultancy" className={styles.btnGhost}>
                  <span>See what we do</span>
                </Link>
              </div>
            </motion.div>

          </div>
        </div>
      </div>

      {/* ══ Impact stat band — cited industry benchmarks, anchors the bottom ══ */}
      <motion.div
        className={styles.statBand}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.35, duration: 0.9, ease: DROP_EASE }}
      >
        <span className={styles.statBandLabel}>Why structured transformation pays off · industry benchmarks</span>
        <div className={styles.statBandGrid}>
          {IMPACT_STATS.map((stat) => (
            <div key={stat.caption} className={styles.statItem}>
              <span className={styles.statFigure}>{stat.figure}</span>
              <span className={styles.statCaption}>{stat.caption}</span>
              <span className={styles.statSource}>{stat.source}</span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  )
}
