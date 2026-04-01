'use client';

import { useRef } from 'react';

import type { ExperienceEntry } from '@/data/content';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ExperienceCardProps {
  entry: ExperienceEntry;
  displayMode?: 'cards' | 'timeline' | 'minimal-text';
}

function TimelineCard({ entry }: { entry: ExperienceEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return (
    <div ref={ref} className="reveal relative pl-8 pb-10">
      <div className="absolute left-0 top-2 bottom-0 w-px bg-border" />
      <div className="absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full border-2 bg-bg border-accent" />
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3 className="text-lg font-semibold text-text-primary">{entry.role}</h3>
        <span className="text-sm font-medium text-accent-2">{entry.company}</span>
      </div>
      <p className="text-sm mb-3 text-text-secondary">
        {entry.period} · {entry.location}
      </p>
      <ul className="space-y-1.5">
        {entry.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-text-secondary">
            <span className="shrink-0 text-accent">•</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MinimalCard({ entry }: { entry: ExperienceEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return (
    <div ref={ref} className="reveal pb-8 border-b border-border last:border-b-0">
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3 className="text-lg font-semibold text-text-primary">{entry.role}</h3>
        <span className="text-sm text-accent-2">{entry.company}</span>
      </div>
      <p className="text-xs uppercase tracking-wide mb-3 text-text-secondary">
        {entry.period} · {entry.location}
      </p>
      <ul className="space-y-1">
        {entry.bullets.map((b, i) => (
          <li key={i} className="text-sm leading-relaxed text-text-secondary">
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

function CardsCard({ entry }: { entry: ExperienceEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);
  return (
    <div
      ref={ref}
      className="reveal p-6 rounded-[var(--card-radius,0.75rem)] border bg-surface border-border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(196,160,178,0.1)]"
    >
      <div className="mb-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <h3 className="text-lg font-semibold text-text-primary">{entry.role}</h3>
        <span className="text-sm font-medium text-accent-2">{entry.company}</span>
      </div>
      <p className="text-xs uppercase tracking-wide mb-4 text-text-secondary">
        {entry.period} · {entry.location}
      </p>
      <ul className="space-y-1.5">
        {entry.bullets.map((b, i) => (
          <li key={i} className="flex gap-2 text-sm text-text-secondary">
            <span className="shrink-0 text-accent">•</span>
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceCard({ entry, displayMode = 'cards' }: ExperienceCardProps) {
  if (displayMode === 'timeline') return <TimelineCard entry={entry} />;
  if (displayMode === 'minimal-text') return <MinimalCard entry={entry} />;
  return <CardsCard entry={entry} />;
}
