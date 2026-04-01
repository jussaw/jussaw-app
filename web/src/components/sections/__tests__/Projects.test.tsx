import { render, screen } from '@testing-library/react';

import { siteContent } from '@/data/content';

import Projects from '../Projects';

vi.stubGlobal(
  'IntersectionObserver',
  // eslint-disable-next-line prefer-arrow-callback
  vi.fn(function () {
    return { observe: vi.fn(), disconnect: vi.fn() };
  }),
);

describe('Projects', () => {
  it('renders a section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  it('renders the first project title from content', () => {
    render(<Projects />);
    expect(screen.getByText(siteContent.projects[0].title)).toBeInTheDocument();
  });

  it('renders project highlights', () => {
    render(<Projects />);
    siteContent.projects[0].highlights.forEach((h) => {
      expect(screen.getByText(h)).toBeInTheDocument();
    });
  });
});
