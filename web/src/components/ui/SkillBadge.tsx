import type { Skill } from '@/data/content';

interface SkillBadgeProps {
  skill: Skill;
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border bg-surface border-border text-text-primary transition-all duration-200 hover:scale-[1.04] hover:border-accent cursor-default">
      {skill.name}
    </span>
  );
}
