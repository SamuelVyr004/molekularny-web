// Súbor: src/app/layout.tsx

import type { Metadata, Viewport } from "next";
// Importujeme fonty priamo sem
import { Space_Grotesk, Roboto } from "next/font/google";
import "./globals.css"; // <-- VRÁTIME GLOBÁLNE ŠTÝLY
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-primary",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-secondary",
});

export const metadata: Metadata = {
  title: "Molecular Biology Toolkit | Interactive Pathways",
  description: "An interactive collection of signaling and biochemical pathways for students and researchers. Visualize and understand complex molecular processes.",
  keywords: "molecular biology, signaling pathway, biochemistry, interactive diagram, science, research, student toolkit",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={`${spaceGrotesk.variable} ${roboto.variable}`}>
      <body className={`font-secondary bg-background text-text`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}