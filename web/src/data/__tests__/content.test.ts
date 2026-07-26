import { createHash } from 'node:crypto';

import sitemap from '@/app/sitemap';
import { CONTENT_FINGERPRINT, CONTENT_LAST_UPDATED, siteContent } from '@/data/content';

/**
 * Deterministic fingerprint of the site content. JSON.stringify preserves the
 * insertion order of keys, so the same content always hashes to the same value.
 */
const fingerprint = (): string =>
  createHash('sha256').update(JSON.stringify(siteContent)).digest('hex');

/**
 * Freshness floor: the sitemap must never claim content is older than the most
 * recent meaningful update to `siteContent`. Bump this alongside content when a
 * later change lands; CONTENT_LAST_UPDATED must be on or after this date.
 */
const CONTENT_FRESHNESS_FLOOR = '2026-07-18';

describe('content freshness policy', () => {
  it('CONTENT_LAST_UPDATED is a static ISO (YYYY-MM-DD) date', () => {
    expect(CONTENT_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Number.isNaN(new Date(CONTENT_LAST_UPDATED).getTime())).toBe(false);
  });

  it('CONTENT_LAST_UPDATED is no earlier than the latest known content update', () => {
    expect(new Date(CONTENT_LAST_UPDATED).getTime()).toBeGreaterThanOrEqual(
      new Date(CONTENT_FRESHNESS_FLOOR).getTime(),
    );
  });

  it('siteContent matches CONTENT_FINGERPRINT — edits must bump the fingerprint AND CONTENT_LAST_UPDATED', () => {
    const actual = fingerprint();
    expect(
      actual,
      [
        'Site content changed but its freshness metadata did not.',
        'In src/data/content.ts, set:',
        `  CONTENT_FINGERPRINT = '${actual}'`,
        '  CONTENT_LAST_UPDATED = <today, YYYY-MM-DD>',
        'so the sitemap lastModified reflects this edit (see web/CLAUDE.md).',
      ].join('\n'),
    ).toBe(CONTENT_FINGERPRINT);
  });

  it('sitemap lastModified is derived from CONTENT_LAST_UPDATED', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(1);
    expect(entries[0].lastModified).toEqual(new Date(CONTENT_LAST_UPDATED));
  });
});
