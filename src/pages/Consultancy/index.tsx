import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { ConsultancyHeroSection } from './HeroSection'
import { IntroSection } from './IntroSection'
import { ServicesSection } from './ServicesSection'
import { ProblemsSection } from './ProblemsSection'
import { ConsultancyClosingCTA } from './ClosingCTASection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Management Consulting',
  url: 'https://antragroup.et/consultancy',
  description: 'Management consulting services including leadership development, training on people management, talent search, advisory and change, executive coaching, and organizational transformation for Ethiopian and regional businesses.',
  provider: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'https://antragroup.et',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Ethiopia and East Africa',
  },
  serviceType: [
    'Leadership Development Programs',
    'Training on People Management',
    'Talent Search and Assessments',
    'Advisory and Change',
    'Coaching and Mentorship',
    'Organizational Transformation',
  ],
}

export function ConsultancyPage() {
  return (
    <>
      <SEO
        title="Management Consulting in Addis Ababa | Leadership, Strategy, Talent — Antra"
        description="Management consulting that goes past diagnosis into implementation. Leadership development, executive coaching, talent search, training on people management, and organizational transformation for Ethiopian and regional businesses."
        keywords="management consulting firms Addis Ababa, leadership development Ethiopia, executive coaching Ethiopia, talent search Addis Ababa, organizational transformation Ethiopia, HR consulting Ethiopia, executive search Ethiopia"
        path="/consultancy"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ConsultancyHeroSection />
        <IntroSection />
        <ProblemsSection />
        <ServicesSection />
        <ConsultancyClosingCTA />
      </motion.main>
    </>
  )
}
