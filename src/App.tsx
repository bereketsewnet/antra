import { Suspense, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLenis } from '@/hooks/useLenis'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Preloader } from '@/components/Preloader/Preloader'
import { ThemeProvider } from '@/contexts/ThemeContext'
import '@/styles/globals.css'

function AppInner() {
  const lenisRef = useLenis()
  const location = useLocation()

  // Scroll to top on every route change — or to the #hash target if one is
  // present (lazy pages need a tick to mount before the element exists).
  useEffect(() => {
    const lenis = lenisRef.current
    const hash = location.hash.slice(1)

    if (hash) {
      const scrollToHash = () => {
        const el = document.getElementById(hash)
        if (!el) return false
        if (lenis) {
          lenis.scrollTo(el, { immediate: true, force: true, offset: -90 })
        } else {
          const y = el.getBoundingClientRect().top + window.scrollY - 90
          window.scrollTo(0, y)
        }
        return true
      }
      if (!scrollToHash()) {
        // Lazy-loaded pages can take longer than a single fixed delay to
        // mount (especially pages with many sections) — poll instead of
        // trying once, so the scroll never silently lands at the top.
        let attempts = 0
        const maxAttempts = 30 // ~3s at 100ms intervals
        const interval = window.setInterval(() => {
          attempts += 1
          if (scrollToHash() || attempts >= maxAttempts) {
            window.clearInterval(interval)
          }
        }, 100)
        return () => window.clearInterval(interval)
      }
      return
    }

    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [location.pathname, location.hash, lenisRef])

  return (
    <>
      <Preloader />
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
