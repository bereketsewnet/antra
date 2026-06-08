import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ServicePillarsSection.module.css'

const cards = [
  {
    id: 'consultancy',
    number: '01',
    tag: 'Management Consultancy',
    headline: 'Leadership. Strategy. People.',
    body: 'We work with executive teams on leadership development, organizational transformation, strategy, talent search, and the coaching that helps senior people deliver on what they committed to. Most of our engagements run past the design phase into implementation, because that is where transformation work usually breaks down.',
    cta: 'Explore consultancy',
    href: '/consultancy',
    image: '/assets/home%20assets/consultancy-pillar-card.webp',
  },
  {
    id: 'trading',
    number: '02',
    tag: 'Trading & Supply',
    headline: 'Source. Ship. Deliver.',
    body: 'Our trading division sources and distributes electric vehicles, construction machinery, sanitary equipment, and medical equipment. Most shipments come through the Djibouti Freezone. Our buyers include fleet operators, contractors, hospitals, and government institutions across Ethiopia and the region.',
    cta: 'See our product lines',
    href: '/trading',
    image: '/assets/home%20assets/trading-pillar-card.webp',
  },
]

function TiltCard({ card, index, isInView }: {
  card: typeof cards[0]
  index: number
  isInView: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width - 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: cy * -10, y: cx * 10 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }, [])

  return (
    <motion.div
      className={styles.cardWrap}
      initial={{ opacity: 0, y: 60, x: index === 0 ? -40 : 40 }}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.18, duration: 0.85, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] }}
    >
      <div
        ref={cardRef}
        className={styles.card}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.02 : 1})`,
          transition: hovered ? 'transform 0.08s linear' : 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background image */}
        <div className={styles.cardBg} style={{ backgroundImage: `url('${card.image}')` }} />

        {/* Gradient overlay — lifts on hover */}
        <div
          className={styles.cardOverlay}
          style={{ opacity: hovered ? 0.75 : 0.85 }}
        />

        {/* Content */}
        <div className={styles.cardContent}>
          <div className={styles.cardTop}>
            <span className={styles.cardNumber}>{card.number}</span>
            <span className={styles.cardTag}>{card.tag}</span>
          </div>

          <div className={styles.cardBody}>
            <h3 className={styles.cardHeadline}>{card.headline}</h3>
            <p className={styles.cardText}>{card.body}</p>
          </div>

          <a href={card.href} className={styles.cardCta}>
            <span>{card.cta}</span>
            <motion.span
              className={styles.ctaArrow}
              animate={hovered ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9H15M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          </a>
        </div>

        {/* Corner accent */}
        <div className={styles.cornerAccent} />
      </div>
    </motion.div>
  )
}

export function ServicePillarsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>

        {/* Section header */}
        <div className={styles.header}>
          <motion.span
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            OUR TWO PRACTICES
          </motion.span>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            Built for clients who need
            <br />
            <span className={styles.titleAccent}>both kinds of help.</span>
          </motion.h2>
        </div>

        {/* Cards grid */}
        <div className={styles.grid}>
          {cards.map((card, i) => (
            <TiltCard key={card.id} card={card} index={i} isInView={isInView} />
          ))}
        </div>

      </div>
    </section>
  )
}
