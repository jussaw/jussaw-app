import { type IconType } from 'react-icons';
import { FaKeyboard, FaServer, FaGamepad, FaHiking, FaMountain } from 'react-icons/fa';

import SectionWrapper from '@/components/ui/SectionWrapper';
import { siteContent } from '@/data/content';

const hobbyIcons: Record<string, IconType> = {
  FaKeyboard,
  FaServer,
  FaGamepad,
  FaHiking,
  FaMountain,
};

export default function Hobbies() {
  const { hobbies } = siteContent;

  return (
    <SectionWrapper id="hobbies">
      <h2
        className="reveal-stagger text-3xl font-semibold mb-4 text-text-primary"
        style={{
          fontFamily: 'var(--heading-font, var(--font-sans))',
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
              className="reveal-stagger flex items-center gap-2.5 px-4 py-2.5 rounded-[var(--card-radius,0.75rem)] border bg-surface border-border"
              style={{ ['--stagger-delay' as string]: `${200 + i * 70}ms` }}
            >
              {Icon && <Icon size={18} className="text-accent" />}
              <span className="text-sm font-medium text-text-primary">{h.label}</span>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
