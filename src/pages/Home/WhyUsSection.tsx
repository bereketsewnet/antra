import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './WhyUsSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: 18, suffix: '+', label: 'Years of leadership experience' },
  { value: 2,  suffix: '',  label: 'Integrated practices' },
  { value: 4,  suffix: '',  label: 'Product categories sourced' },
  { value: 1,  suffix: '',  label: 'Business day response' },
]

const reasons = [
  {
    title: 'Senior expertise',
    body: 'A team with more than eighteen years of leadership experience across HR, operations, retail, and distribution.',
  },
  {
    title: 'Djibouti Freezone access',
    body: 'Sourcing operations in the Djibouti Freezone, with trade finance arrangements at Ethiopian banks for buyers who need credit terms.',
  },
  {
    title: 'Two practices, one team',
    body: 'Consultancy clients can access sourcing support, and trading clients can pull in advisory help — all from the same partner.',
  },
  {
    title: 'Built for this region',
    body: 'Engagements designed for the realities of operating in Ethiopia: thin talent pools, regulatory shifts, and supply chain volatility.',
  },
]

function Counter({ value, suffix, label, active }: {
  value: number
  suffix: string
  label: string
  active: boolean
}) {
  const numRef = useRef<HTMLSpanElement>(null)
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    if (!active || counted || !numRef.current) return
    setCounted(true)

    gsap.fromTo(
      numRef.current,
      { textContent: 0 },
      {
        textContent: value,
        duration: 1.8,
        ease: 'power2.out',
        snap: { textContent: 1 },
        onUpdate() {
          if (numRef.current) {
            numRef.current.textContent = Math.round(
              parseFloat(numRef.current.textContent || '0')
            ).toString()
          }
        },
      }
    )
  }, [active, counted, value])

  return (
    <div className={styles.stat}>
      <div className={styles.statValue}>
        <span ref={numRef}>0</span>
        <span className={styles.statSuffix}>{suffix}</span>
      </div>
      <p className={styles.statLabel}>{label}</p>
    </div>
  )
}

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} data-theme-section="hero" className={styles.section}>
      {/* Background image with overlay */}
      <div className={styles.bgImage} />
      <div className={styles.bgOverlay} />

      <div className={styles.container}>

        {/* Section header */}
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            WHY WORK WITH US
          </motion.span>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 28 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            What makes us the
            <br />
            <span className={styles.titleAccent}>right partner.</span>
          </motion.h2>
        </div>

        {/* Reasons grid */}
        <div className={styles.grid}>
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
            >
              <div className={styles.cardIcon}>
                <div className={styles.iconDot} />
              </div>
              <h4 className={styles.cardTitle}>{r.title}</h4>
              <p className={styles.cardBody}>{r.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div ref={statsRef} className={styles.statsRow}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6 }}
            >
              <Counter {...s} active={statsInView} />
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
