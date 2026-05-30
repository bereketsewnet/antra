import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './OurStorySection.module.css'

const milestones = [
  { year: '2006', label: 'Founded in Addis Ababa' },
  { year: '18+', label: 'Years of leadership experience' },
  { year: '2', label: 'Integrated practices' },
  { year: '1', label: 'Business day response guarantee' },
]

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
          <span className={styles.labelNumber}>01</span>
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
                Antra was set up to do two things at once. The first is management
                consultancy — the kind that goes past diagnosis into the messier work
                of helping leadership teams actually carry out what they decided.
              </p>
              <p>
                The second is trading, focused on product categories where buyers in
                Ethiopia have trouble finding consistent, technically capable suppliers:
                electric vehicles, construction machinery, sanitary fittings, and
                medical equipment.
              </p>
              <p>
                The two practices sit under the same company because the clients they
                serve overlap. A construction firm we advise on succession planning is
                often the same business that needs three excavators by end of quarter.
                A healthcare network we coach through restructuring is the same one
                buying diagnostic equipment from us.
              </p>
            </motion.div>

            {/* Milestones strip */}
            <motion.div
              className={styles.milestones}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.7 }}
            >
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  className={styles.milestone}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }}
                >
                  <span className={styles.milestoneValue}>{m.year}</span>
                  <span className={styles.milestoneLabel}>{m.label}</span>
                </motion.div>
              ))}
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
              {/* Floating orange card */}
              <motion.div
                className={styles.floatingCard}
                initial={{ opacity: 0, y: 20 }}
                animate={imgInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <p className={styles.floatingQuote}>
                  "It is harder to sell theory to a CEO when you have sat in the same seat."
                </p>
                <span className={styles.floatingAuthor}>— Founding Team</span>
              </motion.div>

              {/* Corner decoration */}
              <div className={styles.imageCorner} />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
