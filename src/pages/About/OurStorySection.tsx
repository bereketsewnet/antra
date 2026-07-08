import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './OurStorySection.module.css'

export function OurStorySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const imgInView = useInView(imageRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>03</span>
          <span className={styles.labelText}>Our Story</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Main content grid */}
        <div className={styles.grid}>

          {/* Left: Text */}
          <div className={styles.textCol}>
            <motion.h2
              className={styles.heading}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              Built to do
              <br />
              <span className={styles.headingAccent}>two things at once.</span>
            </motion.h2>

            <motion.div
              className={styles.bodyStack}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <p>
                Our story is built on a passion for transforming organizations,
                developing leaders, and enabling growth. Backed by extensive
                leadership experience and excellence across multiple industries,
                markets, and business environments, we have successfully partnered
                with leading corporations, multinational organizations, SMEs,
                government institutions, the airline industry, entrepreneurs, and
                diaspora investors. This diverse experience allows us to combine
                strategic insight with practical execution — helping clients
                navigate complexity, unlock opportunities, and achieve sustainable
                growth and transformation.
              </p>
              <p>
                In addition to our management consultancy services, we offer
                trading solutions that connect clients with quality products,
                trusted suppliers, and efficient route-to-market strategies across
                Ethiopia and regional markets.
              </p>
            </motion.div>
          </div>

          {/* Right: Image */}
          <div ref={imageRef} className={styles.imageCol}>
            <motion.div
              className={styles.imageWrap}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={imgInView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <img
                src="/assets/about%20assets/our-story-image.webp"
                alt="Antra Business Group — Our Story"
                className={styles.image}
                loading="lazy"
              />

              {/* Corner decoration */}
              <div className={styles.imageCorner} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
