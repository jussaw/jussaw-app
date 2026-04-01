'use client';

import { useEffect, useState } from 'react';
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa';

import { siteContent } from '@/data/content';

export default function Header() {
  const { person } = siteContent;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass =
    'flex items-center transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none rounded-sm hover:-translate-y-0.5';

  return (
    <>
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none z-[9] h-[120px]"
        style={{
          background: 'linear-gradient(to bottom, var(--color-bg) 30%, transparent 100%)',
        }}
      />
      <header
        className={`fixed top-0 left-0 right-0 z-10 flex justify-end items-center gap-6 px-6 py-3 transition-all duration-300 border-b ${scrolled ? 'bg-black/60 backdrop-blur-md border-white/5' : 'border-transparent'}`}
      >
        <a
          href={`mailto:${person.email}`}
          aria-label="Email"
          className={`${linkClass} text-text-secondary hover:text-accent`}
        >
          <FaEnvelope size={18} />
        </a>
        <a
          href={person.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          className={`${linkClass} text-text-secondary hover:text-accent`}
        >
          <FaLinkedin size={18} />
        </a>
        <a
          href={person.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={`${linkClass} text-text-secondary hover:text-accent`}
        >
          <FaGithub size={18} />
        </a>
      </header>
    </>
  );
}
