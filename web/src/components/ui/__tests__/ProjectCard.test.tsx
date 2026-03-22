import { render, screen } from '@testing-library/react';
import ProjectCard from '../ProjectCard';
import type { ProjectEntry } from '@/data/content';

const mockProject: ProjectEntry = {
  title: "test-project",
  description: "A test project",
  highlights: ["Feature A", "Feature B"],
  stack: ["React", "TypeScript"],
  liveUrl: "https://example.com",
  githubUrl: "https://github.com/example/test",
};

describe('ProjectCard', () => {
  it('renders the project title', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('test-project')).toBeInTheDocument();
  });

  it('renders the project description', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('A test project')).toBeInTheDocument();
  });

  it('renders all highlight bullets', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });

  it('renders all stack badges', () => {
    render(<ProjectCard project={mockProject} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('renders live site and github links with correct hrefs', () => {
    render(<ProjectCard project={mockProject} />);
    const liveLink = screen.getByRole('link', { name: /live/i });
    const ghLink = screen.getByRole('link', { name: /github/i });
    expect(liveLink).toHaveAttribute('href', 'https://example.com');
    expect(ghLink).toHaveAttribute('href', 'https://github.com/example/test');
  });
});
