'use client';

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface SectionWrapperProps {
  id?: string;
  children: React.ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, children, className = "" }: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section
      ref={ref}
      id={id}
      className={`reveal px-6 py-20 max-w-4xl mx-auto w-full ${className}`}
    >
      {children}
    </section>
  );
}
