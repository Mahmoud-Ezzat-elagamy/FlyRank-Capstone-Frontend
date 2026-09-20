"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Sparkles, Menu, X, ArrowRight } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Study Guide Generator", href: "/generate" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="no-print border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="flex items-center space-x-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
            aria-label="NoteForge Home"
          >
            <span
              className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-blue-700 transition-colors"
              aria-hidden="true"
            >
              ✎
            </span>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-tight">
                Note<span className="text-blue-600">Forge</span>
              </span>
            </div>
          </Link>

          <span className="hidden sm:inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Study Document Synthesis
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200/60"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button & WCAG indicator */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-xs text-slate-500 flex items-center gap-1.5" title="Conforms to WCAG 2.1 AA accessibility guidelines">
            <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
            WCAG 2.1 AA
          </span>
          <span className="text-slate-300" aria-hidden="true">|</span>
          <Link
            href="/generate"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Sparkles className="w-4 h-4" aria-hidden="true" />
            <span>Launch Generator</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            href="/generate"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Launch
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  active
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>WCAG 2.1 AA Compliant</span>
            <span className="text-emerald-600 font-medium">In-Memory Privacy</span>
          </div>
        </div>
      )}
    </header>
  );
}
