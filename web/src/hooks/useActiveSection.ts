'use client';

import { useState, useEffect, useRef } from 'react';

export const SECTIONS = [
  { id: 'hero', label: 'jussaw' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'terminal', label: 'Terminal' },
] as const;

export function useActiveSection(): number {
  const [activeIndex, setActiveIndex] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    const getActive = (): number => {
      // The trigger line sits 40% down from the top of the viewport.
      // The last section whose top is at or above this line is the active one.
      const triggerLine = window.scrollY + window.innerHeight * 0.4;
      let active = 0;
      SECTIONS.forEach(({ id }, i) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= triggerLine) active = i;
      });
      const atBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (atBottom) active = SECTIONS.length - 1;
      return active;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setActiveIndex(getActive());
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return activeIndex;
}
