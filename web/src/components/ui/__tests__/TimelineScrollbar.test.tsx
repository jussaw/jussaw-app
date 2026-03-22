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
  it('renders with aria-hidden', () => {
    const { container } = render(<TimelineScrollbar />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
  });

  it('renders a dot for each section', () => {
    render(<TimelineScrollbar />);
    expect(screen.getByText('jussaw')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Hobbies')).toBeInTheDocument();
  });

  it('has pointer-events: none on the container', () => {
    const { container } = render(<TimelineScrollbar />);
    const el = container.firstChild as HTMLElement;
    expect(el.style.pointerEvents).toBe('none');
  });
});
