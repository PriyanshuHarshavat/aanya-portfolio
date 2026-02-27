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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Achievements />
        <Book />
        <Videos />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      {process.env.NODE_ENV === 'development' && <ViewportToggle />}
    </>
  );
}
