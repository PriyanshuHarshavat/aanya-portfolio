import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import JsonLd from "./components/JsonLd";
import { getSeoSettings } from "@/lib/data";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const keywords = seo.metaKeywords.split(',').map(k => k.trim()).filter(Boolean);
  const siteUrl = seo.siteUrl || 'https://aanyaharshavat.com';

  return {
    title: {
      default: seo.metaTitle,
      template: "%s | Aanya Harshavat",
    },
    description: seo.metaDescription,
    keywords,
    authors: [{ name: "Aanya Harshavat" }],
    creator: "Aanya Harshavat",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: "/",
    },
    icons: seo.favicon ? {
      icon: seo.favicon,
      apple: seo.favicon,
    } : undefined,
    openGraph: {
      title: seo.metaTitle,
      description: seo.metaDescription,
      type: "website",
      url: siteUrl,
      siteName: "Aanya Harshavat",
      locale: "en_US",
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: seo.metaTitle,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${plusJakarta.variable} antialiased`}
      >
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
