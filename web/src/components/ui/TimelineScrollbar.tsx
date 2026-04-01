'use client';

import { useState, useEffect } from 'react';

import { useActiveSection, SECTIONS } from '@/hooks/useActiveSection';

function gaussian(dist: number, sigma = 1.0): number {
  return Math.exp(-(dist * dist) / (2 * sigma * sigma));
}

function computeMetrics(activeIndex: number, totalHeight: number) {
  const N = SECTIONS.length;
  const weights = SECTIONS.map((_, i) => gaussian(Math.abs(i - activeIndex)));

  const dotSize = weights.map((w) => 6 + 8 * w);
  const labelOpacity = weights.map((w) => Math.max(0, Math.min(1, (w - 0.05) / 0.95)));
  const spacingWeight = weights.map((w) => 1 + 2 * w);

  const segWeights: number[] = [];
  for (let i = 0; i < N - 1; i += 1) {
    segWeights.push(spacingWeight[i] + spacingWeight[i + 1]);
  }
  const totalW = segWeights.reduce((a, b) => a + b, 0);

  const dotY: number[] = [0];
  for (let i = 0; i < N - 1; i += 1) {
    dotY.push(dotY[i] + (totalHeight * segWeights[i]) / totalW);
  }

  return { dotSize, labelOpacity, dotY, weights };
}

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function TimelineScrollbar() {
  const activeIndex = useActiveSection();
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [totalHeight, setTotalHeight] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const update = () => setTotalHeight(window.innerHeight * 0.5);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const { dotSize, dotY, weights } = computeMetrics(activeIndex, totalHeight);
  const duration = reducedMotion ? '0ms' : '0.35s';
  const spring = `cubic-bezier(0.34, 1.56, 0.64, 1)`;

  // dotY[i] is already the center of each dot row (translateY(-50%) centers the row on dotY[i]).
  // Add 20 to account for the 20px gap at the top created by alignItems:'flex-end' on the outer container.
  const dotYOffset = 20;
  const firstDotCenter = dotY[0] + dotYOffset;
  const lastDotCenter = dotY[SECTIONS.length - 1] + dotYOffset;

  return (
    <nav
      aria-label="Page sections"
      className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:flex"
      style={{
        zIndex: 8,
        width: '100px',
        alignItems: 'flex-end',
        height: `${totalHeight + 20}px`,
      }}
    >
      {/* Vertical connecting line */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '7px',
          top: `${firstDotCenter}px`,
          height: `${lastDotCenter - firstDotCenter}px`,
          width: '1px',
          background: 'var(--color-border)',
          transition: `top ${duration} ${spring}, height ${duration} ${spring}`,
        }}
      />

      {/* Dot rows */}
      <div
        style={{
          position: 'relative',
          width: '100px',
          height: `${totalHeight}px`,
        }}
      >
        {SECTIONS.map((section, i) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            aria-label={`Scroll to ${section.label}`}
            className="bg-transparent border-none p-0"
            style={{
              position: 'absolute',
              top: `${dotY[i]}px`,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transform: 'translateY(-50%)',
              transition: `top ${duration} ${spring}`,
              cursor: 'pointer',
            }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Label */}
            <span
              style={{
                opacity: i === activeIndex || i === hoveredIndex ? 1 : 0,
                transition: `opacity 0.3s ease`,
                fontSize: '10px',
                letterSpacing: '0.06em',
                color: i === activeIndex ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                fontWeight: i === activeIndex ? 600 : 400,
                whiteSpace: 'nowrap',
                textAlign: 'right',
                userSelect: 'none',
              }}
            >
              {section.label}
            </span>

            {/* Dot — fixed-width wrapper keeps all dot centers on the same x axis as the line */}
            <div
              style={{
                width: '14px',
                height: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: `${i === hoveredIndex && i !== activeIndex ? dotSize[i] + 3 : dotSize[i]}px`,
                  height: `${i === hoveredIndex && i !== activeIndex ? dotSize[i] + 3 : dotSize[i]}px`,
                  borderRadius: '50%',
                  background:
                    i === activeIndex ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                  opacity: i === activeIndex ? 1 : 0.3 + 0.5 * weights[i],
                  transition: `width ${duration} ${spring}, height ${duration} ${spring}, background 0.3s ease, opacity 0.3s ease`,
                }}
              />
            </div>
          </button>
        ))}
      </div>
    </nav>
  );
}
