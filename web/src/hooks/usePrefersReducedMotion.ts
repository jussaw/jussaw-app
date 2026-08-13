'use client';

import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

const getSnapshot = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
// Server snapshot: no media query available — assume motion, corrected on the client.
const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
