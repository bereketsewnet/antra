import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import styles from './MapSection.module.css'

export function AboutMapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        {/* ── CTA block — "Ready to work with us?" ── */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>05</span>
          <span className={styles.labelText}>Let's Talk</span>
          <div className={styles.labelLine} />
        </motion.div>

        <div className={styles.ctaInner}>
          <motion.div
            className={styles.ctaText}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.75, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <h2 className={styles.ctaHeading}>Ready to work with us?</h2>
            <p className={styles.ctaSub}>
              Tell us what you are working on. We will respond within one business day.
            </p>
          </motion.div>

          <motion.div
            className={styles.ctaActions}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.6 }}
          >
            <Link to="/contact" className={styles.ctaBtn + ' ' + styles.ctaBtnPrimary}>
              Start a conversation
            </Link>
            <Link to="/consultancy" className={styles.ctaBtn + ' ' + styles.ctaBtnGhost}>
              See our services
            </Link>
          </motion.div>
        </div>

        {/* ── Find Us block ── */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className={styles.labelNumber}>06</span>
          <span className={styles.labelText}>Find Us</span>
          <div className={styles.labelLine} />
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.7 }}
        >
          Our <span className={styles.headingAccent}>office.</span>
        </motion.h2>

        <div className={styles.layout}>
          {/* Map embed */}
          <motion.div
            className={styles.mapWrap}
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <iframe
              className={styles.map}
              src="https://maps.google.com/maps?q=Rayuma+Building,+beside+Getu+Commercial,+in+front+of+Oda+Restaurant,+Addis+Ababa&output=embed&z=17"
              title="Antra Business Group office location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              href="https://maps.app.goo.gl/voFHXuUdfUe2Ezfc8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapOverlayLink}
              aria-label="Open Antra Business Group location in Google Maps"
            />
          </motion.div>

          {/* Address details */}
          <motion.div
            className={styles.details}
            initial={{ opacity: 0, x: 24 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            <div className={styles.detailBlock}>
              <span className={styles.detailIcon}>📍</span>
              <div>
                <div className={styles.detailTitle}>Head Office</div>
                <p className={styles.detailText}>
                  Rayuma Building, Office No. 912<br />
                  Airport Road, Bole Dembel<br />
                  Kirkos Sub-City, Addis Ababa<br />
                  Ethiopia
                </p>
                <p className={styles.detailNote}>Next to Getu Commercial Center</p>
              </div>
            </div>

            <div className={styles.detailBlock}>
              <span className={styles.detailIcon}>📞</span>
              <div>
                <div className={styles.detailTitle}>Phone</div>
                <p className={styles.detailText}>
                  +251 951 77 97 77<br />
                  +251 986 11 18 11
                </p>
                <p className={styles.detailNote}>Mon – Fri, 8am – 5pm · Sat, 8am – 12pm EAT</p>
              </div>
            </div>

            <div className={styles.detailBlock}>
              <span className={styles.detailIcon}>✉️</span>
              <div>
                <div className={styles.detailTitle}>Email</div>
                <p className={styles.detailText}>info@antragroup.et</p>
                <p className={styles.detailNote}>Response within one business day</p>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/voFHXuUdfUe2Ezfc8"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsBtn}
            >
              Get Directions →
            </a>
          </motion.div>
        </div>

      </div>
    </section>
  )
}
