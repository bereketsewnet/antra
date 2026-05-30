import { Helmet } from 'react-helmet-async'

const SITE_URL = 'http://antra.lula.com.et'
const SITE_NAME = 'Antra Business Group'
const DEFAULT_IMAGE = `${SITE_URL}/assets/global/og-default.webp`

interface SEOProps {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  jsonLd?: object
}

export function SEO({ title, description, path, image = DEFAULT_IMAGE, type = 'website', jsonLd }: SEOProps) {
  const canonicalUrl = `${SITE_URL}${path}`
  const fullTitle = path === '/' ? `${SITE_NAME} — Management Consultancy & Trading` : `${title} | ${SITE_NAME}`

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo / region (Ethiopia) */}
      <meta name="geo.region" content="ET" />
      <meta name="geo.placename" content="Addis Ababa" />

      {/* JSON-LD */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
