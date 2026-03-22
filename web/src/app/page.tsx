'use client';

import { useState } from 'react';
import Header from "@/components/sections/Header";
import TimelineScrollbar from "@/components/ui/TimelineScrollbar";
import Hero from "@/components/sections/Hero";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Hobbies from "@/components/sections/Hobbies";
import Footer from "@/components/sections/Footer";
import SetupDrawer from "@/components/ui/SetupDrawer";

export default function Home() {
  const [setupOpen, setSetupOpen] = useState(false);

  return (
    <main className="min-h-screen pt-12" style={{ background: "var(--color-bg)" }}>
      <Header />
      <Hero id="hero" layout="left-aligned" headingStyle="bold-sans" />
      <Skills displayMode="grouped" />
      <Experience displayMode="timeline" />
      <Projects />
      <Hobbies />
      <Footer id="footer" onOpenSetup={() => setSetupOpen(true)} />
      <SetupDrawer open={setupOpen} onClose={() => setSetupOpen(false)} />
      <TimelineScrollbar />
    </main>
  );
}
