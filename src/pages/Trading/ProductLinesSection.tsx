import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ProductLinesSection.module.css'

const products = [
  {
    id: 'ev',
    image: '/assets/trading%20assets/product-ev-fleet.webp',
    tag: 'Category 01',
    title: 'Electric Vehicles',
    short: 'Fleet-scale EV supply for corporate, government, and logistics operators across Ethiopia.',
    specs: [
      'Passenger and commercial EVs',
      'Fleet procurement & management',
      'Charging infrastructure sourcing',
      'After-sales support coordination',
    ],
  },
  {
    id: 'construction',
    image: '/assets/trading%20assets/product-construction-machinery.webp',
    tag: 'Category 02',
    title: 'Construction Machinery',
    short: 'Excavators, loaders, cranes, and earth-moving equipment for infrastructure and real-estate projects.',
    specs: [
      'Excavators & bulldozers',
      'Cranes & lifting equipment',
      'Compaction and road machinery',
      'Spare parts & maintenance support',
    ],
  },
  {
    id: 'sanitary',
    image: '/assets/trading%20assets/product-sanitary.webp',
    tag: 'Category 03',
    title: 'Sanitary Fittings',
    short: 'Premium-grade fittings and fixtures for hotels, hospitals, residential developments, and commercial builds.',
    specs: [
      'Bathroom and kitchen fittings',
      'Commercial-grade fixtures',
      'Large-project volume supply',
      'Technical specification support',
    ],
  },
  {
    id: 'medical',
    image: '/assets/trading%20assets/product-medical-equipment.webp',
    tag: 'Category 04',
    title: 'Medical Equipment',
    short: 'Diagnostic, imaging, and ward-level equipment for hospitals and healthcare networks.',
    specs: [
      'Diagnostic and imaging systems',
      'Patient monitoring equipment',
      'Surgical and theatre supplies',
      'Regulatory clearance support',
    ],
  },
]

function ProductCard({ product, index, isInView }: { product: typeof products[0]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 48 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.1, duration: 0.75, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.imageWrap}>
        <img
          src={product.image}
          alt={product.title}
          className={styles.image}
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
          loading="lazy"
        />
        <div className={styles.imageOverlay} />
        <span className={styles.tag}>{product.tag}</span>
        <motion.div
          className={styles.tagLine}
          animate={{ scaleX: hovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ originX: 0 }}
        />
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{product.title}</h3>
        <p className={styles.short}>{product.short}</p>

        <motion.ul
          className={styles.specs}
          animate={{ height: hovered ? 'auto' : 0, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          style={{ overflow: 'hidden' }}
        >
          {product.specs.map((s) => (
            <li key={s} className={styles.specItem}>
              <span className={styles.specDot} />
              {s}
            </li>
          ))}
        </motion.ul>
      </div>

      <div
        className={styles.bottomBar}
        style={{ transform: hovered ? 'scaleX(1)' : 'scaleX(0)' }}
      />
    </motion.div>
  )
}

export function ProductLinesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const freezoneRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })
  const freezoneInView = useInView(freezoneRef, { once: true, margin: '-80px' })

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
          <span className={styles.labelText}>Product Categories</span>
          <div className={styles.labelLine} />
        </motion.div>

        <motion.h2
          className={styles.heading}
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
        >
          Four categories.
          <br />
          <span className={styles.headingAccent}>One capable supplier.</span>
        </motion.h2>

        <motion.p
          className={styles.intro}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          We focus on categories where Ethiopian buyers have historically struggled to find consistent, technically capable suppliers. We fix that.
        </motion.p>

        {/* Products grid */}
        <div className={styles.grid}>
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} isInView={isInView} />
          ))}
        </div>

        {/* Djibouti Freezone feature */}
        <div ref={freezoneRef} className={styles.freezone}>
          <motion.div
            className={styles.freezoneImageCol}
            initial={{ opacity: 0, x: -40, scale: 0.97 }}
            animate={freezoneInView ? { opacity: 1, x: 0, scale: 1 } : {}}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          >
            <img
              src="/assets/trading%20assets/freezone-operations.webp"
              alt="Djibouti Free Zone operations"
              className={styles.freezoneImage}
              loading="lazy"
            />
            <div className={styles.freezoneBadge}>
              <span className={styles.freezoneBadgeTitle}>Djibouti Free Zone</span>
              <span className={styles.freezoneBadgeSub}>Registered operator</span>
            </div>
          </motion.div>

          <div className={styles.freezoneContent}>
            <motion.div
              className={styles.sectionLabel}
              initial={{ opacity: 0, x: -20 }}
              animate={freezoneInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className={styles.labelNumber}>02</span>
              <span className={styles.labelText}>Our Trade Advantage</span>
              <div className={styles.labelLine} />
            </motion.div>

            <motion.h3
              className={styles.freezoneHeading}
              initial={{ opacity: 0, y: 28 }}
              animate={freezoneInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.75 }}
            >
              Operating from
              <br />
              <span className={styles.headingAccent}>Djibouti Free Zone.</span>
            </motion.h3>

            <div className={styles.freezonePoints}>
              {[
                {
                  title: 'Faster clearance',
                  text: 'Freezone registration means goods move faster through the Djibouti–Addis corridor with fewer bureaucratic delays.',
                },
                {
                  title: 'Established relationships',
                  text: 'We have built supplier relationships over 18+ years. We know who delivers on time and who does not.',
                },
                {
                  title: 'Technical capability',
                  text: 'We do not just procure. We understand what we are sourcing — specs, compliance, and after-sales implications.',
                },
              ].map((pt, i) => (
                <motion.div
                  key={pt.title}
                  className={styles.freezonePoint}
                  initial={{ opacity: 0, x: 20 }}
                  animate={freezoneInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.6 }}
                >
                  <span className={styles.freezonePointBar} />
                  <div>
                    <h4 className={styles.freezonePointTitle}>{pt.title}</h4>
                    <p className={styles.freezonePointText}>{pt.text}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
