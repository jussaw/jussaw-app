export type HeadingStyle = 'serif-elegant' | 'bold-sans' | 'mono-minimal';

export function getFontFamily(headingStyle: HeadingStyle): string {
  if (headingStyle === 'serif-elegant') return 'var(--font-serif)';
  if (headingStyle === 'mono-minimal') return 'var(--font-mono)';
  return 'var(--font-sans)';
}
