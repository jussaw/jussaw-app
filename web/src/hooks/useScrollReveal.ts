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

    const showInstant = () => {
      el.classList.add('no-transition', 'visible');
      requestAnimationFrame(() => el.classList.remove('no-transition'));
    };

    const hideInstant = () => {
      el.classList.add('no-transition');
      el.classList.remove('visible');
      requestAnimationFrame(() => el.classList.remove('no-transition'));
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const fromBottom = entry.boundingClientRect.top >= 0;
          if (entry.isIntersecting) {
            if (fromBottom) {
              el.classList.add('visible'); // scrolling down — animate
            } else {
              showInstant(); // scrolling up — show without animation
            }
          } else {
            if (fromBottom) {
              hideInstant(); // scrolled back up past it — reset for re-animation
            }
            // scrolled down past it — leave visible
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, threshold]);
}
