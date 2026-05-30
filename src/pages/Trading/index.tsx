import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { TradingHeroSection } from './HeroSection'
import { ProductLinesSection } from './ProductLinesSection'
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
  url: 'http://antra.lula.com.et/trading',
  description: 'Strategic trading and supply of electric vehicles, construction machinery, sanitary fittings, and medical equipment for Ethiopian buyers via Djibouti Free Zone.',
  provider: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'http://antra.lula.com.et',
  },
  areaServed: {
    '@type': 'Place',
    name: 'Ethiopia',
  },
  serviceType: [
    'Electric Vehicle Supply',
    'Construction Machinery',
    'Sanitary Fittings',
    'Medical Equipment',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Product Lines',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Electric Vehicles' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Construction Machinery' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Sanitary Fittings' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Product', name: 'Medical Equipment' } },
    ],
  },
}

export function TradingPage() {
  return (
    <>
      <SEO
        title="Trading & Supply"
        description="Antra sources electric vehicles, construction machinery, sanitary fittings, and medical equipment for Ethiopian buyers. Consistent, technically capable supply via Djibouti Free Zone. 1 business day response."
        path="/trading"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <TradingHeroSection />
        <ProductLinesSection />
        <TradingClosingCTA />
      </motion.main>
    </>
  )
}
