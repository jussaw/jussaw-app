import type { Metadata } from 'next';
import { Inter, Lora, JetBrains_Mono } from 'next/font/google';

import { SITE_URL } from '@/utils/publicEnv';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jbmono',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'jussaw — Software Engineer',
  description:
    'Full-stack software engineer. I build things for the web — from the database to the browser.',
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'jussaw — Software Engineer',
    description:
      'Full-stack software engineer. I build things for the web — from the database to the browser.',
    url: SITE_URL,
    siteName: 'jussaw.com',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Justin Sawyer',
  url: SITE_URL,
  jobTitle: 'Software Engineer',
  sameAs: ['https://github.com/jussaw', 'https://linkedin.com/in/jussaw'],
};

/**
 * Opts the page in to scroll-reveal animation (AUD-20260806-01).
 *
 * The `.reveal` hiding styles in globals.css are scoped to this attribute, so
 * they never apply when no script runs at all (JS disabled, this inline script
 * blocked by CSP, a crawler that does not execute JS) or when
 * IntersectionObserver is missing. It runs before any bundle loads, so it is
 * deliberately not a claim about the client bundle: a bundle that fails after
 * this point leaves the gate on and the content hidden.
 *
 * It must stay a plain inline script rendered ahead of the content —
 * parser-blocking and therefore pre-paint. `next/script`, even at
 * `strategy="beforeInteractive"`, is
 * documented as loading "before any Next.js code" without blocking paint, which
 * would let the un-gated content flash in before being hidden.
 */
const revealGateScript =
  "if ('IntersectionObserver' in window) " +
  "document.documentElement.setAttribute('data-js-reveal', 'on');";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          // eslint-disable-next-line react/no-danger -- fixed local literal, no interpolated input
          dangerouslySetInnerHTML={{ __html: revealGateScript }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
