import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jbmono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jussaw.com"),
  title: "jussaw — Software Engineer",
  description: "Full-stack software engineer. I build things for the web — from the database to the browser.",
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "jussaw — Software Engineer",
    description: "Full-stack software engineer. I build things for the web — from the database to the browser.",
    url: "https://jussaw.com",
    siteName: "jussaw.com",
  },
  twitter: {
    card: "summary",
    title: "jussaw — Software Engineer",
    description: "Full-stack software engineer. I build things for the web — from the database to the browser.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lora.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        {children}
      </body>
    </html>
  );
}
