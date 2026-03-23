import { renderHook } from '@testing-library/react';
import { useTabCompletion } from '../useTabCompletion';

const COMMANDS = [
  'cat',
  'cat experience.txt',
  'cat setup.txt',
  'cat skills.txt',
  'clear',
  'help',
  'ls',
  'whoami',
];

describe('useTabCompletion', () => {
  it('returns the sole match for an unambiguous prefix', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('wh')).toBe('whoami');
  });

  it('returns input unchanged when there are no matches', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('xyz')).toBe('xyz');
  });

  it('completes "cat" command without touching arguments', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('cat')).toBe('cat');
  });

  it('returns first argument match when prefix has a space', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('cat ')).toBe('cat experience.txt');
  });

  it('cycles through argument matches on repeated Tab presses', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    result.current.complete('cat ');                         // → cat experience.txt
    expect(result.current.complete('cat experience.txt')).toBe('cat setup.txt');
    expect(result.current.complete('cat setup.txt')).toBe('cat skills.txt');
  });

  it('wraps the cycle back to the first argument match', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    result.current.complete('cat ');
    result.current.complete('cat experience.txt');
    result.current.complete('cat setup.txt');
    expect(result.current.complete('cat skills.txt')).toBe('cat experience.txt');
  });

  it('narrows to a single argument match with a longer prefix', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('cat sk')).toBe('cat skills.txt');
  });

  it('returns same value when prefix exactly matches the only entry', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('whoami')).toBe('whoami');
  });

  it('reset() causes the next complete() to start the cycle from the beginning', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    result.current.complete('cat ');
    result.current.complete('cat experience.txt'); // → cat setup.txt (index 1)
    result.current.reset();
    expect(result.current.complete('cat ')).toBe('cat experience.txt');
  });

  it('reset() on a fresh hook is a no-op', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(() => result.current.reset()).not.toThrow();
  });

  it('complete and reset are stable references across re-renders', () => {
    const { result, rerender } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    const { complete: c1, reset: r1 } = result.current;
    rerender();
    expect(result.current.complete).toBe(c1);
    expect(result.current.reset).toBe(r1);
  });

  it('is case-sensitive — uppercase prefix finds no match', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('Wh')).toBe('Wh');
  });

  it('"cat" prefix without space completes to the "cat" command only', () => {
    const { result } = renderHook(() => useTabCompletion({ commands: COMMANDS }));
    expect(result.current.complete('cat')).toBe('cat');
    // Cycling the exact match just stays on itself
    expect(result.current.complete('cat')).toBe('cat');
  });
});
