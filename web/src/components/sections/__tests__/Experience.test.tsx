import { render, screen } from '@testing-library/react';

import { siteContent } from '@/data/content';

import Experience from '../Experience';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

describe('Experience', () => {
  it('renders the section heading', () => {
    render(<Experience />);
    expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
  });

  it('renders all company names in cards mode (default)', () => {
    render(<Experience />);
    for (const entry of siteContent.experience) {
      expect(screen.getAllByText(entry.company).length).toBeGreaterThan(0);
    }
  });

  it('renders all job titles in cards mode (default)', () => {
    render(<Experience />);
    for (const entry of siteContent.experience) {
      expect(screen.getAllByText(entry.role).length).toBeGreaterThan(0);
    }
  });

  it('renders entries in cards mode', () => {
    render(<Experience displayMode="cards" />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(siteContent.experience.length);
  });

  it('renders entries in timeline mode', () => {
    render(<Experience displayMode="timeline" />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(siteContent.experience.length);
  });

  it('renders all company names in timeline mode', () => {
    render(<Experience displayMode="timeline" />);
    for (const entry of siteContent.experience) {
      expect(screen.getAllByText(entry.company).length).toBeGreaterThan(0);
    }
  });
});
