import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import styles from './Preloader.module.css'

/* The hero scroll-scrub animation is driven by 120 sequential webp frames.
   This intro screen preloads them up front so the hero is buttery on first
   scroll — but it NEVER blocks the site: a hard timeout reveals the page no
   matter how slow the connection is, and the frames keep loading in the
   background (and stay cached for the hero). */
const TOTAL_FRAMES = 120
const FRAME_URL = (n: number) =>
  `/assets/hero%203d%20images/ezgif-frame-${String(n).padStart(3, '0')}.webp`

const MAX_WAIT_MS = 6000     // hard cap — open the site regardless of progress
const SLOW_MS = 3500         // after this, surface the "taking longer" note
const MIN_DISPLAY_MS = 700   // avoid an ugly flash when frames are already cached

export function Preloader() {
  // Only run the intro on the first load of a browsing session.
  const alreadyShown =
    typeof sessionStorage !== 'undefined' &&
    sessionStorage.getItem('antra-intro-shown') === '1'

  const [done, setDone] = useState(alreadyShown)
  const [progress, setProgress] = useState(0)
  const [slow, setSlow] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    if (alreadyShown || startedRef.current) return
    startedRef.current = true
    try { sessionStorage.setItem('antra-intro-shown', '1') } catch { /* private mode */ }

    const startedAt = performance.now()
    let loaded = 0
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      const wait = Math.max(0, MIN_DISPLAY_MS - (performance.now() - startedAt))
      window.setTimeout(() => setDone(true), wait)
    }

    const maxTimer = window.setTimeout(finish, MAX_WAIT_MS)   // fallback reveal
    const slowTimer = window.setTimeout(() => setSlow(true), SLOW_MS)

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image()
      img.decoding = 'async'
      const tick = () => {
        loaded++
        setProgress(Math.round((loaded / TOTAL_FRAMES) * 100))
        if (loaded >= TOTAL_FRAMES) finish()
      }
      img.onload = tick
      img.onerror = tick      // count failures too, so one bad frame can't hang it
      img.src = FRAME_URL(i)
    }

    return () => {
      window.clearTimeout(maxTimer)
      window.clearTimeout(slowTimer)
    }
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
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className={styles.center}>
            <div className={styles.logoWrap}>
              <img
                src="/assets/global/Antra-Dark.svg"
                alt="Antra Business Group"
                className={styles.logo}
              />
              <span className={styles.ring} />
            </div>

            <div className={styles.barTrack}>
              <div className={styles.barFill} style={{ width: `${progress}%` }} />
            </div>
            <div className={styles.pct}>{progress}%</div>

            <AnimatePresence mode="wait">
              <motion.p
                key={slow ? 'slow' : 'normal'}
                className={styles.msg}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
              >
                {slow
                  ? 'This is taking a little longer than usual — it works best on a stable connection. Hang tight, or reload the page if it stalls.'
                  : 'Preparing your experience…'}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
