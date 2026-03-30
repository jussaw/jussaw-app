import type { Skill } from "@/data/content";

interface SkillBadgeProps {
  skill: Skill;
}

export default function SkillBadge({ skill }: SkillBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 hover:scale-[1.04] cursor-default"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-primary)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--color-accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {skill.name}
    </span>
  );
}
