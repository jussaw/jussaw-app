import { siteContent } from "@/data/content";
import ExperienceCard from "@/components/ui/ExperienceCard";
import SectionWrapper from "@/components/ui/SectionWrapper";

interface ExperienceProps {
  displayMode?: "cards" | "timeline" | "minimal-text";
}

export default function Experience({ displayMode = "cards" }: ExperienceProps) {
  const { experience } = siteContent;

  return (
    <SectionWrapper id="experience">
      <h2
        className="text-3xl font-semibold mb-10"
        style={{
          fontFamily: "var(--heading-font, var(--font-sans))",
          color: "var(--color-text-primary)",
        }}
      >
        Experience
      </h2>
      <div className={displayMode === "cards" ? "space-y-4" : ""}>
        {experience.map((entry, i) => (
          <ExperienceCard key={i} entry={entry} displayMode={displayMode} />
        ))}
      </div>
    </SectionWrapper>
  );
}
