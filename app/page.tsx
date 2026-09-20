import React from "react";
import Link from "next/link";
import fs from "fs";
import path from "path";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Eye,
  CheckCircle2,
  Table,
  Workflow,
  ShieldCheck,
  Zap,
  Printer,
  Compass,
  AlertTriangle,
  GraduationCap,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "NoteForge | Transform Notes into Accessible Study Documents",
  description:
    "NoteForge converts handwritten photos, pasted text, and Word files into clean, accessible study documents with sections, comparison tables, and flowchart diagrams.",
};

export default function MarketingHomePage() {
  // Read PROJECTPROOF.md from disk dynamically
  let projectProofText = "";
  try {
    const proofPath = path.join(process.cwd(), "PROJECTPROOF.md");
    projectProofText = fs.readFileSync(proofPath, "utf-8").trim();
  } catch (e) {
    projectProofText =
      "Students and professionals keep notes as messy handwriting or plain text, and turning them into something structured takes as long as taking the notes. NoteForge converts handwritten photos, pasted text, or Word files into a clean, accessible study document with sections, tables, and diagrams. It is built for students and anyone who takes notes by hand. I chose it because it combines vision, structured output, and accessibility in one workflow where AI does real work.";
  }

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* 1. HERO SECTION */}
      <section aria-labelledby="hero-heading" className="relative text-center max-w-4xl mx-auto px-4 sm:px-0">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600" aria-hidden="true" />
          <span>Multimodal Vision AI &bull; WCAG 2.1 AA Compliant</span>
        </div>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]"
        >
          Transform Messy Notes into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
            Polished Study Guides
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Convert handwritten photos, pasted lecture text, or Word documents into clean, structured study documents complete with comparison tables and flowchart diagrams in seconds.
        </p>

        {/* Primary CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/generate"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <span>Launch Generator</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <a
            href="#project-proof"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100/80 border border-slate-300 rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <Compass className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>View Project Proof</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm font-medium text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Zero Server Persistence
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            On-Device Image Downscaling
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Print-Ready Accessible PDF
          </span>
        </div>
      </section>

      {/* 2. PROJECT PROOF & CREATOR RATIONALE SHOWCASE */}
      <section
        id="project-proof"
        aria-labelledby="proof-heading"
        className="scroll-mt-20 bg-gradient-to-b from-blue-50/50 via-white to-slate-50 p-6 sm:p-10 rounded-2xl border-2 border-blue-200 shadow-sm"
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-200 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-md">
                Capstone Artifact: PROJECTPROOF.md
              </span>
              <h2 id="proof-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Project Proof & Creator Rationale
              </h2>
            </div>
            <span className="self-start sm:self-center text-xs font-semibold px-3 py-1 bg-white border border-blue-300 text-blue-700 rounded-full shadow-2xs">
              Direct File Verification
            </span>
          </div>

          {/* Full Proof Quote Display */}
          <div className="bg-white rounded-xl p-6 sm:p-8 border border-blue-100 shadow-xs relative">
            <div className="text-blue-200 absolute -top-4 left-6 text-6xl font-serif select-none" aria-hidden="true">
              “
            </div>
            <blockquote className="relative text-base sm:text-lg text-slate-800 font-medium leading-relaxed italic pl-2 sm:pl-4 border-l-4 border-blue-600">
              {projectProofText}
            </blockquote>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Source: <code className="text-blue-700 font-mono">PROJECTPROOF.md</code></span>
              <span>Audience: Students, Educators & Hand-Note Takers</span>
            </div>
          </div>

          {/* Breakdown of Core Proof Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                  !
                </div>
                <h3 className="font-bold text-slate-900">1. The Core Problem</h3>
              </div>
              <p className="text-sm text-slate-600 leading-normal">
                Turning chaotic handwriting and raw lecture dumps into structured notes takes just as long as taking the notes initially. Valuable study time is consumed by formatting.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                  ✓
                </div>
                <h3 className="font-bold text-slate-900">2. Structured Synthesis</h3>
              </div>
              <p className="text-sm text-slate-600 leading-normal">
                NoteForge parses photos, raw text, or Word documents into clean, semantic sections with automated comparison tables and visual flowchart diagrams.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">3. Target Audience</h3>
              </div>
              <p className="text-sm text-slate-600 leading-normal">
                Built specifically for students, STEM learners, and professionals who write notes by hand and need immediate, exam-ready review materials.
              </p>
            </div>

            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900">4. Real AI Workflow</h3>
              </div>
              <p className="text-sm text-slate-600 leading-normal">
                Not a shallow chatbot. NoteForge executes a disciplined pipeline combining multimodal vision, Zod-enforced structured JSON output, and WCAG accessibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS 3-STEP PIPELINE */}
      <section aria-labelledby="pipeline-heading" className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 id="pipeline-heading" className="text-3xl font-black text-slate-900 tracking-tight">
            How NoteForge Works
          </h2>
          <p className="mt-3 text-base text-slate-600">
            A reliable 3-step pipeline converting unstructured notes into accessible study documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Flexible Ingestion</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Upload a smartphone photo of your notebook, paste raw copied text, or drag and drop a Microsoft Word (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">.docx</code>) file.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-blue-700 font-semibold flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Browser canvas downscale to 1600px</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Gemini AI Synthesis</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Google Gemini reads the input, normalizes core concepts into sections, builds comparison tables, compiles Mermaid.js flowchart logic, and flags ambiguous handwriting readings.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-indigo-700 font-semibold flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              <span>Strict Zod JSON Schema Enforcement</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Review & Accessible PDF</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Verify flagged uncertain terms, edit headings or bullets in the keyboard-accessible editor, and generate a clean tagged PDF using browser print styles.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <Printer className="w-4 h-4" />
              <span>WCAG 2.1 AA Screen Reader Optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. KEY CAPABILITIES GRID */}
      <section aria-labelledby="features-heading" className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Engineered For Real Utility
          </span>
          <h2 id="features-heading" className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            What Makes NoteForge Different
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Designed from the ground up for privacy, accessibility, and high structural fidelity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Vision OCR & Downscaling</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Large phone photos are downscaled on the client canvas before transmission, staying well within serverless limits and preserving battery and bandwidth.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
              <Table className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Automatic Comparison Tables</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              When study notes contain contrasted items, formulas, or timelines, NoteForge constructs semantic HTML tables with captions and headers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <Workflow className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Mermaid.js Flowcharts</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Cycles, algorithms, and processes are compiled into visual flowcharts rendered client-side, accompanied by text descriptions for screen readers.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Flagged Reading Uncertainty</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              AI doesn’t hallucinate silently. Faded handwriting or ambiguous symbols are explicitly flagged in a &ldquo;Readings to double-check&rdquo; panel.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Zero Data Storage Privacy</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Notes are processed in-memory during document synthesis and never saved to any database or file system. Your lecture contents remain private.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">WCAG 2.1 AA Accessibility</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Built with skip-to-content links, live region status notifications, keyboard tab navigation, high color contrast, and fallback manual editor entry.
            </p>
          </div>
        </div>
      </section>

      {/* 5. LIVE CTA BANNER */}
      <section className="bg-blue-600 text-white rounded-2xl p-8 sm:p-12 text-center shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Ready to Format Your Notes in Seconds?
          </h2>
          <p className="text-blue-100 text-base sm:text-lg leading-relaxed">
            Experience how multimodal AI and accessibility turn messy handwriting into organized, exam-ready study documents.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-blue-700 bg-white hover:bg-blue-50 rounded-xl shadow-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              <Sparkles className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>Open NoteForge Generator</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
