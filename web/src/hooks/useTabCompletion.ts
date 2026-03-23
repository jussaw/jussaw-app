'use client';

import { useCallback, useRef } from 'react';

export function useTabCompletion(options: { commands: string[] }): {
  complete: (input: string) => string;
  reset: () => void;
} {
  const { commands } = options;
  const cycleRef = useRef<{ matches: string[]; index: number } | null>(null);

  const complete = useCallback(
    (input: string): string => {
      const prefix = input;

      // Continuation: last Tab returned matches[index] and user pressed Tab again
      if (
        cycleRef.current !== null &&
        cycleRef.current.matches[cycleRef.current.index] === prefix
      ) {
        const nextIndex = (cycleRef.current.index + 1) % cycleRef.current.matches.length;
        cycleRef.current.index = nextIndex;
        return cycleRef.current.matches[nextIndex];
      }

      // New prefix — recompute matches
      // If the prefix has no space, only match bare commands (no-argument entries).
      // If the prefix has a space, only match argument completions.
      const prefixHasSpace = prefix.includes(' ');
      const matches = commands.filter(
        (cmd) => cmd.startsWith(prefix) && cmd.includes(' ') === prefixHasSpace,
      );
      if (matches.length === 0) return prefix;
      cycleRef.current = { matches, index: 0 };
      return matches[0];
    },
    [commands],
  );

  const reset = useCallback(() => {
    cycleRef.current = null;
  }, []);

  return { complete, reset };
}
