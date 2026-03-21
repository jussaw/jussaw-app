'use client';

import { useEffect, type RefObject } from 'react';

interface ScrollRevealOptions {
  threshold?: number;
}

export function useScrollReveal(
  ref: RefObject<HTMLElement | null>,
  { threshold = 0.12 }: ScrollRevealOptions = {}
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('visible');
          } else {
            el.classList.remove('visible');
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
}
