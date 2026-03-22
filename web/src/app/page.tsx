'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/sections/Header";
import TimelineScrollbar from "@/components/ui/TimelineScrollbar";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Hobbies from "@/components/sections/Hobbies";
import Footer from "@/components/sections/Footer";
import Terminal from "@/components/ui/Terminal";

export default function Home() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === '~') setTerminalOpen(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <main className="min-h-screen pt-12" style={{ background: "var(--color-bg)" }}>
      <Header />
      <Hero id="hero" layout="left-aligned" headingStyle="bold-sans" />
      <Skills displayMode="grouped" />
      <Experience displayMode="timeline" />
      <Projects />
      <Hobbies />
      <Footer id="footer" />
      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
      <TimelineScrollbar />
    </main>
  );
}
