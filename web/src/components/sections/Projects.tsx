import { siteContent } from '@/data/content';
import SectionWrapper from '@/components/ui/SectionWrapper';
import ProjectCard from '@/components/ui/ProjectCard';

export default function Projects() {
  const { projects } = siteContent;

  return (
    <SectionWrapper id="projects">
      <h2
        className="text-3xl font-semibold mb-4"
        style={{
          fontFamily: 'var(--heading-font, var(--font-sans))',
          color: 'var(--color-text-primary)',
        }}
      >
        Projects
      </h2>
      <p
        className="text-base mb-8"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        Things I&apos;ve built and shipped.
      </p>
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}
