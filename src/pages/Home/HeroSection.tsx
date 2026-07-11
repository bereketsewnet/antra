import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import styles from './HeroSection.module.css'

// Optimized hero frames — 60 evenly-sampled frames, 1280x720, ~1.1MB total.
// (Downscaled/recompressed from the original 120x1920x1080 set via
//  scripts/optimize-hero-frames.mjs)
const TOTAL_FRAMES = 60
const CRITICAL_FRAMES = 6   // paint the hero as soon as these decode
const FRAME_URL = (n: number) =>
  `/assets/hero-frames/frame-${String(n).padStart(3, '0')}.webp`

const DROP_EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  angle: number       // personal drift angle — slowly wanders for natural motion
  angleSpeed: number  // how fast this particle's angle rotates
}

export function HeroSection() {
  const navigate = useNavigate()
  const sectionRef        = useRef<HTMLElement>(null)
  const stickyRef         = useRef<HTMLDivElement>(null)
  const canvasRef         = useRef<HTMLCanvasElement>(null)
  const particleCanvasRef = useRef<HTMLCanvasElement>(null)
  const spotRef           = useRef<HTMLDivElement>(null)
  const framesRef         = useRef<HTMLImageElement[]>([])
  const currentIdx        = useRef(-1)
  const particlesRef      = useRef<Particle[]>([])
  const mouseRef          = useRef<{ x: number; y: number; active: boolean }>({ x: -9999, y: -9999, active: false })
  const [ready, setReady] = useState(false)

  // ── Single scroll-progress motion value — shared by frames and text ──
  const progressMV = useMotionValue(0)

  // Group 1 (eyebrow + headline) — recedes as the shards start forming
  const heroOpacity = useTransform(progressMV, [0, 0.05, 0.28], [1, 1, 0])
  const heroY       = useTransform(progressMV, [0, 0.28], [0, -90])
  const heroScale   = useTransform(progressMV, [0, 0.28], [1, 0.7])
  const heroBlurN   = useTransform(progressMV, [0, 0.28], [0, 12])
  const heroFilter  = useMotionTemplate`blur(${heroBlurN}px)`

  // Group 2 (subhead + CTAs) — drops in at ~50% of hero fade
  const subOpacity  = useTransform(progressMV, [0.16, 0.42], [0, 1])
  const subY        = useTransform(progressMV, [0.16, 0.42], [-80, 0])
  const subScale    = useTransform(progressMV, [0.16, 0.42], [0.9, 1])

  // Scroll cue fades out quickly
  const cueOpacity  = useTransform(progressMV, [0, 0.06], [1, 0])

  // Left info cards — visible on load, disappear as scroll begins
  const infoOpacity = useTransform(progressMV, [0, 0.14], [1, 0])
  const infoY       = useTransform(progressMV, [0, 0.14], [0, -55])

  // ── Draggable 3D cube — cursor grabs and spins it, no auto-flip ──
  const cubeRX = useMotionValue(-16)   // tilt (up/down)
  const cubeRY = useMotionValue(-24)   // spin (left/right)
  const cubeTransform = useMotionTemplate`rotateX(${cubeRX}deg) rotateY(${cubeRY}deg)`
  const dragRef = useRef<{ active: boolean; px: number; py: number; rx: number; ry: number; moved: number }>(
    { active: false, px: 0, py: 0, rx: 0, ry: 0, moved: 0 }
  )
  const [grabbing, setGrabbing] = useState(false)
  const [cubeHover, setCubeHover] = useState(false)

  // A tap: the cube is a link to the Consultancy page's "What Clients Bring
  // Us" section (its 6 faces are the same 6 problems listed there). Dragging
  // still spins it — we only navigate if the pointer barely moved.
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
    // clamp vertical tilt so it never flips fully over
    cubeRX.set(Math.max(-75, Math.min(75, d.rx - dy * 0.5)))
  }, [cubeRX, cubeRY])

  const onCubePointerUp = useCallback((e: React.PointerEvent) => {
    const wasClick = dragRef.current.active && dragRef.current.moved < CLICK_DRAG_THRESHOLD
    dragRef.current.active = false
    setGrabbing(false)
    try { (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId) } catch { /* noop */ }
    if (wasClick) navigate('/consultancy#what-clients-bring-us')
  }, [navigate])

  // Auto-rotate loop — spins continuously when idle, pauses while you drag,
  // and eases the tilt back to rest after you let go.
  useEffect(() => {
    let raf = 0
    const tick = () => {
      if (!dragRef.current.active) {
        cubeRY.set(cubeRY.get() + 0.2)                 // continuous spin
        const rx = cubeRX.get()
        cubeRX.set(rx + (-16 - rx) * 0.03)             // drift tilt back to rest
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cubeRX, cubeRY])

  // ── Fit + draw a single frame to the canvas with cover-fit ──
  const drawFrame = useCallback((idx: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return
    const img = framesRef.current[idx]
    if (!img || !img.complete || img.naturalWidth === 0) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const imgAR    = img.naturalWidth / img.naturalHeight
    const canvasAR = w / h
    let sw, sh, sx, sy
    if (imgAR > canvasAR) {
      sh = img.naturalHeight
      sw = sh * canvasAR
      sx = (img.naturalWidth - sw) / 2
      sy = 0
    } else {
      sw = img.naturalWidth
      sh = sw / canvasAR
      sx = 0
      sy = (img.naturalHeight - sh) / 2
    }
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h)
  }, [])

  // ── Preload frames — critical frames first & high-priority, rest stream in ──
  // The very first frames are also <link rel=preload> in index.html, so they
  // begin downloading before this bundle even executes.
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES)
    let criticalDecoded = 0
    let done = false

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      // Prioritise the frames needed for first paint; de-prioritise the tail.
      img.setAttribute('fetchpriority', i < CRITICAL_FRAMES ? 'high' : 'low')
      img.onload = () => {
        if (i < CRITICAL_FRAMES && !done) {
          criticalDecoded++
          if (criticalDecoded >= CRITICAL_FRAMES) {
            done = true
            setReady(true)
            drawFrame(0)
          }
        }
      }
      img.src = FRAME_URL(i + 1)
      images[i] = img
    }
    framesRef.current = images
  }, [drawFrame])

  // ── Scroll → smoothed frame scrub ──
  // Scroll only updates a target; a continuous rAF loop eases the drawn frame
  // toward it, so fast scrolls glide instead of snapping frame-to-frame.
  useEffect(() => {
    const section = sectionRef.current
    const sticky  = stickyRef.current
    if (!section || !sticky) return

    const computeTarget = () => {
      const rect        = section.getBoundingClientRect()
      const totalScroll = section.offsetHeight - sticky.offsetHeight
      const distance    = Math.max(0, -rect.top)
      return totalScroll > 0 ? Math.min(1, distance / totalScroll) : 0
    }

    let target  = computeTarget()
    let current = target
    let raf     = 0

    const onScroll = () => { target = computeTarget() }

    const tick = () => {
      // Ease current toward target — smaller factor = smoother/softer
      current += (target - current) * 0.16
      if (Math.abs(target - current) < 0.0002) current = target

      progressMV.set(current)

      const idx = Math.min(TOTAL_FRAMES - 1, Math.round(current * (TOTAL_FRAMES - 1)))
      if (idx !== currentIdx.current) {
        currentIdx.current = idx
        drawFrame(idx)
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [progressMV, drawFrame])

  // ── Autonomous floating dust — tiny particles drift smoothly across the hero ──
  useEffect(() => {
    const canvas = particleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const PARTICLE_COUNT = 90
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      canvas.width  = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const spawn = (w: number, h: number, fromBottom = false): Particle => {
      // Spawn either scattered across canvas (initial) or along bottom edge (respawn)
      const x = Math.random() * w
      const y = fromBottom ? h + 10 : Math.random() * h
      // Drift angle: generally upward (π/2 range) with some horizontal spread
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
      const speed = 0.18 + Math.random() * 0.28
      return {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 0.6 + Math.random() * 1.6,     // tiny — fine dust
        life: fromBottom ? 0 : Math.random() * 6000,  // stagger initial ages
        maxLife: 8000 + Math.random() * 7000,
        angle,
        angleSpeed: (Math.random() - 0.5) * 0.0008,   // very slow personal wander
      }
    }

    particlesRef.current = Array.from(
      { length: PARTICLE_COUNT },
      () => spawn(canvas.clientWidth, canvas.clientHeight, false),
    )

    let raf: number | null = null
    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50)
      last = now
      const w = canvas.clientWidth
      const h = canvas.clientHeight

      ctx.clearRect(0, 0, w, h)

      for (const p of particlesRef.current) {
        // Slowly rotate personal drift angle — creates natural wandering path
        p.angle += p.angleSpeed * (dt / 16.67)

        // Apply flow force in the personal direction (very gentle autonomous drift)
        p.vx += Math.cos(p.angle) * 0.004 * (dt / 16.67)
        p.vy += Math.sin(p.angle) * 0.004 * (dt / 16.67)

        // Magnet cursor attraction — pulls nearby dust toward cursor like a magnet
        if (mouseRef.current.active) {
          const dx     = mouseRef.current.x - p.x
          const dy     = mouseRef.current.y - p.y
          const distSq = dx * dx + dy * dy
          const R      = 280
          if (distSq < R * R) {
            const dist  = Math.sqrt(distSq) || 0.001
            const force = (1 - dist / R) * 0.18
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
          }
        }

        // Cap speed — slightly higher cap when cursor is active so magnet feels snappy
        const maxSpeed = mouseRef.current.active ? 1.8 : 0.45
        const speed    = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed
          p.vy = (p.vy / speed) * maxSpeed
        }

        p.x   += p.vx * (dt / 16.67)
        p.y   += p.vy * (dt / 16.67)
        p.life += dt

        // Respawn from bottom when a particle leaves or expires
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20 || p.life > p.maxLife) {
          Object.assign(p, spawn(w, h, true))
        }

        // Smooth fade in / fade out
        const fadeIn  = Math.min(1, p.life / 1200)
        const fadeOut = Math.min(1, (p.maxLife - p.life) / 2000)
        const alpha   = Math.min(fadeIn, fadeOut) * 0.58

        // Tiny radial gradient — fine dust glow
        const r = p.size * 3.5
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        g.addColorStop(0,    `rgba(255, 210, 120, ${alpha})`)
        g.addColorStop(0.4,  `rgba(217, 121, 17,  ${alpha * 0.5})`)
        g.addColorStop(1,    `rgba(217, 121, 17,  0)`)
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ── Track cursor — drives particle magnet + cursor spotlight ──
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const canvas = particleCanvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= canvas.clientWidth && y <= canvas.clientHeight
      mouseRef.current = inside ? { x, y, active: true } : { ...mouseRef.current, active: false }

      // Move the spotlight glow directly (no React re-render — pure DOM)
      if (spotRef.current) {
        spotRef.current.style.transform = `translate(${e.clientX - 350}px, ${e.clientY - 350}px)`
        spotRef.current.style.opacity   = inside ? '1' : '0'
      }
    }
    const onLeave = () => {
      mouseRef.current.active = false
      if (spotRef.current) spotRef.current.style.opacity = '0'
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.hero} data-theme-reset>
      <div ref={stickyRef} className={styles.sticky}>

        {/* Top fade — blends animation seamlessly into the solid navbar */}
        <div className={styles.topNavFade} aria-hidden="true" />

        {/* One-shot diagonal light slash — cinematic entry sweep */}
        <div className={styles.scanSlash} aria-hidden="true" />

        {/* First frame paints instantly (preloaded in index.html) while the
            canvas warms up — prevents a black flash on load. */}
        {!ready && (
          <img
            src={FRAME_URL(1)}
            alt=""
            aria-hidden="true"
            className={styles.fallback}
            fetchPriority="high"
          />
        )}

        <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

        {/* Gradient mesh — corner colour depth */}
        <div className={styles.mesh} aria-hidden="true" />

        {/* God rays — light beams from the shard glow source */}
        <div className={styles.rays} aria-hidden="true">
          <div className={styles.ray1} />
          <div className={styles.ray2} />
          <div className={styles.ray3} />
          <div className={styles.ray4} />
        </div>

        <div className={styles.overlay} />
        <canvas ref={particleCanvasRef} className={styles.particles} aria-hidden="true" />
        <div className={styles.vignette} />

        {/* Cursor spotlight — warm amber radial that follows the mouse */}
        <div ref={spotRef} className={styles.cursorSpot} aria-hidden="true" />

        {/* Sonar pulse rings — expand from the shard glow centre */}
        <div className={styles.pulseRings} aria-hidden="true">
          <div className={`${styles.ring} ${styles.ring1}`} />
          <div className={`${styles.ring} ${styles.ring2}`} />
          <div className={`${styles.ring} ${styles.ring3}`} />
        </div>

        {/* Load bloom — radial burst fires the moment the canvas goes live */}
        {ready && (
          <motion.div
            className={styles.loadBloom}
            initial={{ scale: 0.2, opacity: 0.65 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 1.8, ease: [0.2, 0, 0.3, 1] }}
            aria-hidden="true"
          />
        )}

        {/* Marquee ticker — continuous brand + service words */}
        <div className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {[0, 1].map(n => (
              <span key={n} className={styles.tickerRun}>
                {[
                  'ENABLING GROWTH',
                  'ORGANIZATIONAL TRANSFORMATION',
                  'TRADING & SUPPLY',
                  'DJIBOUTI FREE ZONE',
                  'STRATEGIC TRADE',
                  'ADDIS ABABA · ETHIOPIA',
                  'MANAGEMENT CONSULTANCY',
                ].map(t => (
                  <span key={t} className={styles.tickerItem}>
                    <span className={styles.tickerDot}>◆</span>{t}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom seam fade — melts the hero into the next section's navy */}
        <div className={styles.seamFade} aria-hidden="true" />

        {/* ══ Left floating info cards — fade away on first scroll ══ */}
        <motion.div
          className={styles.infoPanel}
          style={{ opacity: infoOpacity, y: infoY }}
        >

          {/* ══ 3D draggable glass cube ══
              Outer div owns centering; inner div is the perspective + fade layer;
              the cube itself is rotated by cursor drag (no auto-flip). */}
          <div className={styles.cubeStage}>


          <motion.div
            className={styles.cubeScene}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1.2, ease: DROP_EASE }}
          >
            {/* Floor reflection glow */}
            <div className={styles.cubeGlow} />

            {/* Drag surface — captures pointer, spins the cube; a tap (no drag) navigates */}
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
              {/* FRONT */}
              <div className={`${styles.face} ${styles.faceFront} ${styles.facePrimary}`}>
                <span className={styles.faceTag}>01</span>
                <span className={styles.faceTitle}>Organizational restructuring that needs to land without breaking the business.</span>
                <span className={styles.faceDot} />
              </div>

              {/* RIGHT */}
              <div className={`${styles.face} ${styles.faceRight}`}>
                <span className={styles.faceTag}>02</span>
                <span className={styles.faceTitle}>A leadership pipeline that is thinner than it should be.</span>
              </div>

              {/* BACK */}
              <div className={`${styles.face} ${styles.faceBack}`}>
                <span className={styles.faceTag}>03</span>
                <span className={styles.faceTitle}>Difficulty attracting, retaining, or developing the right talent.</span>
              </div>

              {/* LEFT */}
              <div className={`${styles.face} ${styles.faceLeft}`}>
                <span className={styles.faceTag}>04</span>
                <span className={styles.faceTitle}>Inconsistent culture or low engagement across teams.</span>
              </div>

              {/* TOP */}
              <div className={`${styles.face} ${styles.faceTop}`}>
                <span className={styles.faceTag}>05</span>
                <span className={styles.faceTitle}>Compliance, governance, or risk gaps surfacing as the business scales.</span>
              </div>

              {/* BOTTOM */}
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
            transition={{ delay: 1.5, duration: 0.9, ease: DROP_EASE }}
          >
            <span className={styles.chipDot} />
            <span className={styles.chipLabel}>Challenges</span>
          </motion.div>

          <motion.div
            className={`${styles.chip} ${styles.chip2}`}
            initial={{ opacity: 0, y: 18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 1.85, duration: 0.9, ease: DROP_EASE }}
          >
            <span className={styles.chipDot} />
            <span className={styles.chipLabel}>we help</span>
          </motion.div>

          <motion.div
            className={`${styles.chip} ${styles.chip3}`}
            initial={{ opacity: 0, y: 18, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 2.2, duration: 0.9, ease: DROP_EASE }}
          >
            <span className={styles.chipDot} />
            <span className={styles.chipLabel}>you solve</span>
          </motion.div>
          </div>

        </motion.div>

        <div className={styles.content}>
          <div className={styles.textCol}>

            <div className={styles.textStack}>

              {/* ── GROUP 1 — eyebrow + headline (visible initially, recedes on scroll) ── */}
              <motion.div
                className={styles.groupHero}
                style={{
                  opacity: heroOpacity,
                  y:       heroY,
                  scale:   heroScale,
                  filter:  heroFilter,
                }}
              >
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
                    transition={{ delay: 0.55, duration: 1.05, ease: DROP_EASE }}
                  >
                    Enabling
                  </motion.span>
                  <motion.span
                    className={styles.headlineLine}
                    initial={{ opacity: 0, y: -34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 1.05, ease: DROP_EASE }}
                  >
                    Growth&nbsp;&amp;
                  </motion.span>
                  <motion.span
                    className={`${styles.headlineLine} ${styles.headlineAccent}`}
                    initial={{ opacity: 0, y: -34 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.85, duration: 1.15, ease: DROP_EASE }}
                  >
                    Transformation<span className={styles.headlinePeriod}>.</span>
                  </motion.span>
                </h1>
              </motion.div>

              {/* ── GROUP 2 — subhead + CTAs (hidden initially, drops in on scroll) ── */}
              <motion.div
                className={styles.groupSub}
                style={{
                  opacity: subOpacity,
                  y:       subY,
                  scale:   subScale,
                }}
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

          {/* Scroll cue */}
          <motion.div
            className={styles.scrollCue}
            style={{ opacity: cueOpacity }}
          >
            <span className={styles.scrollLabel}>Scroll to align</span>
            <div className={styles.scrollTrack}>
              <motion.div
                className={styles.scrollDot}
                animate={{ y: [0, 26, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
