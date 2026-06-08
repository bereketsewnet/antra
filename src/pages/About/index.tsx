import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { AboutHeroSection } from './HeroSection'
import { OurStorySection } from './OurStorySection'
import { ValuesSection } from './ValuesSection'
import { NotableClientsSection } from './NotableClientsSection'
import { HowPracticesFitSection } from './HowPracticesFitSection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: 'About Antra Business Group',
  url: 'http://antra.lula.com.et/about',
  description: 'Learn about Antra Business Group — founded in 2006 in Addis Ababa, Ethiopia. 18+ years of management consultancy and strategic trading experience.',
  publisher: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'http://antra.lula.com.et',
  },
}

export function AboutPage() {
  return (
    <>
      <SEO
        title="About Antra Business Group | Consulting & Trading Firm in Addis Ababa"
        description="Founded in 2006 in Addis Ababa. Antra Business Group combines management consulting and strategic trading. 18+ years of leadership experience across HR, operations, retail, and distribution in Ethiopia."
        keywords="Antra Business Group, Ethiopian consulting firm, Addis Ababa business consultancy, diversified business group Ethiopia"
        path="/about"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <AboutHeroSection />
        <OurStorySection />
        <ValuesSection />
        <NotableClientsSection />
        <HowPracticesFitSection />
      </motion.main>
    </>
  )
}
