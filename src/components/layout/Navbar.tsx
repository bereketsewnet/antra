import { useEffect, useState, useCallback } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'
import styles from './Navbar.module.css'

const servicePractices = [
  { label: '01 · Organizational Transformation',    to: '/consultancy/practices/org' },
  { label: '02 · Leadership Development Programs',  to: '/consultancy/practices/leadership' },
  { label: '03 · Training on People Management',    to: '/consultancy/practices/people-mgmt' },
  { label: '04 · Talent Search & Assessments',      to: '/consultancy/practices/talent' },
  { label: '05 · Advisory & Change',                to: '/consultancy/practices/advisory' },
  { label: '06 · Coaching & Mentorship',            to: '/consultancy/practices/coaching' },
]

const productLines = [
  { label: '01 · Electric Vehicles',        hash: 'product-ev' },
  { label: '02 · Construction Machineries', hash: 'product-construction' },
  { label: '03 · Sanitary Equipment',       hash: 'product-sanitary' },
  { label: '04 · Medical Equipment',        hash: 'product-medical' },
]

const links = [
  { label: 'Home',        to: '/' },
  {
    label: 'About',
    to: '/about',
    submenu: [
      { label: 'Who We Are',      hash: 'who-we-are' },
      { label: 'Mission',         hash: 'our-mission' },
      { label: 'Core Values',     hash: 'core-values' },
      { label: 'Our Leaders',     hash: 'meet-our-leaders' },
    ],
  },
  {
    label: 'Consultancy',
    to: '/consultancy',
    submenu: [
      { label: 'Services',              hash: 'services', children: servicePractices },
      { label: 'Organizational Strategy', hash: 'organizational-strategy' },
      { label: 'What Makes Us Unique',  hash: 'what-makes-us-unique' },
      { label: 'Survey',                hash: 'surveys' },
    ],
  },
  {
    label: 'Trading',
    to: '/trading',
    submenu: [
      { label: 'Product Lines',            hash: 'product-lines', children: productLines },
      { label: 'Why Buyers Work With Us',  hash: 'why-buyers-work-with-us' },
      { label: 'What Makes Us Unique',     hash: 'what-makes-us-unique' },
      { label: 'Key Suppliers & Brands',    hash: 'suppliers' },
    ],
  },
  { label: 'Careers',     to: '/careers' },
  { label: 'Contact',     to: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [openChildSubmenu, setOpenChildSubmenu] = useState<string | null>(null)
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null)
  const [mobileChildSubmenuOpen, setMobileChildSubmenuOpen] = useState<string | null>(null)
  const location = useLocation()
  const { theme, toggle } = useTheme()

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setOpenSubmenu(null)
    setOpenChildSubmenu(null)
    setMobileSubmenuOpen(null)
    setMobileChildSubmenuOpen(null)
  }, [location])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleMenu = useCallback(() => setMenuOpen(p => !p), [])

  return (
    <>
      <motion.header
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
      >
        <div className={styles.inner}>
          {/* Logo — switches between light and dark variants */}
          <NavLink to="/" className={styles.logo}>
            <img
              src={theme === 'dark' ? '/assets/global/Antra-Dark.svg' : '/assets/global/Antra-Light.svg'}
              alt="Antra Business Group"
              height={36}
            />
          </NavLink>

          {/* Desktop links — active state slides via shared layout animation */}
          <nav className={styles.desktopLinks}>
            {links.map(({ label, to, submenu }) => (
              <div
                key={to}
                className={styles.navItem}
                onMouseEnter={() => submenu && setOpenSubmenu(to)}
                onMouseLeave={() => submenu && setOpenSubmenu(null)}
              >
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.link} ${isActive ? styles.active : ''}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="navActivePill"
                          className={styles.activePill}
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className={styles.linkText}>{label}</span>
                      {submenu && <span className={styles.linkCaret}>▾</span>}
                    </>
                  )}
                </NavLink>

                {submenu && (
                  <AnimatePresence>
                    {openSubmenu === to && (
                      <motion.div
                        className={styles.submenu}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                      >
                        {submenu.map(item => (
                          <div
                            key={item.hash}
                            className={styles.submenuItemWrap}
                            onMouseEnter={() => item.children && setOpenChildSubmenu(item.hash)}
                            onMouseLeave={() => item.children && setOpenChildSubmenu(null)}
                          >
                            <Link
                              to={`${to}#${item.hash}`}
                              className={styles.submenuLink}
                            >
                              <span>{item.label}</span>
                              {item.children && <span className={styles.submenuCaret}>▸</span>}
                            </Link>

                            {item.children && (
                              <AnimatePresence>
                                {openChildSubmenu === item.hash && (
                                  <motion.div
                                    className={styles.childSubmenu}
                                    initial={{ opacity: 0, x: 8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 8 }}
                                    transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                                  >
                                    {item.children.map(child => (
                                      <Link
                                        key={child.to ?? child.hash}
                                        to={child.to ?? `${to}#${child.hash}`}
                                        className={styles.submenuLink}
                                      >
                                        {child.label}
                                      </Link>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            )}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          {/* Right cluster */}
          <div className={styles.actions}>
            {/* Theme toggle */}
            <button
              className={styles.themeToggle}
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <line x1="12" y1="2" x2="12" y2="5" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                  <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
                  <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
                  <line x1="2" y1="12" x2="5" y2="12" />
                  <line x1="19" y1="12" x2="22" y2="12" />
                  <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
                  <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Desktop CTA */}
            <div className={styles.desktopCta}>
              <NavLink to="/contact" className={styles.ctaBtn}>
                Get in Touch
              </NavLink>
            </div>

            {/* Hamburger */}
            <button
              className={`${styles.hamburger} ${menuOpen ? styles.open : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <nav className={styles.mobileLinks}>
              {links.map(({ label, to, submenu }, i) => (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.4 }}
                >
                  <div className={styles.mobileLinkRow}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`
                      }
                    >
                      <span className={styles.mobileLinkNum}>0{i + 1}</span>
                      {label}
                    </NavLink>
                    {submenu && (
                      <button
                        className={`${styles.mobileSubmenuToggle} ${mobileSubmenuOpen === to ? styles.mobileSubmenuToggleOpen : ''}`}
                        onClick={() => setMobileSubmenuOpen(prev => prev === to ? null : to)}
                        aria-label={`Toggle ${label} submenu`}
                        aria-expanded={mobileSubmenuOpen === to}
                      >
                        ▾
                      </button>
                    )}
                  </div>

                  {submenu && (
                    <AnimatePresence>
                      {mobileSubmenuOpen === to && (
                        <motion.div
                          className={styles.mobileSubmenu}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                          style={{ overflow: 'hidden' }}
                        >
                          {submenu.map(item => (
                            <div key={item.hash}>
                              <div className={styles.mobileSubmenuRow}>
                                <Link
                                  to={`${to}#${item.hash}`}
                                  className={styles.mobileSubmenuLink}
                                >
                                  {item.label}
                                </Link>
                                {item.children && (
                                  <button
                                    className={`${styles.mobileChildToggle} ${mobileChildSubmenuOpen === item.hash ? styles.mobileSubmenuToggleOpen : ''}`}
                                    onClick={() => setMobileChildSubmenuOpen(prev => prev === item.hash ? null : item.hash)}
                                    aria-label={`Toggle ${item.label} submenu`}
                                    aria-expanded={mobileChildSubmenuOpen === item.hash}
                                  >
                                    ▾
                                  </button>
                                )}
                              </div>

                              {item.children && (
                                <AnimatePresence>
                                  {mobileChildSubmenuOpen === item.hash && (
                                    <motion.div
                                      className={styles.mobileChildSubmenu}
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: 'auto' }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
                                      style={{ overflow: 'hidden' }}
                                    >
                                      {item.children.map(child => (
                                        <Link
                                          key={child.to ?? child.hash}
                                          to={child.to ?? `${to}#${child.hash}`}
                                          className={styles.mobileChildSubmenuLink}
                                        >
                                          {child.label}
                                        </Link>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              )}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              ))}
            </nav>

            <motion.div
              className={styles.mobileContact}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p>+251 951 77 97 77</p>
              <p>info@antragroup.et</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
