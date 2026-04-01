import { renderHook, act } from '@testing-library/react';

import { useActiveSection, SECTIONS } from '../useActiveSection';

// absoluteTop is the element's position in document coordinates.
// getBoundingClientRect().top is viewport-relative: absoluteTop - scrollY.
function createSectionEl(id: string, absoluteTop: number): HTMLElement {
  const el = document.createElement('section');
  el.id = id;
  el.getBoundingClientRect = () => {
    const top = absoluteTop - window.scrollY;
    return {
      top,
      bottom: top + 500,
      left: 0,
      right: 800,
      width: 800,
      height: 500,
      x: 0,
      y: top,
      toJSON: () => ({}),
    };
  };
  document.body.appendChild(el);
  return el;
}

// Flush requestAnimationFrame by running all queued callbacks
function flushRAF() {
  vi.advanceTimersByTime(16);
}

describe('useActiveSection', () => {
  let sectionEls: HTMLElement[];

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    // Place sections at fixed absolute positions matching the actual SECTIONS order:
    // hero, skills, experience, projects, hobbies, terminal
    sectionEls = [
      createSectionEl('hero', 0),
      createSectionEl('skills', 400),
      createSectionEl('experience', 800),
      createSectionEl('projects', 1600),
      createSectionEl('hobbies', 2400),
      createSectionEl('terminal', 3200),
    ];

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', {
      value: 900,
      writable: true,
      configurable: true,
    });
    // Set scrollHeight so the "at bottom" check doesn't always trigger in jsdom (defaults to 0)
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 5000,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    sectionEls.forEach((el) => el.remove());
    vi.useRealTimers();
  });

  it('returns 0 (Me/Hero) by default on mount', () => {
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(0);
  });

  it('returns 1 (Skills) when scrolled past the skills trigger line', () => {
    // triggerLine = scrollY + innerHeight * 0.4 = 100 + 360 = 460
    // skills top (absolute) = 400; 400 <= 460 → skills active
    Object.defineProperty(window, 'scrollY', { value: 100 });

    const { result } = renderHook(() => useActiveSection());
    act(() => {
      flushRAF();
    });
    expect(result.current).toBe(1);
  });

  it('returns 2 (Experience) when scrolled past the experience trigger line', () => {
    // triggerLine = 500 + 360 = 860; experience top = 800 <= 860 → experience active
    Object.defineProperty(window, 'scrollY', { value: 500 });

    const { result } = renderHook(() => useActiveSection());
    act(() => {
      flushRAF();
    });
    expect(result.current).toBe(2);
  });

  it('returns 3 (Projects) when scrolled past the projects trigger line', () => {
    // triggerLine = 1300 + 360 = 1660; projects top = 1600 <= 1660 → projects active
    Object.defineProperty(window, 'scrollY', { value: 1300 });

    const { result } = renderHook(() => useActiveSection());
    act(() => {
      flushRAF();
    });
    expect(result.current).toBe(3);
  });

  it('returns 4 (Hobbies) when scrolled past the hobbies trigger line', () => {
    // triggerLine = 2100 + 360 = 2460; hobbies top = 2400 <= 2460 → hobbies active
    Object.defineProperty(window, 'scrollY', { value: 2100 });

    const { result } = renderHook(() => useActiveSection());
    act(() => {
      flushRAF();
    });
    expect(result.current).toBe(4);
  });

  it('returns 5 (Terminal) when scrolled past the terminal trigger line', () => {
    // triggerLine = 2900 + 360 = 3260; terminal top = 3200 <= 3260 → terminal active
    Object.defineProperty(window, 'scrollY', { value: 2900 });

    const { result } = renderHook(() => useActiveSection());
    act(() => {
      flushRAF();
    });
    expect(result.current).toBe(5);
  });

  it('updates activeIndex on scroll events', () => {
    Object.defineProperty(window, 'scrollY', { value: 0 });
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(0);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 100 });
      window.dispatchEvent(new Event('scroll'));
      flushRAF();
    });
    expect(result.current).toBe(1);
  });

  it('removes the scroll listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useActiveSection());
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('defaults to 0 (hero) when no section element is found', () => {
    // Remove all section elements
    sectionEls.forEach((el) => el.remove());
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(0);
  });

  it('has 6 entries in SECTIONS', () => {
    expect(SECTIONS).toHaveLength(6);
    expect(SECTIONS[0].id).toBe('hero');
    expect(SECTIONS[1].id).toBe('skills');
    expect(SECTIONS[2].id).toBe('experience');
    expect(SECTIONS[3].id).toBe('projects');
    expect(SECTIONS[4].id).toBe('hobbies');
    expect(SECTIONS[5].id).toBe('terminal');
  });
});
