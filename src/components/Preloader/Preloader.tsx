import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Preloader.module.css'

/* Fast 3D intro screen.
   Gates ONLY on the first few hero frames (~150KB) — never the full set —
   and a hard timeout opens the site regardless of connection speed.
   The remaining frames keep streaming in behind the page. */
const TOTAL_FRAMES = 60
const CRITICAL_FRAMES = 6    // reveal as soon as these tiny frames are ready
const FRAME_URL = (n: number) =>
  `/assets/hero-frames/frame-${String(n).padStart(3, '0')}.webp`

const MAX_WAIT_MS = 2500     // hard cap — open the site no matter what
const MIN_DISPLAY_MS = 1100  // let the cube animation be seen (still quick)

export function Preloader() {
  // Only run the intro on the first load of a browsing session.
  const alreadyShown =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('antra-intro-shown') === '1'

  const [done, setDone] = useState(alreadyShown)
  const [progress, setProgress] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (alreadyShown || startedRef.current) return
    startedRef.current = true
    try { sessionStorage.setItem('antra-intro-shown', '1') } catch { /* private mode */ }

    const startedAt = performance.now()
    let criticalLoaded = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      setProgress(100)
      const wait = Math.max(0, MIN_DISPLAY_MS - (performance.now() - startedAt))
      window.setTimeout(() => setDone(true), wait)
    }

    const maxTimer = window.setTimeout(finish, MAX_WAIT_MS)   // fallback reveal

    // Fire all frame requests to warm the cache, but only *gate the reveal*
    // on the first CRITICAL_FRAMES — that's all the hero needs to paint.
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      if (i <= CRITICAL_FRAMES) img.setAttribute('fetchpriority', 'high')
      const tick = () => {
        if (i <= CRITICAL_FRAMES && !finished) {
          criticalLoaded++
          setProgress(Math.round((criticalLoaded / CRITICAL_FRAMES) * 100))
          if (criticalLoaded >= CRITICAL_FRAMES) finish()
        }
      }
      img.onload = tick
      img.onerror = tick      // count failures too, so one bad frame can't hang it
      img.src = FRAME_URL(i)
    }

    return () => window.clearTimeout(maxTimer)
  }, [alreadyShown])

  // Lock page scroll while the intro is visible.
  useEffect(() => {
    if (done) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [done])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.screen}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.center}>

            {/* ── 3D spinning cube — echoes the hero cube ── */}
            <div className={styles.stage}>
              <div className={styles.cubeGlow} />
              <div className={styles.cube}>
                <div className={`${styles.face} ${styles.faceFront}`}>A</div>
                <div className={`${styles.face} ${styles.faceBack}`} />
                <div className={`${styles.face} ${styles.faceRight}`} />
                <div className={`${styles.face} ${styles.faceLeft}`} />
                <div className={`${styles.face} ${styles.faceTop}`} />
                <div className={`${styles.face} ${styles.faceBottom}`} />
              </div>
            </div>

            <img
              src="/assets/global/Antra-Dark.svg"
              alt="Antra Business Group"
              className={styles.logo}
            />

            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
