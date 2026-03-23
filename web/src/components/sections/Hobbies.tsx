import { FaKeyboard, FaServer, FaGamepad, FaHiking, FaMountain } from 'react-icons/fa';
import { type IconType } from 'react-icons';
import { siteContent } from "@/data/content";
import SectionWrapper from "@/components/ui/SectionWrapper";

const hobbyIcons: Record<string, IconType> = {
  FaKeyboard, FaServer, FaGamepad, FaHiking, FaMountain,
};

export default function Hobbies() {
  const { hobbies } = siteContent;

  return (
    <SectionWrapper id="hobbies">
      <h2
        className="reveal-stagger text-3xl font-semibold mb-4"
        style={{
          fontFamily: "var(--heading-font, var(--font-sans))",
          color: "var(--color-text-primary)",
          ['--stagger-delay' as string]: '0ms',
        }}
      >
        Outside of Work
      </h2>
      <div className="flex flex-wrap gap-3 mt-8">
        {hobbies.map((h, i) => {
          const Icon = hobbyIcons[h.icon];
          return (
            <div
              key={h.label}
              className="reveal-stagger flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--card-radius,0.75rem)] border"
              style={{
                background: "var(--color-surface)",
                borderColor: "var(--color-border)",
                ['--stagger-delay' as string]: `${200 + i * 70}ms`,
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
