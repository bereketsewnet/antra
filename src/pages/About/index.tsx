import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { AboutHeroSection } from './HeroSection'
import { OurStorySection } from './OurStorySection'
import { MissionSection } from './MissionSection'
import { ValuesSection } from './ValuesSection'
import { AboutMapSection } from './MapSection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Antra Business Group',
  url: 'https://antragroup.et/about',
  description: 'Learn about Antra Business Group — a diversified business group in Addis Ababa, Ethiopia, combining management consultancy and strategic trading led by a senior team with deep leadership experience.',
  publisher: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'https://antragroup.et',
  },
}

export function AboutPage() {
  return (
    <>
      <SEO
        title="About Antra Business Group | Consulting & Trading Firm in Addis Ababa"
        description="Antra Business Group in Addis Ababa combines management consulting and strategic trading, led by a senior team with deep leadership experience across HR, operations, retail, and distribution in Ethiopia."
        keywords="Antra Business Group, Ethiopian consulting firm, Addis Ababa business consultancy, diversified business group Ethiopia"
        path="/about"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <AboutHeroSection />
        <OurStorySection />
        <MissionSection />
        <ValuesSection />
        <AboutMapSection />
      </motion.main>
    </>
  )
}
