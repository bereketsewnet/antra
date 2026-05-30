import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { AboutHeroSection } from './HeroSection'
import { OurStorySection } from './OurStorySection'
import { ValuesSection } from './ValuesSection'
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
        title="About Us"
        description="Founded in 2006 in Addis Ababa. Antra Business Group combines management consultancy and strategic trading under one roof — because our clients need both. 18+ years of leadership experience in Ethiopia."
        path="/about"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <AboutHeroSection />
        <OurStorySection />
        <ValuesSection />
        <HowPracticesFitSection />
      </motion.main>
    </>
  )
}
