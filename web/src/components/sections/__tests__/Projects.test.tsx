import { render, screen } from '@testing-library/react';
import Projects from '../Projects';
import { siteContent } from '@/data/content';

vi.stubGlobal('IntersectionObserver', vi.fn(function () {
  return { observe: vi.fn(), disconnect: vi.fn() };
}));

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
