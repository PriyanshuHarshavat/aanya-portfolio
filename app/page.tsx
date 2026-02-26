import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Achievements from './components/Achievements';
import Book from './components/Book';
import Videos from './components/Videos';
import Activities from './components/Activities';
import Skills from './components/Skills';
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
        <Activities />
        <Skills />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ViewportToggle />
    </>
  );
}
