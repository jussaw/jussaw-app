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
  // `summary_large_image` to match the 1200×630 card from `twitter-image.tsx`.
  // The image URL itself comes from that file convention plus `metadataBase` —
  // don't restate it here.
  twitter: {
    card: 'summary_large_image',
    title: 'jussaw — Software Engineer',
    description:
      'Full-stack software engineer. I build things for the web — from the database to the browser.',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
