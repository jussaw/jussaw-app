'use client';

import { useRef } from 'react';
import { siteContent } from "@/data/content";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface HeroProps {
  id?: string;
  layout?: "centered" | "left-aligned";
  headingStyle?: "serif-elegant" | "bold-sans" | "mono-minimal";
}

export default function Hero({ id, layout = "centered", headingStyle = "serif-elegant" }: HeroProps) {
  const { person } = siteContent;
  const ref = useRef<HTMLDivElement>(null);
  useScrollReveal(ref);

  const headingFont =
    headingStyle === "serif-elegant"
      ? "var(--font-serif)"
      : headingStyle === "mono-minimal"
      ? "var(--font-mono)"
      : "var(--font-sans)";

  const headingWeight =
    headingStyle === "bold-sans" ? "800" : "600";

  const isCenter = layout === "centered";

  return (
    <section
      id={id}
      className={`px-6 pt-[40vh] pb-24 max-w-4xl mx-auto w-full ${isCenter ? "text-center" : "text-left"}`}
    >
      <div
        ref={ref}
        className="reveal"
        style={{ transitionDelay: '150ms' }}
      >
        <h1
          className="text-6xl md:text-7xl mb-1 leading-tight"
          style={{
            fontFamily: headingFont,
            fontWeight: headingWeight,
            color: "var(--color-text-primary)",
          }}
        >
          {person.name}
        </h1>
        <div className="mb-6">
          <span
            className="text-sm font-medium uppercase tracking-widest"
            style={{
              color: "var(--color-accent)",
            }}
          >
            {person.title}
          </span>
        </div>
        <p
          className={`text-xl leading-relaxed max-w-2xl ${isCenter ? "mx-auto" : ""}`}
          style={{ color: "var(--color-text-secondary)" }}
        >
          {person.tagline}
        </p>
        <div className={`mt-10 flex gap-4 ${isCenter ? "justify-center" : "justify-start"}`}>
          <a
            href={`mailto:${person.email}`}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--color-accent)",
              color: "#fff",
            }}
          >
            Get in touch
          </a>
          <a
            href={person.github}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-medium border transition-colors hover:opacity-80"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-text-primary)",
              background: "var(--color-surface)",
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
