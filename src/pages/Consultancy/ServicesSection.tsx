import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { practices } from '@/data/practices'
import styles from './ServicesSection.module.css'

const approach = [
  { number: '01', label: 'Diagnose', text: 'We start with a candid diagnosis — not the version of the problem the client wants to hear, but the one we actually see.' },
  { number: '02', label: 'Design', text: 'We co-design solutions with the people who will implement them. Imposed change does not stick.' },
  { number: '03', label: 'Deliver', text: 'We stay in the room through delivery. If the plan hits a wall, we adjust — not hand over a report and leave.' },
  { number: '04', label: 'Embed', text: 'We measure success twelve months out. The change has to outlast our involvement.' },
]

function ServiceCard({ svc, index, isInView }: { svc: typeof practices[0]; index: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.65, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      <Link to={`/consultancy/practices/${svc.id}`} className={styles.card}>
        <div className={styles.cardImageWrap}>
          <img
            src={svc.image}
            alt={svc.title}
            className={styles.cardImage}
            loading="lazy"
          />
          <div className={styles.cardOverlay} />
        </div>

        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{svc.title}</h3>
          <span className={styles.cardExplore}>Explore this practice →</span>
        </div>

        <div className={styles.cardRule} />
      </Link>
    </motion.div>
  )
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const approachRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const approachInView = useInView(approachRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="services" className={styles.section}>
      <div className={styles.container}>

        {/* Section label */}
        <motion.div
          className={styles.sectionLabel}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.labelNumber}>01</span>
          <span className={styles.labelText}>Our Practices</span>
          <div className={styles.labelLine} />
        </motion.div>

        {/* Heading */}
        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Six areas.
          <br />
          <span className={styles.headingAccent}>One commitment.</span>
        </motion.h2>

        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          Every engagement, regardless of the practice area, carries the same guarantee: we do not leave before the work is done.
        </motion.p>

        {/* Service cards grid */}
        <div className={styles.grid}>
          {practices.map((svc, i) => (
            <ServiceCard key={svc.id} svc={svc} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Approach strip */}
        <div ref={approachRef} className={styles.approach}>
          <motion.div
            className={styles.approachLabel}
            initial={{ opacity: 0, x: -20 }}
            animate={approachInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className={styles.labelNumber}>02</span>
            <span className={styles.labelText}>How We Work</span>
            <div className={styles.labelLine} />
          </motion.div>

          <div className={styles.approachGrid}>
            {approach.map((step, i) => (
              <motion.div
                key={step.number}
                className={styles.approachStep}
                initial={{ opacity: 0, y: 28 }}
                animate={approachInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.65 }}
              >
                <span className={styles.stepNumber}>{step.number}</span>
                <h4 className={styles.stepLabel}>{step.label}</h4>
                <p className={styles.stepText}>{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
