import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ParticleField } from '@/components/canvas/ParticleField'
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

const headline = ['Past', 'Diagnosis.']

export function ConsultancyHeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { width, height } = currentTarget.getBoundingClientRect()
    setMouse({ x: (clientX / width - 0.5) * 2, y: (clientY / height - 0.5) * 2 })
  }, [])

  return (
    <section ref={sectionRef} className={styles.hero} onMouseMove={handleMouseMove}>
      <div ref={bgRef} className={styles.bgWrap}>
        <div className={styles.bg} />
      </div>
      <div className={styles.overlay} />

      <div className={styles.canvas}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 5]} intensity={1.5} color="#D97911" />
          <pointLight position={[-5, 3, 2]} intensity={0.35} color="#ffffff" />
          <ParticleField count={100} mouseX={mouse.x} mouseY={mouse.y} />
        </Canvas>
      </div>

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
          <span>Consultancy</span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Management Consultancy
        </motion.p>

        {/* Headline */}
        <h1 className={styles.headline}>
          <span className={styles.headlinePrefix}>
            {['Built', 'to', 'go'].map((word, i) => (
              <motion.span
                key={word + i}
                className={styles.word}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
              >
                {word}
              </motion.span>
            ))}
          </span>
          <span className={styles.headlineAccentRow}>
            {headline.map((word, i) => (
              <motion.span
                key={word + i}
                className={i === 0 ? styles.word : styles.wordAccent}
                custom={i + 3}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
              >
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
          We help leadership teams in Ethiopia and the wider region not just decide what to do — but carry it out. Eighteen-plus years inside the problem.
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
