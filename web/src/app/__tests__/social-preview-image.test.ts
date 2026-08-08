import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

import { metadata } from '@/app/layout';
import * as opengraphImage from '@/app/opengraph-image';
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
 * 1. The Open Graph metadata file convention advertises a fixed 1200×630 PNG
 *    with alt text, which is what makes crawlers render a large card.
 * 2. The route is *deterministic* — Next statically optimizes it, so a
 *    clock, RNG, request header, env read or network call would bake a stale or
 *    build-machine-specific PNG into the image and break reproducibility. That
 *    is enforced by scanning the sources, since a passing render proves nothing
 *    about a value that only varies between builds.
 */

const SRC = resolve(__dirname, '..');

/** Sources that must render identically on every build, including the shared artwork. */
const DETERMINISTIC_SOURCES = ['opengraph-image.tsx', 'socialPreview.tsx'];

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
  describe('opengraph-image', () => {
    it('advertises the fixed 1200×630 large-card size', () => {
      expect(opengraphImage.size).toEqual({ width: 1200, height: 630 });
    });

    it('declares a PNG content type', () => {
      expect(opengraphImage.contentType).toBe('image/png');
    });

    it('provides descriptive alt text', () => {
      expect(typeof opengraphImage.alt).toBe('string');
      expect(opengraphImage.alt.length).toBeGreaterThan(20);
      expect(opengraphImage.alt).toMatch(/jussaw\.com/);
    });

    it('exports an image handler taking no route params', () => {
      expect(typeof opengraphImage.default).toBe('function');
      expect(opengraphImage.default.length).toBe(0);
    });
  });

  it('does not register a Twitter image route', () => {
    expect(existsSync(resolve(SRC, 'twitter-image.tsx'))).toBe(false);
    expect(existsSync(resolve(SRC, 'twitter-image.ts'))).toBe(false);
    expect(existsSync(resolve(SRC, 'twitter-image.js'))).toBe(false);
    expect(existsSync(resolve(SRC, 'twitter-image.jsx'))).toBe(false);
  });

  describe.each(DETERMINISTIC_SOURCES)('%s stays build-deterministic', (file) => {
    const source = readFileSync(resolve(SRC, file), 'utf8');

    it.each(FORBIDDEN_PATTERNS)('uses no $label', ({ pattern }) => {
      expect(source).not.toMatch(pattern);
    });
  });
});

describe('root metadata backs the preview images', () => {
  it('does not emit Twitter metadata', () => {
    expect(metadata.twitter).toBeUndefined();
  });

  it('keeps metadataBase at SITE_URL so the generated image URLs are absolute', () => {
    expect(metadata.metadataBase).toBeInstanceOf(URL);
    expect(metadata.metadataBase?.origin).toBe(SITE_URL);
  });

  it('leaves the image URLs to the file conventions rather than hard-coding them', () => {
    expect(metadata.openGraph?.images).toBeUndefined();
  });
});
