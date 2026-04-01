import { render, screen } from '@testing-library/react';

import { siteContent } from '@/data/content';

import Skills from '../Skills';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

describe('Skills', () => {
  it('renders the section heading', () => {
    render(<Skills />);
    expect(screen.getByRole('heading', { level: 2, name: /skills/i })).toBeInTheDocument();
  });

  it('renders all skill names in grid mode (default)', () => {
    render(<Skills />);
    for (const skill of siteContent.skills) {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    }
  });

  it('renders all skill names in grid mode when displayMode="grid"', () => {
    render(<Skills displayMode="grid" />);
    for (const skill of siteContent.skills) {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    }
  });

  it('renders category labels in grouped mode', () => {
    render(<Skills displayMode="grouped" />);
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('DevOps & Infra')).toBeInTheDocument();
  });

  it('renders all skill names in grouped mode', () => {
    render(<Skills displayMode="grouped" />);
    for (const skill of siteContent.skills) {
      expect(screen.getByText(skill.name)).toBeInTheDocument();
    }
  });
});
