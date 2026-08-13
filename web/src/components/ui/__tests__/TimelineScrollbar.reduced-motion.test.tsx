import { fireEvent, render, screen } from '@testing-library/react';

import TimelineScrollbar from '../TimelineScrollbar';

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(() => ({ observe: vi.fn(), disconnect: vi.fn() })),
);

// matchMedia not available in jsdom
function setReducedMotion(reduce: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: reduce && query === '(prefers-reduced-motion: reduce)',
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  });
}

describe('TimelineScrollbar section navigation honours prefers-reduced-motion', () => {
  let target: HTMLElement;
  let scrollIntoView: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // The nav resolves its target by DOM id, so the section has to exist.
    target = document.createElement('div');
    target.id = 'skills';
    document.body.appendChild(target);
    scrollIntoView = vi.spyOn(window.HTMLElement.prototype, 'scrollIntoView');
  });

  afterEach(() => {
    target.remove();
    vi.restoreAllMocks();
  });

  // Regression guard: 'auto' means "use the computed scroll-behavior", and globals.css sets
  // `scroll-behavior: smooth` on <html>, so 'auto' would still animate. Only 'instant' is
  // unconditional at the call site.
  it('jumps instantly when the user prefers reduced motion', () => {
    setReducedMotion(true);
    render(<TimelineScrollbar />);

    fireEvent.click(screen.getByLabelText('Scroll to Skills'));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
    expect(scrollIntoView).not.toHaveBeenCalledWith(
      expect.objectContaining({ behavior: 'smooth' }),
    );
  });

  it("falls back to 'auto' on engines that reject behavior: 'instant'", () => {
    setReducedMotion(true);
    scrollIntoView.mockImplementation((options?: boolean | ScrollIntoViewOptions) => {
      if (typeof options === 'object' && options?.behavior === 'instant') {
        throw new TypeError("The provided value 'instant' is not a valid enum value.");
      }
    });
    render(<TimelineScrollbar />);

    expect(() => fireEvent.click(screen.getByLabelText('Scroll to Skills'))).not.toThrow();

    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('scrolls smoothly when the user has no motion preference', () => {
    setReducedMotion(false);
    render(<TimelineScrollbar />);

    fireEvent.click(screen.getByLabelText('Scroll to Skills'));

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
  });
});
