import { ImageResponse } from 'next/og';

import {
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
  SocialPreviewCard,
} from './socialPreview';

/**
 * Twitter/X preview image for the site root (AUD-20260729-03).
 *
 * Same artwork as `opengraph-image.tsx` — X reads `twitter:image` in preference
 * to `og:image`, and the shared 1200×630 card is what `summary_large_image`
 * (set in `layout.tsx`) expects.
 *
 * Statically optimized for the same reason as the Open Graph route: no `params`,
 * no dynamic reads.
 */

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(<SocialPreviewCard />, { ...size });
}
