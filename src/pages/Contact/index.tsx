import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { ContactFormSection } from './ContactFormSection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Antra Business Group',
  url: 'http://antra.lula.com.et/contact',
  description: 'Get in touch with Antra Business Group. We respond within one business day.',
  publisher: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'http://antra.lula.com.et',
    telephone: '+251-951-77-97-77',
    email: 'info@antragroup.et',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Addis Ababa',
      addressCountry: 'ET',
    },
  },
}

export function ContactPage() {
  return (
    <>
      <SEO
        title="Contact"
        description="Get in touch with Antra Business Group. Tell us what you are working on — management consultancy or trading and supply. We respond within one business day. Based in Addis Ababa, Ethiopia."
        path="/contact"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ContactFormSection />
      </motion.main>
    </>
  )
}
