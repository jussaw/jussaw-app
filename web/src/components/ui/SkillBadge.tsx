import type { Skill } from "@/data/content";

interface SkillBadgeProps {
  skill: Skill;
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-colors"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-primary)",
      }}
    >
      {skill.name}
    </span>
  );
}
