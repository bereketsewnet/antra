import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLenis } from '@/hooks/useLenis'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '@/styles/globals.css'

function AppInner() {
  const lenisRef = useLenis()
  const location = useLocation()

  // Scroll to top on every route change — or to the #hash target if one is
  // present (lazy pages need a tick to mount before the element exists).
  // `location.key` is in the deps so that re-clicking the SAME hash link
  // (same path + hash) still re-fires: React Router mints a fresh key per
  // navigation, but the pathname/hash values alone wouldn't change.
  useEffect(() => {
    const lenis = lenisRef.current
    const hash = location.hash.slice(1)

    // No hash → scroll to top.
    if (!hash) {
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      else window.scrollTo(0, 0)
      return
    }

    let stopped = false
    const timers: number[] = []

    const scrollToEl = (el: HTMLElement) => {
      if (lenis) {
        lenis.scrollTo(el, { immediate: true, force: true, offset: -90 })
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY - 90
        window.scrollTo(0, y)
      }
    }

    // Scroll now, then re-scroll a few times over the next ~1s. A section deep
    // in a long page keeps sliding down while the sections above it settle
    // (lazy images loading, fonts swapping, in-view animations, the page-enter
    // transition) — a single scroll lands short, so we re-correct until the
    // layout stops moving. This is what made the last section ("Key Suppliers")
    // land in the wrong place most often.
    const scrollAndSettle = (el: HTMLElement) => {
      scrollToEl(el)
      ;[150, 350, 600, 900].forEach((delay) => {
        timers.push(
          window.setTimeout(() => {
            if (!stopped) scrollToEl(el)
          }, delay),
        )
      })
    }

    const existing = document.getElementById(hash)
    if (existing) {
      scrollAndSettle(existing)
      return () => {
        stopped = true
        timers.forEach((t) => window.clearTimeout(t))
      }
    }

    // Target not mounted yet (lazy page + the page-transition exit delay) —
    // poll until it appears, then scroll and settle.
    let attempts = 0
    const maxAttempts = 40 // ~4s at 100ms intervals
    const interval = window.setInterval(() => {
      attempts += 1
      const el = document.getElementById(hash)
      if (el) {
        window.clearInterval(interval)
        scrollAndSettle(el)
      } else if (attempts >= maxAttempts) {
        window.clearInterval(interval)
      }
    }, 100)

    return () => {
      stopped = true
      window.clearInterval(interval)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [location.pathname, location.hash, location.key, lenisRef])

  return (
    <>
      <Navbar />
      <Suspense fallback={null}>
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </Suspense>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
