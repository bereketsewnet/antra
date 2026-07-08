import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './HeroSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.12, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  }),
}

export function TradingHeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!bgRef.current || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={styles.hero}>
      <div ref={bgRef} className={styles.bgWrap}>
        <div className={styles.bg} />
      </div>
      <div className={styles.overlay} />

      <div className={styles.content}>
        {/* Breadcrumb */}
        <motion.div
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <a href="/">Home</a>
          <span>/</span>
          <span>Trading</span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Trading & Supply
        </motion.p>

        {/* Headline */}
        <h1 className={styles.headline}>
          <span className={styles.headlineLine}>
            <motion.span className={styles.word} custom={0} variants={wordVariants} initial="hidden" animate="visible">
              Genuine
            </motion.span>
            <motion.span className={styles.wordGradient} custom={1} variants={wordVariants} initial="hidden" animate="visible">
              products.
            </motion.span>
          </span>
          <span className={styles.headlineLine}>
            {['Every', 'time.'].map((word, i) => (
              <motion.span key={word + i} className={styles.word} custom={i + 2} variants={wordVariants} initial="hidden" animate="visible">
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subhead */}
        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          Sourcing and distribution for fleet, construction, healthcare, and infrastructure buyers across Ethiopia and the region.
        </motion.p>

        {/* Scroll indicator */}
        <motion.div
          className={styles.scrollLine}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <motion.div
            className={styles.scrollDot}
            animate={{ y: [0, 24, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      <motion.div
        className={styles.bottomRule}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.7, duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      />
    </section>
  )
}
