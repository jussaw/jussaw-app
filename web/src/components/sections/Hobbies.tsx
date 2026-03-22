import { Keyboard, Server, Gamepad2, Footprints, MountainSnow, type LucideIcon } from 'lucide-react';
import { siteContent } from "@/data/content";
import SectionWrapper from "@/components/ui/SectionWrapper";

const hobbyIcons: Record<string, LucideIcon> = {
  Keyboard, Server, Gamepad2, Footprints, MountainSnow,
};

export default function Hobbies() {
  const { hobbies } = siteContent;

  return (
    <SectionWrapper id="hobbies" className="mb-36">
      <h2
        className="text-3xl font-semibold mb-4"
        style={{
          fontFamily: "var(--heading-font, var(--font-sans))",
          color: "var(--color-text-primary)",
        }}
      >
        Outside of Work
      </h2>
      <p
        className="text-base mb-8"
        style={{ color: "var(--color-text-secondary)" }}
      >
        A few things that keep me grounded when I&apos;m not writing code.
      </p>
      <div className="flex flex-wrap gap-3">
        {hobbies.map((h) => {
          const Icon = hobbyIcons[h.icon];
          return (
            <div
              key={h.label}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--card-radius,0.75rem)] border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              {Icon && <Icon size={18} style={{ color: "var(--color-accent)" }} />}
              <span
                className="text-sm font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {h.label}
              </span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
