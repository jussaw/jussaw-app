'use client';

import { useRef, useEffect, useState } from 'react';

import { siteContent } from '@/data/content';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { getFontFamily, HeadingStyle } from '@/utils/fonts';

interface HeroProps {
  id?: string;
  layout?: 'centered' | 'left-aligned';
  headingStyle?: HeadingStyle;
}

export default function Hero({
  id,
  layout = 'centered',
  headingStyle = 'serif-elegant',
}: HeroProps) {
  const { person, kit } = siteContent;
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  const [showScroll, setShowScroll] = useState(false);

  const headingFont = getFontFamily(headingStyle);

  const headingWeight = headingStyle === 'bold-sans' ? '800' : '600';

  const isCenter = layout === 'centered';

  useEffect(() => {
    const timer = setTimeout(() => setShowScroll(true), 3600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id={id}
      className={`px-6 pt-[40vh] pb-24 max-w-4xl mx-auto w-full ${isCenter ? 'text-center' : 'text-left'}`}
    >
      <div ref={ref} className="reveal">
        <h1
          className="reveal-stagger text-6xl md:text-7xl mb-1 leading-tight text-text-primary"
          style={{
            fontFamily: headingFont,
            fontWeight: headingWeight,
            ['--stagger-delay' as string]: '0ms',
          }}
        >
          {person.name}
        </h1>
        <div className="mb-6">
          <span
            className="reveal-stagger text-sm font-medium uppercase tracking-widest text-accent"
            style={{ ['--stagger-delay' as string]: '100ms' }}
          >
            {person.title.split(' | ').map((part, i) => (
              <span key={i}>
                {i > 0 && (
                  <>
                    <span className="hidden sm:inline"> | </span>
                    <br className="sm:hidden" />
                  </>
                )}
                {part}
              </span>
            ))}
          </span>
        </div>
        {kit.length > 0 && (
          <div
            className="reveal-stagger mt-8 pt-8 border-t border-border inline-block"
            style={{ ['--stagger-delay' as string]: '340ms' }}
          >
            <dl className="flex flex-col gap-1.5">
              {kit.map((item) => (
                <div key={item.label} className="flex items-baseline gap-3">
                  <dt
                    className="text-xs uppercase tracking-widest w-24 shrink-0 font-mono"
                    style={{
                      color: 'var(--color-accent-muted, var(--color-accent))',
                    }}
                  >
                    {item.label}
                  </dt>
                  <dd className="text-sm text-text-primary">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Scroll-down indicator */}
        <div className={`scroll-indicator mt-14 text-text-secondary ${showScroll ? 'show' : ''}`}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 10l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
