import { MetadataRoute } from 'next';

import { CONTENT_LAST_UPDATED } from '@/data/content';

// Derived from the content's own last-updated date so the sitemap stays honest
// and deterministic (no build-time clock). Bump CONTENT_LAST_UPDATED in
// content.ts when you edit the page copy — see web/CLAUDE.md.
const LAST_CONTENT_UPDATE = new Date(CONTENT_LAST_UPDATED);

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://jussaw.com',
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
