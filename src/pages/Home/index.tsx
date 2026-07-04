import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { HeroSection } from './HeroSection'
import { WhatWeDoSection } from './WhatWeDoSection'
import { ServicePillarsSection } from './ServicePillarsSection'
import { WhyUsSection } from './WhyUsSection'
import { ClosingCTASection } from './ClosingCTASection'

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4 } },
  exit:    { opacity: 0, transition: { duration: 0.3 } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Antra Business Group',
  url: 'https://antragroup.et',
  logo: 'https://antragroup.et/assets/global/Antra-Light.svg',
  description: 'Diversified business group based in Addis Ababa, Ethiopia, operating in management consultancy and strategic trade.',
  foundingDate: '2026',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Addis Ababa',
    addressCountry: 'ET',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+251-951-77-97-77',
    contactType: 'customer service',
    email: 'info@antragroup.et',
  },
}

export function HomePage() {
  return (
    <>
      <SEO
        title="Antra Business Group — Management Consulting & Trading | Addis Ababa"
        description="Enabling growth and transformation for Ethiopian and regional businesses. Management consulting plus strategic trading and supply — under one roof in Addis Ababa."
        keywords="management consulting Addis Ababa, business consulting Ethiopia, trading company Ethiopia, Djibouti Freezone supplier, organizational transformation Ethiopia"
        path="/"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <HeroSection />
        <WhatWeDoSection />
        <ServicePillarsSection />
        <WhyUsSection />
        <ClosingCTASection />
      </motion.main>
    </>
  )
}
