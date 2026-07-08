import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Fraunces, Plus_Jakarta_Sans, Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "@/styles/globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

// Proposal document headline typeface — the bold half of "Your areas of *opportunity.*" style
// treatments only. Distinct from the app shell's Space Grotesk (too quirky/indie).
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// Proposal document body typeface — paragraphs, meta labels/values, list items. Plain and
// neutral to match the reference (was mistakenly inheriting the bold headline font, which
// reads heavier/rounder in paragraph form than intended).
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Proposal Generator",
  description: "OPFOR proposal generator — build and export client proposals.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${GeistSans.variable} ${spaceGrotesk.variable} ${plexMono.variable} ${fraunces.variable} ${plusJakarta.variable} ${inter.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
