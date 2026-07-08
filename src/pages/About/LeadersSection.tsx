import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './LeadersSection.module.css'

/* TODO(client): replace sample bio + monogram avatar with the owner-supplied photo
   (drop into public/assets/about assets/leaders/) and confirmed full name/title. */
const leaders = [
  {
    initials: 'AT',
    name: 'Anteneh Tegegn',
    role: 'Managing Director',
    credential: 'PhD',
    // photo: '/assets/about assets/leaders/leader-1.webp',
    bio: 'Anteneh Tegegn leads the management consultancy practice, bringing extensive leadership experience across HR, operations, and organizational transformation for corporations and institutions in Ethiopia and the wider region.',
  },
]

export function LeadersSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

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
          <span className={styles.labelNumber}>07</span>
          <span className={styles.labelText}>Meet Our Leaders</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          The people behind
          <br />
          <span className={styles.headingAccent}>the practice.</span>
        </motion.h2>

        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Senior leadership with the experience to design change and the discipline to see it through.
        </motion.p>

        {/* Leader cards */}
        <div className={styles.grid}>
          {leaders.map((l, i) => (
            <motion.div
              key={l.name}
              className={styles.card}
              initial={{ opacity: 0, y: 36 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              {/* Avatar — monogram placeholder until real photo is added */}
              <div className={styles.avatar}>
                <span className={styles.avatarInitials}>{l.initials}</span>
              </div>

              <div className={styles.cardBody}>
                <div className={styles.nameRow}>
                  <h3 className={styles.name}>{l.name}</h3>
                  <span className={styles.credential}>{l.credential}</span>
                </div>
                <span className={styles.role}>{l.role}</span>
                <p className={styles.bio}>{l.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
