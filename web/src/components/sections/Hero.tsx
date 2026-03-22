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
  const { person, kit } = siteContent;
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
        {kit.length > 0 && (
          <div
            className="mt-8 pt-8 border-t inline-block"
            style={{ borderColor: "var(--color-border)" }}
          >
            <dl className="flex flex-col gap-1.5">
              {kit.map((item) => (
                <div key={item.label} className="flex items-baseline gap-3">
                  <dt
                    className="text-xs uppercase tracking-widest w-24 shrink-0"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--color-accent-muted, var(--color-accent))" }}
                  >
                    {item.label}
                  </dt>
                  <dd className="text-sm" style={{ color: "var(--color-text-primary)" }}>
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    </section>
  );
}
