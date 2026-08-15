import { MetadataRoute } from 'next';

import { SITE_URL } from '@/utils/publicEnv';

// A metadata route rather than a static public/robots.txt, so the advertised
// sitemap follows the build's origin like the rest of the SEO surface
// (layout metadata/JSON-LD, sitemap.ts) instead of hardcoding production.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
