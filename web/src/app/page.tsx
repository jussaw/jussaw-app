import Experience from '@/components/sections/Experience';
import Footer from '@/components/sections/Footer';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Hobbies from '@/components/sections/Hobbies';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Terminal from '@/components/sections/Terminal';
import KonamiEasterEgg from '@/components/ui/KonamiEasterEgg';
import TimelineScrollbar from '@/components/ui/TimelineScrollbar';

export default function Home() {
  return (
    <main className="min-h-screen pt-12 bg-bg">
      <Header />
      <Hero id="hero" layout="left-aligned" headingStyle="bold-sans" />
      <Skills displayMode="grouped" />
      <Experience displayMode="timeline" />
      <Projects />
      <Hobbies />
      <Terminal />
      <Footer id="footer" />
      <TimelineScrollbar />
      <KonamiEasterEgg />
    </main>
  );
}
