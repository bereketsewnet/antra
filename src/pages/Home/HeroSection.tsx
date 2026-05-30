import { useRef, useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ParticleField } from '@/components/canvas/ParticleField'
import { Button } from '@/components/ui/Button'
import styles from './HeroSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const wordVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.4 + i * 0.1,
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number],
    },
  }),
}

const headline1 = ['Enabling', 'Growth']
const headline2 = ['and', 'Transformation']

export function HeroSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  // Parallax scroll on background image
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
    setMouse({
      x: (clientX / width - 0.5) * 2,
      y: (clientY / height - 0.5) * 2,
    })
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.hero}
      onMouseMove={handleMouseMove}
    >
      {/* Parallax background image */}
      <div ref={bgRef} className={styles.bgWrap}>
        <div className={styles.bg} />
      </div>

      {/* Dark gradient overlay */}
      <div className={styles.overlay} />

      {/* R3F 3D Particle Canvas */}
      <div className={styles.canvas}>
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.5]}
        >
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 0, 5]} intensity={2} color="#D97911" />
          <pointLight position={[-5, 3, 2]} intensity={0.5} color="#ffffff" />
          <ParticleField count={180} mouseX={mouse.x} mouseY={mouse.y} />
        </Canvas>
      </div>

      {/* Hero content */}
      <div className={styles.content}>
        {/* Eyebrow */}
        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          ADDIS ABABA · ETHIOPIA
        </motion.p>

        {/* Headline line 1 */}
        <h1 className={styles.headline}>
          <span className={styles.line}>
            {headline1.map((word, i) => (
              <motion.span
                key={word}
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
          <span className={styles.line}>
            {headline2.map((word, i) => (
              <motion.span
                key={word}
                className={`${styles.word} ${word === 'Transformation' ? styles.orangeWord : ''}`}
                custom={headline1.length + i}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
              >
                {word}
              </motion.span>
            ))}
          </span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className={styles.subhead}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
        >
          A management consultancy and trading company based in Addis Ababa.
          <br />
          We help organizations grow — and supply what they need to do it.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className={styles.ctas}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.7 }}
        >
          <Button variant="primary" href="/contact">
            Start a conversation
          </Button>
          <Button variant="ghost" href="/consultancy">
            See what we do
          </Button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className={styles.scrollLabel}>Scroll</span>
        <motion.div
          className={styles.scrollChevron}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
            <path d="M1 1L8 8L15 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
