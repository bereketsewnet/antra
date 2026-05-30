import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { ConsultancyHeroSection } from './HeroSection'
import { ServicesSection } from './ServicesSection'
import { ConsultancyClosingCTA } from './ClosingCTASection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Management Consultancy',
  url: 'http://antra.lula.com.et/consultancy',
  description: 'Management consultancy services including leadership development, talent search, executive coaching, and organisational transformation for Ethiopian and regional businesses.',
  provider: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'http://antra.lula.com.et',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Ethiopia and East Africa',
  },
  serviceType: [
    'Leadership Development',
    'Talent Search & Assessment',
    'Coaching & Mentorship',
    'Organisational Transformation',
  ],
}

export function ConsultancyPage() {
  return (
    <>
      <SEO
        title="Management Consultancy"
        description="Management consultancy that goes past diagnosis. Antra helps Ethiopian and regional leadership teams carry out what they decide — leadership development, talent search, coaching, and organisational transformation."
        path="/consultancy"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ConsultancyHeroSection />
        <ServicesSection />
        <ConsultancyClosingCTA />
      </motion.main>
    </>
  )
}
