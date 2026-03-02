import {
  getSeoSettings,
  getSiteContent,
  getTestimonials,
  getYoutubeVideos,
} from '@/lib/data'

export default async function JsonLd() {
  const [seo, site, testimonials, videos] = await Promise.all([
    getSeoSettings(),
    getSiteContent(),
    getTestimonials(),
    getYoutubeVideos(),
  ])

  const siteUrl = seo.siteUrl || 'https://aanyaharshavat.com'
  const authorName = site.name || 'Aanya Harshavat'

  // Person Schema
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: authorName,
    url: siteUrl,
    description: seo.personDescription || seo.metaDescription,
    jobTitle: 'Student & Author',
    sameAs: [site.linkedin, site.github].filter(Boolean),
    knowsAbout: ['Writing', 'Leadership', 'Research', 'Community Service'],
  }

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: authorName,
    url: siteUrl,
    description: seo.metaDescription,
    author: {
      '@type': 'Person',
      name: authorName,
    },
  }

  // Book Schema (CreativeWork) - from SEO settings
  const bookImage = seo.bookImage || '/og-image.png'
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: seo.bookTitle.replace(' | Aanya Harshavat', ''), // Clean title for schema
    description: seo.bookDescription,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    image: bookImage.startsWith('http') ? bookImage : `${siteUrl}${bookImage}`,
    url: `${siteUrl}/book`,
    genre: "Children's Literature",
    audience: {
      '@type': 'Audience',
      audienceType: 'Children',
    },
    inLanguage: 'en',
  }

  // Video Schema (for YouTube videos)
  const videoSchemas = videos.slice(0, 4).map((video) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || 'Educational video from KalmKids',
    thumbnailUrl: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
    uploadDate: '2025-01-01', // Approximate upload date
    contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
  }))

  // Review Schema (from testimonials)
  // Using AggregateRating with individual reviews
  const hasTestimonials = testimonials.length > 0
  const reviewSchema = hasTestimonials
    ? {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: authorName,
        url: siteUrl,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5',
          bestRating: '5',
          worstRating: '1',
          ratingCount: testimonials.length.toString(),
        },
        review: testimonials.map((t) => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: '5',
            bestRating: '5',
          },
          author: {
            '@type': 'Person',
            name: t.author,
          },
          reviewBody: t.quote,
        })),
      }
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookSchema) }}
      />
      {videoSchemas.map((videoSchema, index) => (
        <script
          key={`video-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      ))}
      {reviewSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
        />
      )}
    </>
  )
}
