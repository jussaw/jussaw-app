import type { ProjectEntry } from '@/data/content';

interface ProjectCardProps {
  project: ProjectEntry;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="rounded-[var(--card-radius,0.5rem)] border border-border border-l-2 border-l-accent bg-surface p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(196,160,178,0.1)]">
      <h3 className="text-xl font-semibold mb-1 text-text-primary">{project.title}</h3>
      <p className="text-sm mb-4 text-text-secondary">{project.description}</p>

      <ul className="mb-4 space-y-1">
        {project.highlights.map((h) => (
          <li key={h} className="text-sm flex gap-2 text-text-secondary">
            <span className="text-accent">—</span>
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-xs px-2 py-1 rounded border border-border text-text-secondary"
          >
            {s}
          </span>
        ))}
      </div>

      <div className="flex gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm hover:opacity-70 transition-opacity text-accent"
            aria-label={`Live site for ${project.title}`}
          >
            ↗ Live site
          </a>
        )}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-70 transition-opacity text-accent"
          aria-label={`GitHub for ${project.title}`}
        >
          ↗ GitHub
        </a>
      </div>
    </div>
  );
}
