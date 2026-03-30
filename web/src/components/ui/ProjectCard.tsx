import type { ProjectEntry } from '@/data/content';

interface ProjectCardProps {
  project: ProjectEntry;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="rounded-[var(--card-radius,0.5rem)] border p-6 transition-all duration-300 hover:-translate-y-0.5"
      style={{
        background: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        borderLeft: '2px solid var(--color-accent)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(196, 160, 178, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <h3
        className="text-xl font-semibold mb-1"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {project.title}
      </h3>
      <p
        className="text-sm mb-4"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {project.description}
      </p>

      <ul className="mb-4 space-y-1">
        {project.highlights.map((h) => (
          <li
            key={h}
            className="text-sm flex gap-2"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <span style={{ color: 'var(--color-accent)' }}>—</span>
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mb-5">
        {project.stack.map((s) => (
          <span
            key={s}
            className="text-xs px-2 py-1 rounded border"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-secondary)',
            }}
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
            className="text-sm hover:opacity-70 transition-opacity"
            aria-label={`Live site for ${project.title}`}
            style={{ color: 'var(--color-accent)' }}
          >
            ↗ Live site
          </a>
        )}
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:opacity-70 transition-opacity"
          aria-label={`GitHub for ${project.title}`}
          style={{ color: 'var(--color-accent)' }}
        >
          ↗ GitHub
        </a>
      </div>
    </div>
  );
}
