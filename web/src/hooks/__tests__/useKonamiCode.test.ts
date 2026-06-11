import { renderHook, act } from '@testing-library/react';

import { useKonamiCode } from '../useKonamiCode';

const KONAMI_KEYS = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

function pressKeys(keys: string[]) {
  act(() => {
    keys.forEach((key) => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key }));
    });
  });
}

describe('useKonamiCode', () => {
  it('starts inactive', () => {
    const { result } = renderHook(() => useKonamiCode());
    expect(result.current).toBe(false);
  });

  it('activates after the full Konami sequence', () => {
    const { result } = renderHook(() => useKonamiCode());
    pressKeys(KONAMI_KEYS);
    expect(result.current).toBe(true);
  });

  it('accepts uppercase B and A', () => {
    const { result } = renderHook(() => useKonamiCode());
    pressKeys([...KONAMI_KEYS.slice(0, 8), 'B', 'A']);
    expect(result.current).toBe(true);
  });

  it('resets progress on a wrong key', () => {
    const { result } = renderHook(() => useKonamiCode());
    pressKeys([...KONAMI_KEYS.slice(0, 8), 'x', 'b', 'a']);
    expect(result.current).toBe(false);
    // Full sequence still works after the failed attempt
    pressKeys(KONAMI_KEYS);
    expect(result.current).toBe(true);
  });

  it('stays activated on further key presses', () => {
    const { result } = renderHook(() => useKonamiCode());
    pressKeys(KONAMI_KEYS);
    pressKeys(['x', 'y', 'z']);
    expect(result.current).toBe(true);
  });
});
