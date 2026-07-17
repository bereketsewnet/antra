import { useRef } from 'react'
import { useParams, Navigate, Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { getPracticeById, practices } from '@/data/practices'
import styles from './PracticeDetail.module.css'

const EASE = [0.4, 0, 0.2, 1] as [number, number, number, number]

export function PracticeDetailPage() {
  const { slug } = useParams()
  const practice = getPracticeById(slug)

  const contentRef = useRef<HTMLElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: '-80px' })

  if (!practice) {
    return <Navigate to="/consultancy" replace />
  }

  const otherPractices = practices.filter((p) => p.id !== practice.id)

  return (
    <>
      <SEO
        title={`${practice.title} | Management Consultancy — Antra Business Group`}
        description={practice.short}
        path={`/consultancy/practices/${practice.id}`}
        image={`https://antragroup.et${practice.image}`}
      />

      {/* Banner */}
      <section data-theme-section="hero" className={styles.banner}>
        <div className={styles.bannerContainer}>
          <motion.div
            className={styles.breadcrumb}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/consultancy">Consultancy</Link>
            <span>/</span>
            <Link to="/consultancy#services">Our Practices</Link>
            <span>/</span>
            <span className={styles.breadcrumbCurrent}>{practice.title}</span>
          </motion.div>

          <motion.span
            className={styles.bannerTag}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            {practice.tag}
          </motion.span>

          <motion.h1
            className={styles.bannerTitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.7, ease: EASE }}
          >
            {practice.title}
          </motion.h1>
        </div>
      </section>

      {/* Content */}
      <section ref={contentRef} className={styles.section}>
        <div className={styles.container}>

          {/* Intro: image + description */}
          <div className={styles.intro}>
            <motion.div
              className={styles.introImageWrap}
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <img
                src={practice.image}
                alt={practice.title}
                className={styles.introImage}
                loading="lazy"
              />
            </motion.div>

            <motion.div
              className={styles.introText}
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.8, ease: EASE }}
            >
              <h2 className={styles.introHeading}>{practice.title}</h2>
              <p className={styles.introBody}>{practice.short}</p>
              <Link to="/contact" className={styles.introCta}>
                Book a discovery call
              </Link>
            </motion.div>
          </div>

          {/* Modules — only rendered where the practice actually has a bullet list */}
          {practice.modules && practice.modules.length > 0 && (
            <div className={styles.details}>
              <motion.div
                className={styles.detailCol}
                initial={{ opacity: 0, y: 28 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.7 }}
              >
                <h3 className={styles.detailTitle}>Indicative Modules</h3>
                <ul className={styles.detailList}>
                  {practice.modules.map((m) => (
                    <li key={m} className={styles.detailItem}>
                      <span className={styles.detailDot} />
                      {m}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          )}

          {/* Other practices */}
          <div className={styles.otherPractices}>
            <h3 className={styles.otherHeading}>Other Practices</h3>
            <div className={styles.otherGrid}>
              {otherPractices.map((p) => (
                <Link key={p.id} to={`/consultancy/practices/${p.id}`} className={styles.otherCard}>
                  {p.title}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
