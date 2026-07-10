import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './TeamSection.module.css'

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

// Scalable team grid — one entry today, room to add more as the roster grows.
const team = [
  {
    name: 'Anteneh Tegegn',
    title: 'Managing Director · PhD',
    photo: '/assets/home%20assets/leader_image.jpg',
  },
]

export function TeamSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} data-theme-section="hero" className={styles.section}>
      {/* Background image with overlay — kept from the previous section */}
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      {/* Edge fades — melt this image band into the sections above and below */}
      <div className={styles.topFade} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      <div className={styles.container}>

        {/* Section header */}
        <div className={styles.header}>
          <motion.div
            className={styles.labelRow}
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.labelDot} />
            <span className={styles.labelText}>Our Team</span>
          </motion.div>

          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
          >
            Leadership that stays
            <br />
            <span className={styles.titleAccent}>in the room.</span>
          </motion.h2>
        </div>

        {/* Team grid */}
        <div className={styles.grid}>
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className={styles.card}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.25 + i * 0.12, duration: 0.75, ease: EASE }}
            >
              <div className={styles.photoWrap}>
                <img
                  src={member.photo}
                  alt={member.name}
                  className={styles.photo}
                  loading="lazy"
                />
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardAccent} />
                <div>
                  <span className={styles.cardName}>{member.name}</span>
                  <span className={styles.cardTitle}>{member.title}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
