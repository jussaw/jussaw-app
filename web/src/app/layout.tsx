import type { Metadata } from "next";
import { Inter, Lora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import TimelineScrollbar from "@/components/ui/TimelineScrollbar";

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
  title: "jussaw — Software Engineer",
  description: "Full-stack software engineer. I build things for the web — from the database to the browser.",
  openGraph: {
    title: "jussaw — Software Engineer",
    description: "Full-stack software engineer portfolio",
    url: "https://jussaw.com",
    siteName: "jussaw.com",
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
      <body data-theme="baby-blue-3">
        {children}
        <TimelineScrollbar />
      </body>
    </html>
  );
}
