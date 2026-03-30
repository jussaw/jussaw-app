import { render, screen } from '@testing-library/react';
import TimelineScrollbar from '../TimelineScrollbar';

vi.stubGlobal('IntersectionObserver', vi.fn(function () {
  return { observe: vi.fn(), disconnect: vi.fn() };
}));

// matchMedia not available in jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

describe('TimelineScrollbar', () => {
  it('renders as a nav with aria-label', () => {
    const { container } = render(<TimelineScrollbar />);
    const el = container.firstChild as HTMLElement;
    expect(el.tagName).toBe('NAV');
    expect(el).toHaveAttribute('aria-label', 'Page sections');
  });

  it('renders a dot for each section', () => {
    render(<TimelineScrollbar />);
    expect(screen.getByText('jussaw')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
  });

  it('renders clickable buttons for each section', () => {
    render(<TimelineScrollbar />);
    expect(screen.getByLabelText('Scroll to jussaw')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to Skills')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to Experience')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to Projects')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to Hobbies')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to Terminal')).toBeInTheDocument();
  });
});
