import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aanya Harshavat | Author, Scholar, Changemaker",
  description: "High school sophomore and published author passionate about making an impact through writing, leadership, and innovation.",
  keywords: ["Aanya Harshavat", "student portfolio", "published author", "high school", "leadership"],
  authors: [{ name: "Aanya Harshavat" }],
  openGraph: {
    title: "Aanya Harshavat | Author, Scholar, Changemaker",
    description: "High school sophomore and published author passionate about making an impact.",
    type: "website",
  },
};

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
        {children}
      </body>
    </html>
  );
}
