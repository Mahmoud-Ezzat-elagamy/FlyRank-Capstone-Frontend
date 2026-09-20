"use client";

import React, { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { NoteDoc } from "@/lib/schema";
import { TableView } from "./TableView";
import { DiagramView } from "./DiagramView";

interface DocumentViewProps {
  doc: NoteDoc;
  notices?: string[];
  onEdit: () => void;
  onReset: () => void;
}

export function DocumentView({
  doc,
  notices = [],
  onEdit,
  onReset,
}: DocumentViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const printRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    try {
      const parts: string[] = [`# ${doc.title}`];
      if (doc.summary) {
        parts.push(`\n${doc.summary}\n`);
      }
      doc.sections.forEach((sec) => {
        parts.push(`\n## ${sec.heading}\n`);
        sec.paragraphs?.forEach((p) => parts.push(`${p}\n`));
        sec.bullets?.forEach((b) => parts.push(`* ${b}`));
        if (sec.table) {
          parts.push(`\n[Table: ${sec.table.caption}]`);
        }
        if (sec.diagram) {
          parts.push(`\n[Diagram: ${sec.diagram.title}]`);
        }
      });

      await navigator.clipboard.writeText(parts.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback if clipboard API unavailable
    }
  };

  return (
    <div>
      {/* Top Action Bar - Hidden in Print */}
      <div className="no-print mb-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            ✓ Document Ready
          </span>
          <span className="text-xs text-slate-500">
            {doc.sections.length} sections generated
          </span>
        </div>

        {/* Live region for copy feedback */}
        <div role="status" aria-live="polite" className="sr-only">
          {copied ? "Document markdown content copied to clipboard." : ""}
        </div>

        <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.12 }}
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 min-h-[44px] transition-colors"
          >
            Start Over
          </motion.button>
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.12 }}
            onClick={handleCopy}
            aria-label="Copy document text to clipboard"
            className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>{copied ? "✓ Copied!" : "📋 Copy"}</span>
          </motion.button>
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.12 }}
            onClick={onEdit}
            className="px-4 py-2 text-sm font-semibold rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] transition-colors"
          >
            Edit Content
          </motion.button>
          <motion.button
            type="button"
            whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.12 }}
            onClick={handlePrint}
            className="px-5 py-2 text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] flex items-center space-x-1.5 transition-colors"
          >
            <span aria-hidden="true">🖨️</span>
            <span>Print / Save as PDF</span>
          </motion.button>
        </div>
      </div>

      {/* Partial Failure Notices */}
      {notices && notices.length > 0 && (
        <div className="no-print mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
          <strong className="block font-bold mb-1">Partial formatting notice:</strong>
          <ul className="list-disc pl-4 space-y-1">
            {notices.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Flagged readings alert */}
      {doc.uncertain && doc.uncertain.length > 0 && (
        <aside
          aria-label="Flagged readings warning"
          className="no-print mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950"
        >
          <div className="flex items-center space-x-2 mb-1">
            <span aria-hidden="true">⚠️</span>
            <h2 className="text-sm font-bold">Readings to double-check ({doc.uncertain.length})</h2>
          </div>
          <p className="text-xs text-amber-800 mb-2">
            The AI flagged the following readings from your notes as slightly ambiguous or uncertain. You can click &quot;Edit Content&quot; to adjust them:
          </p>
          <ul className="space-y-1 text-xs">
            {doc.uncertain.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-semibold text-amber-900">&bull; &ldquo;{item.text}&rdquo;:</span>
                <span className="text-slate-700">{item.reason}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* Printable Semantic Study Document */}
      <article
        ref={printRef}
        className="print-document bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 text-slate-900"
      >
        <header className="border-b-2 border-slate-900 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950 mb-3">
            {doc.title}
          </h1>
          {doc.summary && (
            <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
              {doc.summary}
            </p>
          )}
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
            <span>Generated by NoteForge Study Guide Synthesizer</span>
            <span>{new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </header>

        <div className="space-y-10">
          {doc.sections.map((section, idx) => (
            <motion.section
              key={idx}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.25,
                delay: shouldReduceMotion ? 0 : Math.min(idx * 0.05, 0.25),
              }}
              className="space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
                {section.heading}
              </h2>

              {section.paragraphs && section.paragraphs.length > 0 && (
                <div className="space-y-3">
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-base text-slate-800 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-slate-800">
                  {section.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              )}

              {section.table && <TableView table={section.table} />}

              {section.diagram && <DiagramView diagram={section.diagram} />}
            </motion.section>
          ))}
        </div>
      </article>
    </div>
  );
}
