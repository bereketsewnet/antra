import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './MapSection.module.css'

export function AboutMapSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>09</span>
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
              src="https://maps.google.com/maps?q=Bole+Dembel,+Airport+Road,+Kirkos+Sub+City,+Addis+Ababa,+Ethiopia&output=embed&z=16"
              title="Antra Business Group office location"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
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
                <p className={styles.detailNote}>Mon – Fri, 8am – 6pm EAT</p>
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
              href="https://maps.google.com/maps?q=Bole+Dembel,+Airport+Road,+Kirkos+Sub+City,+Addis+Ababa,+Ethiopia"
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
