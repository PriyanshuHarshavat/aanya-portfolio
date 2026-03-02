import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Book from './components/Book';
import Videos from './components/Videos';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ViewportToggle from './components/ViewportToggle';

import {
  getSiteContent,
  getHeroContent,
  getAboutContent,
  getAchievements,
  getGalleryImages,
  getTestimonials,
  getYoutubeVideos,
  getYoutubeSection,
} from '@/lib/data';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  // Fetch all data in parallel
  const [
    siteContent,
    heroContent,
    aboutContent,
    achievements,
    galleryImages,
    testimonials,
    youtubeVideos,
    youtubeSection,
  ] = await Promise.all([
    getSiteContent(),
    getHeroContent(),
    getAboutContent(),
    getAchievements(),
    getGalleryImages(),
    getTestimonials(),
    getYoutubeVideos(),
    getYoutubeSection(),
  ]);

  return (
    <>
      <Header />
      <main>
        <Hero siteContent={siteContent} heroContent={heroContent} />
        <About siteContent={siteContent} aboutContent={aboutContent} />
        <Achievements achievements={achievements} />
        <Book galleryImages={galleryImages} />
        <Videos videos={youtubeVideos} section={youtubeSection} />
        <Testimonials testimonials={testimonials} />
        <Contact />
      </main>
      <Footer />
      {process.env.NODE_ENV === 'development' && <ViewportToggle />}
    </>
  );
}
