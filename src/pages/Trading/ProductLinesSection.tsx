import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import styles from './ProductLinesSection.module.css'

const products = [
  {
    id: 'ev',
    image: '/assets/trading%20assets/product-ev-fleet.webp',
    tag: 'Category 01',
    title: 'Electric Vehicles',
    short: 'Passenger and commercial EVs for fleet buyers, distributors, and businesses preparing for the energy transition in East African markets.',
  },
  {
    id: 'construction',
    image: '/assets/trading%20assets/product-construction-machinery.webp',
    tag: 'Category 02',
    title: 'Construction Machinery',
    short: 'Excavators, loaders, and supporting equipment for construction firms, contractors, and industrial projects. We source from manufacturers and supply in Ethiopia and the region.',
  },
  {
    id: 'sanitary',
    image: '/assets/trading%20assets/product-sanitary.webp',
    tag: 'Category 03',
    title: 'Sanitary Equipment',
    short: 'Sanitary ware and fittings for construction projects, real estate developers, and institutional buyers and retailers.',
  },
  {
    id: 'medical',
    image: '/assets/trading%20assets/product-medical-equipment.webp',
    tag: 'Category 04',
    title: 'Medical Equipment',
    short: 'Diagnostic and clinical equipment for hospitals, clinics, and healthcare institutions. We select suppliers with regulatory and clinical standards in mind.',
  },
]

function ProductCard({ product, index, isInView }: { product: typeof products[0]; index: number; isInView: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      id={`product-${product.id}`}
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
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' })

  return (
    <section ref={sectionRef} id="product-lines" className={styles.section}>
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

      </div>
    </section>
  )
}
