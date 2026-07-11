import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ServicesSection.module.css'

const services = [
  {
    id: 'org',
    image: '/assets/consultancy%20assets/org-transformation.webp',
    tag: 'Practice 01',
    title: 'Organizational Transformation',
    short: 'Strategy alignment, structure design, change management, and cultural transformation corporate governance and functional transformation. We are usually engaged through implementation, which is the phase where these programs tend to come apart if a firm is not careful.',
    points: [
      'Organizational transformation programs',
      'Organizational strategy and goals formulations',
      'Compliance and risk management',
      'Reward and compensation formulation',
      'Employees experience survey and action plans',
      'Cultural transformation and policy formulation',
      'Organizational design and change management',
      'Business model transformation including service and product development and design',
    ],
  },
  {
    id: 'leadership',
    image: '/assets/consultancy%20assets/leadership-development.webp',
    tag: 'Practice 02',
    title: 'Leadership Development Programs',
    short: 'Programs for executives and all level managers, designed and delivered in formats that fit how Ethiopian and regional businesses operate. We run cohort programs, intensive workshops, and one-to-one development tracks depending on what the client needs.',
    points: [
      'Leadership Development Program',
      'Global Leadership Development Program',
      'Strategic Leadership Program',
      'Management Development Program',
      'Supervisory Development Program',
    ],
  },
  {
    id: 'people-mgmt',
    image: '/assets/consultancy%20assets/coaching-mentorship.webp',
    tag: 'Practice 03',
    title: 'Training on People Management',
    short: 'Experienced in talent review and succession planning, performance management, reward and compensation management, employee relations and engagement and union management, strategic HR resource management, HR planning and development, organizational design, workforce planning and development, and competency-based assessment.',
  },
  {
    id: 'talent',
    image: '/assets/consultancy%20assets/talent-search.webp',
    tag: 'Practice 04',
    title: 'Talent Search & Assessments',
    short: 'We help organizations attract, assess, and retain top talent through executive and key talent search, talent mapping, assessment and profiling, onboarding support, and career planning, pre-employment review ensuring the right people are positioned for both immediate impact and future growth.',
  },
  {
    id: 'advisory',
    image: '/assets/consultancy%20assets/org-transformation.webp',
    tag: 'Practice 05',
    title: 'Advisory & Change',
    short: 'Our expertise includes strategy formulation, organizational transformation, change management, project management, leadership and young talent development, SME development, functional and technical capability building. By working closely with our clients, we deliver tailored solutions that address real business challenges and create lasting value.',
  },
  {
    id: 'coaching',
    image: '/assets/consultancy%20assets/coaching-mentorship.webp',
    tag: 'Practice 06',
    title: 'Coaching & Mentorship',
    short: 'One-to-one and team coaching for senior leaders working through transitions, expansion, restructuring, or performance challenges. We provide specialized services in coaching managers, coaching leaders, 360 assessments, career consultation and leadership development.',
  },
]

const approach = [
  { number: '01', label: 'Diagnose', text: 'We start with a candid diagnosis — not the version of the problem the client wants to hear, but the one we actually see.' },
  { number: '02', label: 'Design', text: 'We co-design solutions with the people who will implement them. Imposed change does not stick.' },
  { number: '03', label: 'Deliver', text: 'We stay in the room through delivery. If the plan hits a wall, we adjust — not hand over a report and leave.' },
  { number: '04', label: 'Embed', text: 'We measure success twelve months out. The change has to outlast our involvement.' },
]

function ServiceCard({ svc, index, isInView }: { svc: typeof services[0]; index: number; isInView: boolean }) {
  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2 + index * 0.1, duration: 0.7, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
    >
      <div className={styles.cardImageWrap}>
        <img
          src={svc.image}
          alt={svc.title}
          className={styles.cardImage}
          loading="lazy"
        />
        <div className={styles.cardOverlay} />
        <span className={styles.cardTag}>{svc.tag}</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{svc.title}</h3>
        <p className={styles.cardShort}>{svc.short}</p>

        {svc.points && (
          <ul className={styles.cardPoints}>
            {svc.points.map((pt) => (
              <li key={pt} className={styles.cardPoint}>
                <span className={styles.cardPointDot} />
                {pt}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.cardRule} />
    </motion.div>
  )
}

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const approachRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const approachInView = useInView(approachRef, { once: true, margin: '-80px' })

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
          {services.map((svc, i) => (
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
