import { Hero } from '@/components/sections/Hero';
import { Services } from '@/components/sections/Services';
import { Projects } from '@/components/sections/Projects';
import { About } from '@/components/sections/About';
import { Team } from '@/components/sections/Team';
import { Events } from '@/components/sections/Events';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/sections/Footer';

export function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <About />
      <Team />
      <Events />
      <Contact />
      <Footer />
    </>
  );
}

