import { useRef, useState, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect } from 'react'
import { ParticleField } from '@/components/canvas/ParticleField'
import styles from './ContactFormSection.module.css'

gsap.registerPlugin(ScrollTrigger)

const serviceOptions = [
  { value: '', label: 'What can we help with?' },
  { value: 'consultancy', label: 'Management Consultancy' },
  { value: 'trading', label: 'Trading & Supply' },
  { value: 'both', label: 'Both practices' },
  { value: 'unsure', label: 'Not sure yet' },
]

const contactDetails = [
  {
    icon: '📍',
    label: 'Location',
    value: 'Addis Ababa, Ethiopia',
    sub: 'Djibouti Free Zone operations',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+251 951 77 97 77',
    sub: 'Mon – Fri, 8am – 6pm EAT',
  },
  {
    icon: '✉️',
    label: 'Email',
    value: 'info@antragroup.et',
    sub: 'Response within 1 business day',
  },
]

type FormState = {
  name: string
  company: string
  email: string
  phone: string
  service: string
  message: string
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactFormSection() {
  const bgRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const isInView = useInView(formRef, { once: true, margin: '-60px' })

  const [form, setForm] = useState<FormState>({
    name: '', company: '', email: '', phone: '', service: '', message: '',
  })
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (!bgRef.current || !sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -12,
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

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }, [])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    // Simulate send — replace with real API call
    setTimeout(() => setStatus('sent'), 1800)
  }, [])

  const fieldVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { delay: 0.1 + i * 0.08, duration: 0.55, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
    }),
  }

  return (
    <section ref={sectionRef} className={styles.section} onMouseMove={handleMouseMove}>
      {/* Hero bg with parallax */}
      <div ref={bgRef} className={styles.bgWrap}>
        <div className={styles.bg} />
      </div>
      <div className={styles.overlay} />

      {/* Particles */}
      <div className={styles.canvas}>
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
          <ambientLight intensity={0.25} />
          <pointLight position={[0, 0, 5]} intensity={1.2} color="#D97911" />
          <ParticleField count={80} mouseX={mouse.x} mouseY={mouse.y} />
        </Canvas>
      </div>

      {/* Hero text */}
      <div className={styles.hero}>
        <motion.div
          className={styles.breadcrumb}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <a href="/">Home</a>
          <span>/</span>
          <span>Contact</span>
        </motion.div>

        <motion.p
          className={styles.eyebrow}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Get in touch
        </motion.p>

        <motion.h1
          className={styles.heroHeading}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Tell us what you
          <br />
          <span className={styles.heroAccent}>are working on.</span>
        </motion.h1>

        <motion.p
          className={styles.heroSub}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
        >
          We respond within one business day. No lengthy intake — just a direct conversation.
        </motion.p>

        <motion.div
          className={styles.scrollLine}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.6 }}
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
        transition={{ delay: 1.3, duration: 1.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      />

      {/* ── Main form + details ── */}
      <div ref={formRef} className={styles.body}>
        <div className={styles.bodyContainer}>

          {/* Left: form */}
          <div className={styles.formCol}>
            <motion.div
              className={styles.formLabel}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.labelNumber}>01</span>
              <span className={styles.labelText}>Send a message</span>
              <div className={styles.labelLine} />
            </motion.div>

            {status === 'sent' ? (
              <motion.div
                className={styles.successBox}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className={styles.successIcon}>✓</span>
                <h3 className={styles.successTitle}>Message received.</h3>
                <p className={styles.successText}>
                  We will get back to you within one business day.
                </p>
              </motion.div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                {/* Row 1: Name + Company */}
                <div className={styles.row}>
                  <motion.div className={styles.field} custom={0} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                    <label className={styles.label} htmlFor="name">Full Name *</label>
                    <input
                      id="name" name="name" type="text" required
                      placeholder="Solomon Tadesse"
                      className={styles.input}
                      value={form.name}
                      onChange={handleChange}
                    />
                  </motion.div>
                  <motion.div className={styles.field} custom={1} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                    <label className={styles.label} htmlFor="company">Company / Organisation</label>
                    <input
                      id="company" name="company" type="text"
                      placeholder="Acme Construction PLC"
                      className={styles.input}
                      value={form.company}
                      onChange={handleChange}
                    />
                  </motion.div>
                </div>

                {/* Row 2: Email + Phone */}
                <div className={styles.row}>
                  <motion.div className={styles.field} custom={2} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                    <label className={styles.label} htmlFor="email">Email Address *</label>
                    <input
                      id="email" name="email" type="email" required
                      placeholder="solomon@acme.et"
                      className={styles.input}
                      value={form.email}
                      onChange={handleChange}
                    />
                  </motion.div>
                  <motion.div className={styles.field} custom={3} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                    <label className={styles.label} htmlFor="phone">Phone Number</label>
                    <input
                      id="phone" name="phone" type="tel"
                      placeholder="+251 9__ __ __ __"
                      className={styles.input}
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </motion.div>
                </div>

                {/* Service dropdown */}
                <motion.div className={styles.field} custom={4} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <label className={styles.label} htmlFor="service">Area of Interest</label>
                  <div className={styles.selectWrap}>
                    <select
                      id="service" name="service"
                      className={`${styles.input} ${styles.select}`}
                      value={form.service}
                      onChange={handleChange}
                    >
                      {serviceOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <span className={styles.selectArrow}>↓</span>
                  </div>
                </motion.div>

                {/* Message */}
                <motion.div className={styles.field} custom={5} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <label className={styles.label} htmlFor="message">Message *</label>
                  <textarea
                    id="message" name="message" required rows={5}
                    placeholder="Tell us about your project, the challenge you are facing, or the equipment you need..."
                    className={`${styles.input} ${styles.textarea}`}
                    value={form.message}
                    onChange={handleChange}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div custom={6} variants={fieldVariants} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? (
                      <span className={styles.sending}>Sending…</span>
                    ) : (
                      'Send message'
                    )}
                  </button>
                </motion.div>
              </form>
            )}
          </div>

          {/* Right: contact details */}
          <div className={styles.detailsCol}>
            <motion.div
              className={styles.formLabel}
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <span className={styles.labelNumber}>02</span>
              <span className={styles.labelText}>Find us</span>
              <div className={styles.labelLine} />
            </motion.div>

            <div className={styles.detailsList}>
              {contactDetails.map((d, i) => (
                <motion.div
                  key={d.label}
                  className={styles.detailCard}
                  initial={{ opacity: 0, y: 24 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.12, duration: 0.6 }}
                >
                  <div className={styles.detailLabel}>{d.label}</div>
                  <div className={styles.detailValue}>{d.value}</div>
                  <div className={styles.detailSub}>{d.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Guarantee badge */}
            <motion.div
              className={styles.guarantee}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <span className={styles.guaranteeValue}>1</span>
              <div>
                <div className={styles.guaranteeTitle}>Business day response</div>
                <div className={styles.guaranteeSub}>We do not leave messages unanswered</div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}
