'use client';

import { useEffect, useState } from 'react';

import Experience from '@/components/sections/Experience';
import Footer from '@/components/sections/Footer';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import Hobbies from '@/components/sections/Hobbies';
import Projects from '@/components/sections/Projects';
import Skills from '@/components/sections/Skills';
import Terminal from '@/components/sections/Terminal';
import TimelineScrollbar from '@/components/ui/TimelineScrollbar';
import { useKonamiCode } from '@/hooks/useKonamiCode';

interface Particle {
  angle: number;
  distance: number;
  size: number;
  hue: number;
  delay: number;
  isRound: boolean;
  x: string;
  y: string;
}

function generateParticles(): Particle[] {
  return Array.from({ length: 30 }, (_, i) => {
    const angle = (i / 30) * 360;
    const distance = 80 + Math.random() * 200;
    return {
      angle,
      distance,
      size: 4 + Math.random() * 8,
      hue: Math.random() * 360,
      delay: Math.random() * 0.3,
      isRound: Math.random() > 0.5,
      x: `${Math.cos((angle * Math.PI) / 180) * distance}px`,
      y: `${Math.sin((angle * Math.PI) / 180) * distance}px`,
    };
  });
}

export default function Home() {
  const konamiActivated = useKonamiCode();
  const [dismissed, setDismissed] = useState(false);
  const [particles] = useState<Particle[]>(generateParticles);

  const showEasterEgg = konamiActivated && !dismissed;

  useEffect(() => {
    if (!konamiActivated) return undefined;
    const timer = setTimeout(() => setDismissed(true), 4000);
    return () => clearTimeout(timer);
  }, [konamiActivated]);

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

      {/* Konami Code Easter Egg */}
      {showEasterEgg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ pointerEvents: 'none' }}
        >
          {/* Particle burst */}
          {particles.map((p, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: p.isRound ? '50%' : '2px',
                background: `hsl(${p.hue}, 80%, 65%)`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `konami-particle 1.5s ease-out ${p.delay}s forwards`,
                ['--particle-x' as string]: p.x,
                ['--particle-y' as string]: p.y,
                opacity: 0,
              }}
            />
          ))}

          {/* Message */}
          <div
            className="text-center font-mono"
            style={{ animation: 'konami-text 3s ease-out forwards' }}
          >
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-2">
              Achievement Unlocked
            </p>
            <p className="text-2xl font-bold text-text-primary">↑↑↓↓←→←→BA</p>
          </div>
        </div>
      )}

      {/* Konami CSS animations */}
      <style>{`
        @keyframes konami-particle {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(-50% + var(--particle-x)),
              calc(-50% + var(--particle-y))
            ) scale(1);
            opacity: 0;
          }
        }
        @keyframes konami-text {
          0% { opacity: 0; transform: scale(0.5); }
          15% { opacity: 1; transform: scale(1.1); }
          25% { transform: scale(1); }
          80% { opacity: 1; }
          100% { opacity: 0; transform: scale(0.95); }
        }
      `}</style>
    </main>
  );
}
