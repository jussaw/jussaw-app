'use client';

import Header from "@/components/sections/Header";
import TimelineScrollbar from "@/components/ui/TimelineScrollbar";
import Hero from "@/components/sections/Hero";
import Terminal from "@/components/sections/Terminal";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Hobbies from "@/components/sections/Hobbies";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen pt-12" style={{ background: "var(--color-bg)" }}>
      <Header />
      <Hero id="hero" layout="left-aligned" headingStyle="bold-sans" />
      <Skills displayMode="grouped" />
      <Terminal />
      <Experience displayMode="timeline" />
      <Projects />
      <Hobbies />
      <Footer id="footer" />
      <TimelineScrollbar />
    </main>
  );
}
