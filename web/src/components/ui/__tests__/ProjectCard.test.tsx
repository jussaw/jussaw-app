import { render, screen } from '@testing-library/react';

import type { ProjectEntry } from '@/data/content';

import ProjectCard from '../ProjectCard';

const mockProject: ProjectEntry = {
  title: 'test-project',
  description: 'A test project',
  highlights: ['Feature A', 'Feature B'],
  stack: ['React', 'TypeScript'],
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/example/test',
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

const mockProjectWithLinks: ProjectEntry = {
  title: 'links-project',
  description: 'A project with multiple links',
  highlights: ['Feature A'],
  stack: ['JavaScript'],
  links: [
    { label: 'Chrome Web Store', url: '#' },
    { label: 'Firefox Add-on', url: 'https://addons.mozilla.org/firefox/addon/example/' },
    { label: 'Privacy Policy', url: 'https://example.com/' },
    { label: 'GitHub', url: 'https://github.com/example/links' },
  ],
};

describe('ProjectCard with links', () => {
  it('renders each link as an anchor with the correct href', () => {
    render(<ProjectCard project={mockProjectWithLinks} />);
    expect(screen.getByRole('link', { name: /chrome web store/i })).toHaveAttribute('href', '#');
    expect(screen.getByRole('link', { name: /firefox add-on/i })).toHaveAttribute(
      'href',
      'https://addons.mozilla.org/firefox/addon/example/',
    );
    expect(screen.getByRole('link', { name: /privacy policy/i })).toHaveAttribute(
      'href',
      'https://example.com/',
    );
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/example/links',
    );
  });

  it('renders the links in order', () => {
    render(<ProjectCard project={mockProjectWithLinks} />);
    const labels = screen.getAllByRole('link').map((link) => link.textContent?.trim());
    expect(labels).toEqual([
      '↗ Chrome Web Store',
      '↗ Firefox Add-on',
      '↗ Privacy Policy',
      '↗ GitHub',
    ]);
  });
});
