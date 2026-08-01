/**
 * Shared artwork and metadata for the social preview images (AUD-20260729-03).
 *
 * `opengraph-image.tsx` consumes the design and the `size` / `contentType` /
 * `alt` values from this module, keeping the image route focused on its Next.js
 * metadata-file-convention exports.
 *
 * **Everything in this module must stay deterministic.** Next.js statically
 * optimizes these routes (renders the PNG once at `next build` and serves it
 * from the build output), so the artwork may not depend on the clock,
 * randomness, request headers, environment variables, the network, or any
 * mutable external data. Only the literals below and the font `next/og` bundles
 * locally (`Geist-Regular.ttf`) are used, which is what makes the produced PNG
 * reproducible across Docker builds. `src/app/__tests__/social-preview-image.test.ts`
 * enforces that.
 *
 * This is a plain element factory, not a rendered React component — Satori
 * rasterizes it inside `ImageResponse`, it is never mounted in the browser — so
 * it needs no `'use client'` boundary and must not use hooks or browser APIs.
 */

/** Open Graph large-card dimensions, in pixels. */
export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/** MIME type `ImageResponse` emits. */
export const SOCIAL_IMAGE_CONTENT_TYPE = 'image/png';

/**
 * Alt text for the preview. The card's wording is duplicated here on purpose:
 * the image is decorative reinforcement, and the same message is carried by the
 * Open Graph `title` and `description` in `layout.tsx`, so a reader
 * who never sees the image loses nothing.
 */
export const SOCIAL_IMAGE_ALT =
  'jussaw.com — Justin Sawyer, Software Engineer. Full-stack software engineer building for the web, from the database to the browser.';

/**
 * Palette, mirrored from the `@theme` block in `globals.css`. Satori cannot
 * resolve CSS custom properties, so the hex values are repeated as literals.
 * `BODY` is a lightened `--color-text-secondary`; the theme value (`#848288`)
 * clears WCAG AA on screen but reads muddy once flattened into a PNG and
 * downscaled by a feed.
 */
const COLORS = {
  BG: '#000000',
  ACCENT: '#c4a0b2',
  ACCENT_2: '#a0c4e0',
  HEADING: '#f0eeec',
  BODY: '#c9c7cd',
  BORDER: '#201e1c',
} as const;

/** Safe margin. ~6% of the 1200×630 frame, so nothing lands near a feed's crop. */
const PADDING = 72;

/**
 * Build the preview card element.
 *
 * Satori supports flexbox only (no grid), and requires an explicit
 * `display: 'flex'` on every element with more than one child.
 */
export function SocialPreviewCard() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: COLORS.BG,
        padding: PADDING,
        fontFamily: 'sans-serif',
      }}
    >
      {/* Wordmark, set off by a short accent rule. */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 56, height: 6, backgroundColor: COLORS.ACCENT }} />
        <div style={{ marginLeft: 20, fontSize: 30, letterSpacing: 2, color: COLORS.ACCENT_2 }}>
          jussaw.com
        </div>
      </div>

      {/* Identity block, hung off a left accent bar — the site's own motif. */}
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div style={{ width: 8, backgroundColor: COLORS.ACCENT, borderRadius: 4 }} />
        <div style={{ display: 'flex', flexDirection: 'column', marginLeft: 36, maxWidth: 940 }}>
          <div style={{ fontSize: 92, fontWeight: 700, color: COLORS.HEADING, lineHeight: 1.1 }}>
            Justin Sawyer
          </div>
          <div style={{ marginTop: 14, fontSize: 44, color: COLORS.ACCENT }}>Software Engineer</div>
          <div style={{ marginTop: 26, fontSize: 30, color: COLORS.BODY, lineHeight: 1.4 }}>
            Full-stack — from the database to the browser.
          </div>
        </div>
      </div>

      {/* Baseline rule, to close the frame. */}
      <div style={{ width: '100%', height: 4, backgroundColor: COLORS.BORDER }} />
    </div>
  );
}
