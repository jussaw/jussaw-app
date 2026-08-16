import { act, renderHook } from '@testing-library/react';

import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Minimal MediaQueryList stand-in — jsdom ships no matchMedia. `matches` is mutable so a
 * test can flip the OS preference and then fire the change event the browser would fire.
 */
function stubMatchMedia(initialMatches: boolean) {
  const listeners = new Set<() => void>();
  const mql = {
    matches: initialMatches,
    media: REDUCED_MOTION_QUERY,
    addEventListener: vi.fn((_: string, cb: () => void) => {
      listeners.add(cb);
    }),
    removeEventListener: vi.fn((_: string, cb: () => void) => {
      listeners.delete(cb);
    }),
  };

  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: vi.fn((query: string) => {
      expect(query).toBe(REDUCED_MOTION_QUERY);
      return mql;
    }),
  });

  return {
    mql,
    /** Emulate the user changing their OS motion preference mid-session. */
    emit(matches: boolean) {
      mql.matches = matches;
      act(() => {
        listeners.forEach((cb) => cb());
      });
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

describe('usePrefersReducedMotion', () => {
  it('reports the current preference on mount', () => {
    stubMatchMedia(true);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(true);

    stubMatchMedia(false);
    expect(renderHook(() => usePrefersReducedMotion()).result.current).toBe(false);
  });

  it('re-renders when the preference changes while mounted', () => {
    const media = stubMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    media.emit(true);
    expect(result.current).toBe(true);

    media.emit(false);
    expect(result.current).toBe(false);
  });

  it('unsubscribes on unmount', () => {
    const media = stubMatchMedia(true);
    const { unmount } = renderHook(() => usePrefersReducedMotion());
    expect(media.listenerCount).toBe(1);

    unmount();
    expect(media.listenerCount).toBe(0);
  });
});
