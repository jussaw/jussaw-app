import SectionWrapper from '@/components/ui/SectionWrapper';
import SkillBadge from '@/components/ui/SkillBadge';
import { siteContent } from '@/data/content';

interface SkillsProps {
  displayMode?: 'grid' | 'grouped';
}

export default function Skills({ displayMode = 'grid' }: SkillsProps) {
  const { skills } = siteContent;

  const categories = ['frontend', 'backend', 'language', 'database', 'devops'] as const;
  const categoryLabels: Record<string, string> = {
    frontend: 'Frontend',
    backend: 'Backend',
    language: 'Languages',
    database: 'Databases',
    devops: 'DevOps & Infra',
  };

  return (
    <SectionWrapper id="skills">
      <h2
        className="reveal-stagger text-3xl font-semibold mb-10"
        style={{
          fontFamily: 'var(--heading-font, var(--font-sans))',
          color: 'var(--color-text-primary)',
          ['--stagger-delay' as string]: '0ms',
        }}
      >
        Skills
      </h2>
      {displayMode === 'grouped' ? (
        <div className="space-y-6">
          {categories.map((cat, i) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (!catSkills.length) return null;
            return (
              <div
                key={cat}
                className="reveal-stagger"
                style={{ ['--stagger-delay' as string]: `${100 + i * 120}ms` }}
              >
                <p
                  className="text-xs uppercase tracking-widest mb-3"
                  style={{
                    color:
                      'var(--color-accent-3, var(--color-accent-2, var(--color-text-secondary)))',
                  }}
                >
                  {categoryLabels[cat]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((s) => (
                    <SkillBadge key={s.name} skill={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="reveal-stagger flex flex-wrap gap-2.5"
          style={{ ['--stagger-delay' as string]: '100ms' }}
        >
          {skills.map((s) => (
            <SkillBadge key={s.name} skill={s} />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
}
