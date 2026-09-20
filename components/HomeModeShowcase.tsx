"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle,
  FileText,
  Table as TableIcon,
  Workflow,
  Sparkles,
  ArrowRight,
  ListChecks,
  Key,
} from "lucide-react";

type ShowcaseMode = "summary_important_points" | "study_guide" | "meeting_summary";

export function HomeModeShowcase() {
  const [selectedMode, setSelectedMode] = useState<ShowcaseMode>("summary_important_points");
  const shouldReduceMotion = useReducedMotion();

  const modes = [
    {
      id: "summary_important_points" as ShowcaseMode,
      label: "Summary & Conclude Points",
      tag: "NEW FEATURE",
      headline: "Conclude & Summarize Items with Key Points",
      tagline:
        "Instantly distill lectures, documents, and transcripts into high-impact executive summaries and highlighted critical takeaways.",
      icon: Sparkles,
      color: "amber",
    },
    {
      id: "study_guide" as ShowcaseMode,
      label: "Study Guide",
      tag: "COMPREHENSIVE",
      headline: "Complete Study Guide with Tables & Flowcharts",
      tagline:
        "Organized topic sections, concept breakdowns, comparison tables, and visual process flowcharts.",
      icon: BookOpen,
      color: "blue",
    },
    {
      id: "meeting_summary" as ShowcaseMode,
      label: "Meeting Summary",
      tag: "ACTIONABLE",
      headline: "Decisions & Action Items Tracker",
      tagline:
        "Extract key decisions, assignable action items with owners and deadlines, and open follow-up questions.",
      icon: ListChecks,
      color: "emerald",
    },
  ];

  const activeModeData = modes.find((m) => m.id === selectedMode) || modes[0];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3.5 py-1 rounded-full border border-amber-200 inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
          <span>3 Powerful Document Formats</span>
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-3">
          Choose How NoteForge Synthesizes Your Notes
        </h3>
        <p className="mt-2 text-sm sm:text-base text-slate-600">
          Whether you need to <span className="font-semibold text-slate-900">conclude and summarize key items</span>, build an exam study guide, or organize meeting action points.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div
        role="tablist"
        aria-label="Document Mode Showcase"
        className="flex justify-center p-1.5 bg-slate-100/80 rounded-2xl max-w-xl mx-auto mb-8 gap-1.5 flex-col sm:flex-row"
      >
        {modes.map((m) => {
          const isSelected = selectedMode === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              role="tab"
              id={`showcase-tab-${m.id}`}
              aria-selected={isSelected}
              aria-controls={`showcase-panel-${m.id}`}
              type="button"
              onClick={() => setSelectedMode(m.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                isSelected
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  m.color === "amber"
                    ? "text-amber-600"
                    : m.color === "emerald"
                    ? "text-emerald-600"
                    : "text-blue-600"
                }`}
                aria-hidden="true"
              />
              <span>{m.label}</span>
              {m.id === "summary_important_points" && (
                <span className="hidden lg:inline-block text-[9px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-black tracking-wider">
                  NEW
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Animated Content Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMode}
          id={`showcase-panel-${selectedMode}`}
          role="tabpanel"
          aria-labelledby={`showcase-tab-${selectedMode}`}
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl border-2 border-slate-200 bg-slate-50/50 p-6 sm:p-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-200/80 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {activeModeData.tag}
                </span>
                <span className="text-xs text-slate-500 font-medium">Format Output</span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeModeData.headline}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                {activeModeData.tagline}
              </p>
            </div>

            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <span>Use This Mode</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>

          {/* Mode Preview Display */}
          {selectedMode === "summary_important_points" && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200/80">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Executive Summary &amp; Overview</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Quantum mechanics introduces fundamental wave-particle duality and probabilistic behavior at atomic scales, departing from deterministic Newtonian trajectories.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2.5">
                  <Key className="w-4 h-4 text-amber-600" aria-hidden="true" />
                  <span>Crucial &amp; Important Points</span>
                </div>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span><strong>Heisenberg Uncertainty Principle:</strong> $\Delta x \cdot \Delta p \ge \hbar/2$ — precision of position limits momentum certainty.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span><strong>Planck-Einstein Relation:</strong> $E = hf$ establishes energy quantization in discrete quanta.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                    <span><strong>Schrödinger Wavefunction:</strong> $|\psi|^2$ gives probability density rather than definite position.</span>
                  </li>
                </ul>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/60 flex items-center justify-between text-xs text-blue-900">
                <span className="font-semibold">Actionable Conclusions: Focus review on duality equations and wavefunction boundary conditions.</span>
                <span className="text-[11px] font-bold bg-white text-blue-700 px-2 py-0.5 rounded border border-blue-200">
                  Highlighted
                </span>
              </div>
            </div>
          )}

          {selectedMode === "study_guide" && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50/70 rounded-xl border border-blue-200/70">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-sm mb-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <span>1. Core Concepts &amp; Theories</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  Detailed conceptual definitions with bulleted breakdowns, comprehensive topic coverage, and deep analytical explanations.
                </p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                  <TableIcon className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Automatic Comparison Table</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Concept</th>
                        <th className="p-2">Classical Physics</th>
                        <th className="p-2">Quantum Physics</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2 font-medium text-slate-900">Determinism</td>
                        <td className="p-2">Deterministic trajectories</td>
                        <td className="p-2">Probabilistic wavefunctions</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-slate-900">Energy States</td>
                        <td className="p-2">Continuous spectrum</td>
                        <td className="p-2">Discrete quantized levels</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/60 flex items-center justify-between text-xs text-purple-900">
                <span className="flex items-center gap-1.5 font-medium">
                  <Workflow className="w-4 h-4 text-purple-600" aria-hidden="true" />
                  Flowchart visualization with screen-reader text alternatives.
                </span>
                <span className="text-[11px] font-bold bg-white text-purple-700 px-2 py-0.5 rounded border border-purple-200">
                  Mermaid.js
                </span>
              </div>
            </div>
          )}

          {selectedMode === "meeting_summary" && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/70">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Key Decisions Made</span>
                </div>
                <ul className="space-y-1 text-xs sm:text-sm text-slate-700">
                  <li>&bull; Approved Q4 product launch roadmap for mid-November.</li>
                  <li>&bull; Allocated dedicated resources for WCAG 2.1 AA accessibility audit.</li>
                </ul>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-2">
                  <TableIcon className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                  <span>Action Items Table (Owner &amp; Due Date)</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2">Task</th>
                        <th className="p-2">Owner</th>
                        <th className="p-2">Due Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      <tr>
                        <td className="p-2 font-medium text-slate-900">Finalize PDF export styles</td>
                        <td className="p-2">Design Lead</td>
                        <td className="p-2">Oct 28</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-medium text-slate-900">Run end-to-end user testing</td>
                        <td className="p-2">QA Team</td>
                        <td className="p-2">Nov 02</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
