import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

// Deliberate deep import of a Next internal: this is the very serializer the
// metadata-route loader runs over the default export, so asserting against it
// pins the bytes crawlers actually receive instead of a hand-copied string. It
// is test-only — if a future Next bump moves it, this file fails loudly in CI
// and production is unaffected.
import { resolveRobots } from 'next/dist/build/webpack/loaders/metadata/resolve-route-data';

import robots from '@/app/robots';
import { SITE_URL } from '@/utils/publicEnv';

/**
 * Contract for the robots route (AUD-20260730-01).
 *
 * `public/robots.txt` used to hardcode the production origin while every other
 * SEO surface (`layout.tsx` metadata/JSON-LD, `sitemap.ts`) resolved through
 * `SITE_URL`, so a preview build advertised production's sitemap to crawlers.
 * The fix is an `app/robots.ts` metadata route; these assertions keep the two
 * halves of that fix — the route exists, and the static file that would shadow
 * it does not — from regressing.
 */

const APP_DIR = resolve(__dirname, '..');
const PUBLIC_DIR = resolve(APP_DIR, '../../public');

/** Non-determinism the build-time origin inlining can't tolerate. */
const FORBIDDEN_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'clock reads', pattern: /\bnew Date\b|\bDate\.now\b|\bperformance\.now\b/ },
  { label: 'randomness', pattern: /\bMath\.random\b|\bcrypto\.randomUUID\b|\brandomBytes\b/ },
  { label: 'network fetches', pattern: /\bfetch\s*\(|\bXMLHttpRequest\b/ },
  { label: 'request-time APIs', pattern: /\b(headers|cookies|draftMode|connection)\s*\(/ },
  // The origin must arrive through the validated `SITE_URL` import, never a raw
  // env read or a literal URL of its own.
  { label: 'direct environment reads', pattern: /\bprocess\.env\b/ },
  { label: 'hard-coded origins', pattern: /https?:\/\// },
];

describe('robots route', () => {
  it('serves robots.txt from the app route, not a static public file', () => {
    // A public file shadows the app route in production and is a hard 500 in
    // dev, so the deletion is part of the fix rather than a tidy-up.
    expect(existsSync(resolve(PUBLIC_DIR, 'robots.txt'))).toBe(false);
  });

  it('points crawlers at the sitemap on the configured origin', () => {
    expect(robots().sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it('keeps the whole site crawlable by every agent', () => {
    expect(robots().rules).toEqual({ userAgent: '*', allow: '/' });
  });

  it('serializes to the same directives the static file served', () => {
    // `User-Agent` is capitalized by Next's serializer where the old file wrote
    // `User-agent`; RFC 9309 field names are case-insensitive, so crawler
    // behavior is unchanged.
    expect(resolveRobots(robots())).toBe(
      `User-Agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    );
  });

  describe('stays build-deterministic', () => {
    const source = readFileSync(resolve(APP_DIR, 'robots.ts'), 'utf8');

    it.each(FORBIDDEN_PATTERNS)('uses no $label', ({ pattern }) => {
      expect(source).not.toMatch(pattern);
    });
  });
});
