import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://noteforge.app"),
  title: {
    default: "NoteForge | Transform Notes into Accessible Study Documents",
    template: "%s | NoteForge",
  },
  description:
    "Convert handwritten notes, pasted text, and documents into structured study guides with accessible tables and diagrams.",
  applicationName: "NoteForge",
  keywords: [
    "NoteForge",
    "study guide generator",
    "handwriting to text",
    "accessible study documents",
    "Mermaid flowchart notes",
    "Gemini AI study notes",
    "WCAG 2.1 AA",
  ],
  authors: [{ name: "NoteForge Team" }],
  creator: "NoteForge",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/logo.jpg", sizes: "180x180", type: "image/jpeg" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://noteforge.app",
    siteName: "NoteForge",
    title: "NoteForge | Transform Notes into Accessible Study Documents",
    description:
      "Convert handwritten notes, pasted text, and documents into structured study guides with accessible tables and diagrams.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NoteForge - Transform Notes into Accessible Study Documents",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NoteForge | Transform Notes into Accessible Study Documents",
    description:
      "Convert handwritten notes, pasted text, and documents into structured study guides with accessible tables and diagrams.",
    images: ["/og-image.jpg"],
    creator: "@NoteForge",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased bg-slate-50 text-slate-900">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-700 focus:text-white focus:rounded focus:shadow-lg focus:font-semibold"
        >
          Skip to main content
        </a>

        {/* Dynamic Accessible Navbar */}
        <Navbar />

        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="no-print border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">Note<span className="text-blue-600">Forge</span></span>
                <span className="text-slate-300">|</span>
                <span>Structured study document synthesis</span>
              </div>
              <nav aria-label="Footer navigation" className="flex items-center space-x-6 text-sm">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <Link href="/generate" className="hover:text-blue-600 transition-colors">
                  Study Guide Generator
                </Link>
                <a href="#main-content" className="hover:text-blue-600 transition-colors">
                  Back to Top ↑
                </a>
              </nav>
            </div>
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400 text-[11px]">
              <p>© {new Date().getFullYear()} NoteForge. Built for students &amp; professionals taking notes by hand.</p>
              <p>Privacy: Notes are processed entirely in-memory for document generation and are never stored.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
