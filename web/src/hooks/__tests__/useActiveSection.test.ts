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

describe('useActiveSection', () => {
  let sectionEls: HTMLElement[];

  beforeEach(() => {
    vi.clearAllMocks();
    // Place sections at fixed absolute positions (scrollY = 0).
    // getBoundingClientRect().top == absolute top when scrollY == 0.
    sectionEls = [
      createSectionEl('hero',       0),
      createSectionEl('skills',     800),
      createSectionEl('experience', 1600),
      createSectionEl('hobbies',    2400),
    ];

    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: 900, writable: true, configurable: true });
  });

  afterEach(() => {
    sectionEls.forEach((el) => el.remove());
  });

  it('returns 0 (Me/Hero) by default on mount', () => {
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(0);
  });

  it('returns 1 (Skills) when scrolled past the skills trigger line', () => {
    // triggerLine = scrollY + innerHeight * 0.4 = 500 + 360 = 860
    // skills top (absolute) = 800; 800 <= 860 → skills active
    Object.defineProperty(window, 'scrollY', { value: 500 });

    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(1);
  });

  it('returns 2 (Experience) when scrolled past the experience trigger line', () => {
    // triggerLine = 1300 + 360 = 1660; experience top = 1600 <= 1660 → experience active
    Object.defineProperty(window, 'scrollY', { value: 1300 });

    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(2);
  });

  it('returns 3 (Hobbies) when scrolled past the hobbies trigger line', () => {
    // triggerLine = 2100 + 360 = 2460; hobbies top = 2400 <= 2460 → hobbies active
    Object.defineProperty(window, 'scrollY', { value: 2100 });

    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(3);
  });

  it('updates activeIndex on scroll events', () => {
    Object.defineProperty(window, 'scrollY', { value: 0 });
    const { result } = renderHook(() => useActiveSection());
    expect(result.current).toBe(0);

    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 500 });
      window.dispatchEvent(new Event('scroll'));
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

  it('has 4 entries in SECTIONS', () => {
    expect(SECTIONS).toHaveLength(4);
    expect(SECTIONS[0].id).toBe('hero');
    expect(SECTIONS[1].id).toBe('skills');
    expect(SECTIONS[2].id).toBe('experience');
    expect(SECTIONS[3].id).toBe('hobbies');
  });
});
