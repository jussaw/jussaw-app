import { readFileSync } from 'fs';
import { resolve } from 'path';

import { metadata } from '@/app/layout';
import * as opengraphImage from '@/app/opengraph-image';
import * as twitterImage from '@/app/twitter-image';
import { SITE_URL } from '@/utils/publicEnv';

// `next/font/google` loaders only exist after the Next compiler rewrites them,
// so importing layout.tsx under Vitest needs them stubbed. Vitest hoists this
// above the imports; only the loaders are faked, `metadata` is the real object.
vi.mock('next/font/google', () => {
  const loader = () => ({ variable: '--font-stub', className: 'font-stub', style: {} });
  return { Inter: loader, Lora: loader, JetBrains_Mono: loader };
});

/**
 * Contract for the social preview images (AUD-20260729-03).
 *
 * Two properties matter and neither is visual, so nothing here asserts on
 * pixels or snapshots:
 *
 * 1. Both metadata file conventions advertise a fixed 1200×630 PNG with alt
 *    text, which is what makes crawlers render a large card.
 * 2. The routes are *deterministic* — Next statically optimizes them, so a
 *    clock, RNG, request header, env read or network call would bake a stale or
 *    build-machine-specific PNG into the image and break reproducibility. That
 *    is enforced by scanning the sources, since a passing render proves nothing
 *    about a value that only varies between builds.
 */

const SRC = resolve(__dirname, '..');

const ROUTES = [
  { name: 'opengraph-image', mod: opengraphImage, file: 'opengraph-image.tsx' },
  { name: 'twitter-image', mod: twitterImage, file: 'twitter-image.tsx' },
] as const;

/** Sources that must render identically on every build, including the shared artwork. */
const DETERMINISTIC_SOURCES = [...ROUTES.map((r) => r.file), 'socialPreview.tsx'];

/** Non-determinism the static-optimization guarantee can't tolerate. */
const FORBIDDEN_PATTERNS: Array<{ label: string; pattern: RegExp }> = [
  { label: 'clock reads', pattern: /\bnew Date\b|\bDate\.now\b|\bperformance\.now\b/ },
  { label: 'randomness', pattern: /\bMath\.random\b|\bcrypto\.randomUUID\b|\brandomBytes\b/ },
  { label: 'network fetches', pattern: /\bfetch\s*\(|\bXMLHttpRequest\b/ },
  { label: 'environment reads', pattern: /\bprocess\.env\b/ },
  { label: 'request-time APIs', pattern: /\b(headers|cookies|draftMode|connection)\s*\(/ },
  { label: 'remote font/asset URLs', pattern: /https?:\/\// },
];

describe('social preview image routes', () => {
  describe.each(ROUTES)('$name', ({ mod }) => {
    it('advertises the fixed 1200×630 large-card size', () => {
      expect(mod.size).toEqual({ width: 1200, height: 630 });
    });

    it('declares a PNG content type', () => {
      expect(mod.contentType).toBe('image/png');
    });

    it('provides descriptive alt text', () => {
      expect(typeof mod.alt).toBe('string');
      expect(mod.alt.length).toBeGreaterThan(20);
      expect(mod.alt).toMatch(/jussaw\.com/);
    });

    it('exports an image handler taking no route params', () => {
      expect(typeof mod.default).toBe('function');
      expect(mod.default.length).toBe(0);
    });
  });

  it('renders the same artwork for both cards', () => {
    expect(twitterImage.size).toEqual(opengraphImage.size);
    expect(twitterImage.contentType).toBe(opengraphImage.contentType);
    expect(twitterImage.alt).toBe(opengraphImage.alt);
  });

  describe.each(DETERMINISTIC_SOURCES)('%s stays build-deterministic', (file) => {
    const source = readFileSync(resolve(SRC, file), 'utf8');

    it.each(FORBIDDEN_PATTERNS)('uses no $label', ({ pattern }) => {
      expect(source).not.toMatch(pattern);
    });
  });
});

describe('root metadata backs the preview images', () => {
  it('uses summary_large_image so the 1200×630 card renders full width', () => {
    expect(metadata.twitter).toMatchObject({ card: 'summary_large_image' });
  });

  it('keeps metadataBase at SITE_URL so the generated image URLs are absolute', () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.origin).toBe(SITE_URL);
  });

  it('leaves the image URLs to the file conventions rather than hard-coding them', () => {
    expect(metadata.openGraph?.images).toBeUndefined();
    expect(metadata.twitter && 'images' in metadata.twitter && metadata.twitter.images).toBeFalsy();
  });
});
