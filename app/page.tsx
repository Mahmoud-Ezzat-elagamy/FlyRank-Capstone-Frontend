import React from "react";
import Link from "next/link";
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
  AlertTriangle,
  GraduationCap,
  Layers,
  BookOpen,
  Clock,
  SlidersHorizontal,
  FileUp,
  HelpCircle,
  ChevronDown,
  Lock,
  Smartphone,
  ArrowUpRight,
  Check,
} from "lucide-react";

export const metadata = {
  title: "NoteForge | Transform Notes into Accessible Study Documents",
  description:
    "NoteForge converts handwritten photos, pasted text, and Word files into clean, accessible study documents with sections, comparison tables, and flowchart diagrams.",
};

export default function MarketingHomePage() {
  const missionQuote =
    "Students and professionals keep notes as messy handwriting or plain text, and turning them into something structured takes as long as taking the notes. NoteForge converts handwritten photos, pasted text, or Word files into a clean, accessible study document with sections, tables, and diagrams. It is built for students and anyone who takes notes by hand. It combines vision, structured output, and accessibility in one workflow where AI does real work.";

  const specialFeatures = [
    {
      icon: Eye,
      title: "Multimodal Handwriting Vision",
      badge: "Real Handwriting",
      description:
        "Generic OCR fails on quick cursive, uneven smartphone lighting, and margin notes. NoteForge's vision AI reads real paper notebooks and whiteboard sketches with on-device canvas optimization.",
      color: "blue",
    },
    {
      icon: Layers,
      title: "Automated Structured Synthesis",
      badge: "Zero Prompting",
      description:
        "Skip the endless back-and-forth of chat windows. Submit your raw material and receive a publication-grade outline with semantic headings, concise summaries, and key takeaways.",
      color: "indigo",
    },
    {
      icon: Table,
      title: "Automated Comparison Tables",
      badge: "Side-by-Side Clarity",
      description:
        "When notes contrast concepts, formulas, or chronological stages, NoteForge automatically builds clean, accessible HTML comparison tables with headers and captions.",
      color: "emerald",
    },
    {
      icon: Workflow,
      title: "Mermaid.js Flowchart Generation",
      badge: "Visual Processes",
      description:
        "Sequential workflows, biochemical pathways, and logical decision trees are automatically turned into visual diagrams with full screen-reader text alternatives.",
      color: "purple",
    },
    {
      icon: AlertTriangle,
      title: "Reading Uncertainty Flagging",
      badge: "Zero Silent Hallucinations",
      description:
        "AI shouldn't guess silently. Ambiguous handwriting or smudged margins are transparently highlighted in a dedicated review panel so you always know what to double-check.",
      color: "amber",
    },
    {
      icon: ShieldCheck,
      title: "Zero-Retention In-Memory Privacy",
      badge: "100% Private",
      description:
        "Your notes and photos are processed transiently in serverless memory and never stored in a database or used for public AI model training. Your data remains strictly yours.",
      color: "rose",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Ingest Your Notes Your Way",
      subtitle: "Photo, text, or document",
      description:
        "Snap a photo of your handwritten notebook, paste raw lecture notes, or drag and drop a Microsoft Word (.docx) file. Large photos are optimized on-device before transmission.",
      icon: Smartphone,
      tags: ["Phone Photo", "Pasted Text", ".docx Word File"],
    },
    {
      step: "02",
      title: "Choose Your Study Mode",
      subtitle: "Tailored to your deadline",
      description:
        "Select Comprehensive Mode for in-depth conceptual mastery, Quick Review Mode for high-yield exam cramming, or Comparison Mode to highlight key contrasts.",
      icon: SlidersHorizontal,
      tags: ["Comprehensive", "Quick Review", "Comparison"],
    },
    {
      step: "03",
      title: "Review & Refine Live",
      subtitle: "Human-in-the-loop editing",
      description:
        "Review any handwriting readings flagged as uncertain. Edit document titles, section headers, or bullet points directly in the keyboard-accessible inline editor.",
      icon: AlertTriangle,
      tags: ["Flagged Readings", "Accessible Editor", "Instant Sync"],
    },
    {
      step: "04",
      title: "Study & Export Accessible PDF",
      subtitle: "Print-ready & screen-reader friendly",
      description:
        "Engage with responsive flowcharts and tables on your screen, or generate a WCAG 2.1 AA compliant, print-formatted PDF ready for physical revision or offline reading.",
      icon: Printer,
      tags: ["WCAG 2.1 AA", "Print-Ready PDF", "Assistive Ready"],
    },
  ];

  const targetAudiences = [
    {
      icon: GraduationCap,
      title: "STEM & University Students",
      desc: "Transform dense calculus derivations, thermodynamics cycles, and lab notes into structured, searchable review sheets.",
    },
    {
      icon: Zap,
      title: "Medicine & Biology Learners",
      desc: "Turn complex multi-step biochemical pathways, anatomical structures, and pharmacology classifications into visual flowcharts and comparison grids.",
    },
    {
      icon: BookOpen,
      title: "Certifications & Professionals",
      desc: "Convert quick meeting scribbles, certification cram notes, and workshop whiteboard diagrams into clean executive summaries.",
    },
    {
      icon: CheckCircle2,
      title: "Accessible & Neurodivergent Study",
      desc: "Convert chaotic, visually overwhelming handwriting into high-contrast, structured documents compatible with screen readers and dyslexia tools.",
    },
  ];

  const faqs = [
    {
      question: "Can NoteForge really decipher messy or cursive handwriting?",
      answer:
        "Yes! NoteForge uses advanced multimodal vision AI specifically tuned for handwritten notes, notebook lines, and margin scribbles. If a word or formula is faded or ambiguous, NoteForge will not guess silently—it marks it in a dedicated 'Readings to double-check' panel.",
    },
    {
      question: "How does NoteForge protect my personal notes and privacy?",
      answer:
        "Privacy is built into the architecture. All notes, text, and images are processed transiently in memory to generate your study document and are never stored in any database or file system. Your notes are never retained or used to train public AI models.",
    },
    {
      question: "What file formats can I upload?",
      answer:
        "You can upload smartphone photos (JPEG, PNG, WebP), paste raw copied text or lecture transcripts directly, or drag-and-drop Microsoft Word (.docx) documents. Smartphone photos are automatically compressed in your browser to save data and ensure rapid processing.",
    },
    {
      question: "How do the automatic comparison tables and flowcharts work?",
      answer:
        "NoteForge analyzes the conceptual structure of your notes. When it detects contrasting concepts (e.g. Mitosis vs. Meiosis), it generates an accessible HTML table. When it detects sequential or cyclical processes, it creates a visual Mermaid.js flowchart with text alternatives for screen readers.",
    },
    {
      question: "Can I edit the generated study guide before printing or saving?",
      answer:
        "Absolutely. NoteForge includes a built-in keyboard-accessible review editor. You can edit the title, refine headings, edit bullet points, and verify flagged ambiguous words with instant live re-rendering before exporting your accessible PDF.",
    },
    {
      question: "Do I need an account or subscription to use NoteForge?",
      answer:
        "No account, login, or credit card is required. NoteForge is designed for immediate utility—simply launch the generator and start turning your notes into polished study guides right away.",
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 py-4 sm:py-8">
      {/* 1. HERO SECTION */}
      <section aria-labelledby="hero-heading" className="relative text-center max-w-4xl mx-auto px-4 sm:px-0 pt-4">
        {/* Value Prop Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" aria-hidden="true" />
          <span>Multimodal Vision AI &bull; Structured Synthesis &bull; 100% In-Memory Privacy</span>
        </div>

        {/* Primary Heading */}
        <h1
          id="hero-heading"
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]"
        >
          Turn Messy Notes into{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
            Exam-Ready Study Guides
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Snap a photo of your handwritten notebook, paste raw lecture dumps, or drop Word files. NoteForge automatically synthesizes key concepts into organized outlines, comparison tables, and visual process flowcharts in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/generate"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <span>Launch Study Guide Generator</span>
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </Link>
          <a
            href="#how-to-use"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100/80 border border-slate-300 rounded-xl shadow-xs transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <Clock className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>See How It Works</span>
          </a>
          <a
            href="#what-makes-it-special"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 text-base font-semibold text-blue-700 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/80 rounded-xl transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <span>Why NoteForge?</span>
          </a>
        </div>

        {/* Trust Badges */}
        <div className="mt-10 pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center gap-y-2.5 gap-x-6 text-xs sm:text-sm font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            No Account Required
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            100% In-Memory Privacy
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            WCAG 2.1 AA Accessible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Printer className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            Print &amp; Export to PDF
          </span>
        </div>
      </section>

      {/* 2. PRODUCT TRANSFORMATION SHOWCASE (BEFORE & AFTER MOCKUP) */}
      <section aria-labelledby="showcase-heading" className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Instant Transformation
          </span>
          <h2 id="showcase-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            From Messy Handwriting to Clean Study Masterpiece
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            See how NoteForge deciphers unstructured notebook pages into structured hierarchy, contrast tables, and visual workflows.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Before: Raw Scribbled Notes */}
          <div className="lg:col-span-5 bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 rounded-2xl p-6 border-2 border-amber-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-amber-200/60 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    Input: Raw Paper Notebook
                  </span>
                </div>
                <span className="text-[11px] font-medium text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded">
                  Photo / Unstructured
                </span>
              </div>

              {/* Scribble Simulation Content */}
              <div className="space-y-3 font-mono text-xs text-slate-700 bg-white/90 p-4 rounded-xl border border-amber-200/50 shadow-inner">
                <div className="text-slate-400 text-[10px]"># Cell Division Lecture - Oct 14</div>
                <p className="font-semibold text-slate-800">
                  mitosis vs meiosis? (important for midterm!)
                </p>
                <div className="space-y-1 text-slate-600 pl-2 border-l-2 border-amber-300">
                  <p>- mitosis = 2 identical daughter cells (2n -&gt; 2n)</p>
                  <p>- meiosis = 4 haploid gametes (2n -&gt; n), crossing over!</p>
                  <p>- stages: prophase -&gt; meta -&gt; ana -&gt; telo</p>
                  <p className="text-amber-800 bg-amber-100/60 px-1 rounded inline-block">
                    *smudged note: spindle fibers attach to kinetochore?
                  </p>
                </div>
                <div className="pt-2 text-[11px] text-slate-500 italic">
                  &ldquo;Arrows drawn across margins, uneven lighting, hasty handwriting...&rdquo;
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-amber-900">
              <span className="flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-amber-700" />
                Raw smartphone camera photo
              </span>
              <span className="font-semibold text-amber-800">45 mins to rewrite manually</span>
            </div>
          </div>

          {/* Transformation Bridge / Badge */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-2">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider text-center">
              AI Vision &amp; Synthesis
            </span>
            <span className="text-[11px] text-slate-500 text-center mt-1">&lt; 10 Seconds</span>
            <div className="hidden lg:block w-0.5 h-8 bg-blue-200 my-2" />
            <div className="flex lg:flex-col gap-2 mt-2">
              <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                Structured Tables
              </span>
              <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full font-medium">
                Flowcharts
              </span>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                Accessible PDF
              </span>
            </div>
          </div>

          {/* After: Synthesized Study Guide */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Output: NoteForge Study Document
                  </span>
                </div>
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Ready to Study
                </span>
              </div>

              {/* Formatted Guide Preview */}
              <div className="space-y-3 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Cell Division: Mitosis vs. Meiosis Mechanisms
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Synthesized overview of genetic replication, division stages, and recombination.
                  </p>
                </div>

                {/* Mini Comparison Table */}
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50/50">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-1.5">Feature</th>
                        <th className="p-1.5">Mitosis</th>
                        <th className="p-1.5">Meiosis</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-600">
                      <tr>
                        <td className="p-1.5 font-medium text-slate-800">Daughter Cells</td>
                        <td className="p-1.5">2 diploid (2n)</td>
                        <td className="p-1.5">4 haploid (n)</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-medium text-slate-800">Recombination</td>
                        <td className="p-1.5">None</td>
                        <td className="p-1.5">Crossing over (Prophase I)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Mini Process Diagram Preview */}
                <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 font-medium text-blue-900">
                    <Workflow className="w-3.5 h-3.5 text-blue-600" />
                    <span>Visual Cycle:</span>
                    <span className="font-mono text-[10px] text-blue-700">Prophase &rarr; Metaphase &rarr; Anaphase &rarr; Telophase</span>
                  </div>
                  <span className="text-[10px] bg-white text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                    Mermaid.js
                  </span>
                </div>

                {/* Flagged Review Banner */}
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-1.5 text-[11px] text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Flagged reading: &ldquo;kinetochore attachment&rdquo; (verified)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                WCAG 2.1 AA Compliant
              </span>
              <Link
                href="/generate"
                className="font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <span>Try this now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT MAKES NOTEFORGE SPECIAL (KEY DIFFERENTIATORS) */}
      <section
        id="what-makes-it-special"
        aria-labelledby="special-heading"
        className="max-w-6xl mx-auto px-4 sm:px-0 scroll-mt-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            Why NoteForge
          </span>
          <h2 id="special-heading" className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            What Makes NoteForge Special?
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Unlike generic AI chatbots that output blocks of conversational text, NoteForge is a purpose-built study document synthesizer engineered for fidelity, structure, and accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {specialFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                      <Icon className="w-6 h-6" aria-hidden="true" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                  <span>Engineered for study fidelity &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. HOW TO USE NOTEFORGE (STEP-BY-STEP WORKFLOW GUIDE) */}
      <section
        id="how-to-use"
        aria-labelledby="how-heading"
        className="max-w-6xl mx-auto px-4 sm:px-0 scroll-mt-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3.5 py-1 rounded-full border border-indigo-200">
            Simple 4-Step Process
          </span>
          <h2 id="how-heading" className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
            How to Use NoteForge
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Go from chaotic notebook scribbles to an organized, accessible study document in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs relative flex flex-col justify-between hover:border-slate-300 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-blue-600/30">
                      {st.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                    {st.subtitle}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2.5">
                    {st.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {st.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {st.tags.map((tg, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md"
                    >
                      {tg}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Try Button */}
        <div className="mt-10 text-center">
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/30"
          >
            <span>Try the 4-Step Flow Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. THE PROBLEM WE SOLVE & MISSION STATEMENT */}
      <section
        id="problem-solved"
        aria-labelledby="problem-heading"
        className="bg-gradient-to-b from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800/80">
              The Real Problem
            </span>
            <h2 id="problem-heading" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-3">
              Why We Built NoteForge
            </h2>
            <p className="text-slate-300 text-sm sm:text-base mt-2">
              Formatting study notes shouldn&apos;t take longer than the lecture itself.
            </p>
          </div>

          {/* Core Problem Narrative Quote */}
          <div className="bg-slate-800/80 rounded-2xl p-6 sm:p-8 border border-slate-700 relative backdrop-blur-xs">
            <div className="text-blue-500/30 absolute -top-4 left-6 text-6xl font-serif select-none" aria-hidden="true">
              “
            </div>
            <blockquote className="relative text-base sm:text-lg text-slate-200 font-normal leading-relaxed italic pl-2 sm:pl-4 border-l-4 border-blue-500">
              {missionQuote}
            </blockquote>
            <div className="mt-5 pt-4 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
              <span>NoteForge Synthesis Engine</span>
              <span>Built for high-fidelity, accessible study materials</span>
            </div>
          </div>

          {/* Time & Productivity Comparison Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/70 text-center">
              <span className="text-3xl font-black text-amber-400">45 Mins</span>
              <p className="text-xs text-slate-300 mt-1 font-medium">Average manual note reformatting per class</p>
            </div>
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/70 text-center">
              <span className="text-3xl font-black text-emerald-400">&lt; 10 Secs</span>
              <p className="text-xs text-slate-300 mt-1 font-medium">Instant NoteForge AI synthesis time</p>
            </div>
            <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700/70 text-center">
              <span className="text-3xl font-black text-blue-400">100%</span>
              <p className="text-xs text-slate-300 mt-1 font-medium">WCAG 2.1 AA screen-reader tagged structure</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHO NOTEFORGE IS BUILT FOR */}
      <section aria-labelledby="audience-heading" className="max-w-6xl mx-auto px-4 sm:px-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
            Tailored For Learners
          </span>
          <h2 id="audience-heading" className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Who Uses NoteForge?
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Designed for anyone who relies on handwritten notes and needs rapid, structured review materials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {targetAudiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <h3 className="font-bold text-base text-slate-900 mb-2">
                  {aud.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {aud.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <section aria-labelledby="faq-heading" className="max-w-4xl mx-auto px-4 sm:px-0">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Common Inquiries
          </span>
          <h2 id="faq-heading" className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Everything you need to know about NoteForge, security, and document synthesis.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group bg-white rounded-xl border border-slate-200 p-5 shadow-2xs open:border-blue-300 open:shadow-xs transition-all"
            >
              <summary className="flex items-center justify-between font-bold text-slate-900 text-base cursor-pointer list-none select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded">
                <span>{faq.question}</span>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform duration-200 shrink-0 ml-4" />
              </summary>
              <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* 8. LIVE CONVERSION CTA BANNER */}
      <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-8 sm:p-14 text-center shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
            <span>Start studying smarter in seconds</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Stop Formatting Notes. <br className="hidden sm:block" />
            Start Mastering Your Material.
          </h2>

          <p className="text-blue-100 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Experience how multimodal AI vision, structured tables, and flowchart logic turn chaotic handwriting into clean, accessible study documents.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/generate"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-blue-700 bg-white hover:bg-blue-50 active:bg-blue-100 rounded-xl shadow-lg transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              <Sparkles className="w-5 h-5 text-blue-600" aria-hidden="true" />
              <span>Launch NoteForge Free</span>
            </Link>
          </div>

          <p className="text-xs text-blue-200">
            Free to use &bull; No credit card or registration &bull; Complete privacy
          </p>
        </div>
      </section>
    </div>
  );
}
