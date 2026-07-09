import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { TradingHeroSection } from './HeroSection'
import { IntroSection } from './IntroSection'
import { ProductLinesSection } from './ProductLinesSection'
import { KeySuppliersSection } from './KeySuppliersSection'
import { TradingClosingCTA } from './ClosingCTASection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Trading & Supply',
  url: 'https://antragroup.et/trading',
  description: 'Strategic trading and supply of electric vehicles, construction machinery, sanitary equipment, and medical equipment for Ethiopian buyers via Djibouti Free Zone.',
  provider: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'https://antragroup.et',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Ethiopia',
  },
  serviceType: [
    'Electric Vehicle Supply',
    'Construction Machinery',
    'Sanitary Equipment',
    'Medical Equipment',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Product Lines',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Electric Vehicles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Construction Machinery' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sanitary Equipment' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Medical Equipment' } },
    ],
  },
}

export function TradingPage() {
  return (
    <>
      <SEO
        title="Trading & Supply in Ethiopia | EVs, Construction, Medical, Sanitary — Antra"
        description="Antra sources electric vehicles, construction machinery, sanitary equipment, and medical equipment for Ethiopian buyers via Djibouti Free Zone. Direct manufacturer relationships, trade finance, and after-sales support."
        keywords="construction equipment supplier Ethiopia, electric vehicle importer Ethiopia, medical equipment supplier Ethiopia, sanitary equipment Ethiopia, Djibouti Freezone Ethiopia, fleet supplier Addis Ababa"
        path="/trading"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <TradingHeroSection />
        <IntroSection />
        <ProductLinesSection />
        <KeySuppliersSection />
        <TradingClosingCTA />
      </motion.main>
    </>
  )
}
