import { motion } from 'framer-motion'
import { SEO } from '@/components/SEO'
import { ContactFormSection } from './ContactFormSection'
import { ContactMapSection } from './MapSection'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Antra Business Group',
  url: 'https://antragroup.et/contact',
  description: 'Get in touch with Antra Business Group. We respond within one business day.',
  publisher: {
    '@type': 'Organization',
    name: 'Antra Business Group',
    url: 'https://antragroup.et',
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
        title="Contact Antra Business Group | Addis Ababa, Ethiopia"
        description="Get in touch with Antra Business Group in Addis Ababa. Management consulting or trading enquiries answered within one business day. Phone, email, and office address."
        keywords="contact Antra Business Group, business consulting contact Addis Ababa, trading company Ethiopia contact"
        path="/contact"
        jsonLd={jsonLd}
      />
      <motion.main variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <ContactFormSection />
        <ContactMapSection />
      </motion.main>
    </>
  )
}
