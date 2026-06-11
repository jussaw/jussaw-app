import { MetadataRoute } from 'next';

// Bump when page content meaningfully changes.
const LAST_CONTENT_UPDATE = new Date('2026-06-11');

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
