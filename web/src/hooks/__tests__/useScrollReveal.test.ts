import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { useScrollReveal } from '../useScrollReveal';

// IntersectionObserver does not exist in jsdom — mock it globally
type IOCallback = (entries: IntersectionObserverEntry[]) => void;
let capturedCallback: IOCallback;

const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
};

vi.stubGlobal(
  'IntersectionObserver',
  vi.fn(function (cb: IOCallback) {
    capturedCallback = cb;
    return mockObserver;
  })
);

function makeEntry(isIntersecting: boolean, target: Element): IntersectionObserverEntry {
  return { isIntersecting, target } as unknown as IntersectionObserverEntry;
}

describe('useScrollReveal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds "visible" class when element enters viewport', () => {
    const div = document.createElement('div');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
      return ref;
    });

    capturedCallback([makeEntry(true, div)]);
    expect(div.classList.contains('visible')).toBe(true);
  });

  it('removes "visible" class when element leaves viewport', () => {
    const div = document.createElement('div');
    div.classList.add('visible');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
      return ref;
    });

    capturedCallback([makeEntry(false, div)]);
    expect(div.classList.contains('visible')).toBe(false);
  });

  it('calls observer.observe with the ref element', () => {
    const div = document.createElement('div');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
    });

    expect(mockObserver.observe).toHaveBeenCalledWith(div);
  });

  it('disconnects observer on unmount', () => {
    const div = document.createElement('div');
    const { unmount } = renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref);
    });

    unmount();
    expect(mockObserver.disconnect).toHaveBeenCalledTimes(1);
  });

  it('respects custom threshold option', () => {
    const div = document.createElement('div');
    renderHook(() => {
      const ref = useRef(div);
      useScrollReveal(ref, { threshold: 0.5 });
    });

    expect(IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ threshold: 0.5 })
    );
  });
});
