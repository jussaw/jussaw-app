import ProjectCard from '@/components/ui/ProjectCard';
import SectionWrapper from '@/components/ui/SectionWrapper';
import { siteContent } from '@/data/content';

export default function Projects() {
  const { projects } = siteContent;

  return (
    <SectionWrapper id="projects">
      <h2
        className="text-3xl font-semibold mb-8 text-text-primary"
        style={{ fontFamily: 'var(--heading-font, var(--font-sans))' }}
      >
        Projects
      </h2>
      <div className="flex flex-col gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </SectionWrapper>
  );
}
