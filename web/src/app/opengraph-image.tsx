import { ImageResponse } from 'next/og';

import {
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
  SocialPreviewCard,
} from './socialPreview';

/**
 * Open Graph preview image for the site root (AUD-20260729-03).
 *
 * A Next.js metadata file convention: exporting `alt`, `size` and `contentType`
 * emits the matching `og:image:*` tags, and `metadataBase` in `layout.tsx`
 * makes the URL absolute — so no hard-coded image URL belongs in `metadata`.
 *
 * Takes no `params` and reads nothing dynamic, so Next statically optimizes it:
 * the PNG is rendered once during `next build` and served from the build output.
 * See `socialPreview.tsx` for why that must stay true.
 */

export const alt = SOCIAL_IMAGE_ALT;
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;

export default function Image() {
  return new ImageResponse(<SocialPreviewCard />, { ...size });
}
