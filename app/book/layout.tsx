import type { Metadata } from 'next'
import { getSeoSettings } from '@/lib/data'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings()
  const siteUrl = seo.siteUrl || 'https://aanyaharshavat.com'

  return {
    title: seo.bookTitle,
    description: seo.bookDescription,
    alternates: {
      canonical: '/book',
    },
    openGraph: {
      title: seo.bookTitle,
      description: seo.bookDescription,
      type: 'website',
      url: `${siteUrl}/book`,
      siteName: 'Aanya Harshavat',
      locale: 'en_US',
      images: [
        {
          url: seo.bookImage || seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.bookTitle,
        },
      ],
    },
  }
}

export default function BookLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
