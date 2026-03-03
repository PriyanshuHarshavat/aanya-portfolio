import {
  getSeoSettings,
  getSiteContent,
  getYoutubeVideos,
} from '@/lib/data'

export default async function JsonLd() {
  const [seo, site, videos] = await Promise.all([
    getSeoSettings(),
    getSiteContent(),
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

  // Book Schema - just showcasing the accomplishment
  const bookImage = seo.bookImage || '/og-image.png'
  const bookSchema = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: seo.bookTitle.replace(' | Aanya Harshavat', ''),
    description: seo.bookDescription,
    author: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    image: bookImage.startsWith('http') ? bookImage : `${siteUrl}${bookImage}`,
    url: `${siteUrl}/book`,
    genre: "Children's Literature",
    inLanguage: 'en',
  }

  // Video Schema (for YouTube videos)
  const videoSchemas = videos.slice(0, 4).map((video) => ({
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.title,
    description: video.description || 'Educational video from KalmKids',
    thumbnailUrl: `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`,
    uploadDate: '2025-01-01',
    contentUrl: `https://www.youtube.com/watch?v=${video.videoId}`,
    embedUrl: `https://www.youtube.com/embed/${video.videoId}`,
    publisher: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
  }))

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
    </>
  )
}
