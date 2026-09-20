import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteForge | Transform Notes into Accessible Study Documents",
  description:
    "Convert handwritten notes, pasted text, and documents into structured study guides with accessible tables and diagrams.",
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
        <header className="no-print border-b border-slate-200 bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl font-black tracking-tight text-blue-700" aria-hidden="true">
                ✎
              </span>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Note<span className="text-blue-600">Forge</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Study Guide Generator
              </span>
            </div>
            <nav aria-label="Quick links" className="flex items-center space-x-4 text-sm text-slate-600">
              <a
                href="#how-it-works"
                className="hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded px-2 py-1"
              >
                How it works
              </a>
              <span className="text-slate-300" aria-hidden="true">|</span>
              <span className="text-xs text-slate-500">WCAG 2.1 AA Compliant</span>
            </nav>
          </div>
        </header>

        <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        <footer className="no-print border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p>© {new Date().getFullYear()} NoteForge. Structured study document synthesis.</p>
            <p className="text-slate-500">
              Privacy note: Notes are processed in-memory for document generation and are never stored.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
