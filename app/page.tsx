"use client";

import React, { useState, useRef } from "react";
import { NoteDoc } from "@/lib/schema";
import { AppErrorPayload } from "@/lib/errors";
import { InputPanel, GenerateInputPayload } from "@/components/InputPanel";
import { ReviewEditor } from "@/components/ReviewEditor";
import { DocumentView } from "@/components/DocumentView";
import { ErrorState } from "@/components/ErrorState";
import { StatusRegion } from "@/components/StatusRegion";

type AppView = "input" | "review" | "document";

const EMPTY_MANUAL_DOC: NoteDoc = {
  title: "New Study Guide",
  summary: "Brief overview of core topics and study concepts.",
  sections: [
    {
      heading: "1. Core Concepts",
      paragraphs: ["Enter detailed explanations and key lecture notes here."],
      bullets: ["First key takeaway", "Second key takeaway"],
    },
  ],
  uncertain: [],
};

export default function HomePage() {
  const [currentView, setCurrentView] = useState<AppView>("input");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorPayload, setErrorPayload] = useState<AppErrorPayload | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<NoteDoc | null>(null);
  const [notices, setNotices] = useState<string[]>([]);
  const [lastPayload, setLastPayload] = useState<GenerateInputPayload | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);

  const handleGenerate = async (payload: GenerateInputPayload) => {
    setIsLoading(true);
    setStatusMessage("Synthesizing notes into structured study document...");
    setErrorPayload(null);
    setLastPayload(payload);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.error || {
          code: "AI_UNAVAILABLE",
          message: "Failed to communicate with the study guide synthesis service.",
        };
      }

      setGeneratedDoc(data.doc);
      setNotices(data.notices || []);
      setCurrentView("document");
      setStatusMessage("Study guide generation complete.");

      // Shift focus to document title for screen reader accessibility
      setTimeout(() => {
        headingRef.current?.focus();
      }, 100);
    } catch (err: any) {
      const parsedError: AppErrorPayload = {
        code: err.code || "AI_UNAVAILABLE",
        message: err.message || "An error occurred while generating your study guide.",
        retryAfter: err.retryAfter,
      };
      setErrorPayload(parsedError);
      setStatusMessage(`Error: ${parsedError.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleGenerate(lastPayload);
    }
  };

  const handleManualEntry = () => {
    setGeneratedDoc(EMPTY_MANUAL_DOC);
    setErrorPayload(null);
    setCurrentView("review");
    setStatusMessage("Switched to manual document editor.");
  };

  const handleReset = () => {
    setCurrentView("input");
    setGeneratedDoc(null);
    setErrorPayload(null);
    setNotices([]);
    setStatusMessage("Ready for new notes.");
  };

  return (
    <div className="space-y-8">
      {/* Accessible Polite Live Region */}
      <StatusRegion status={statusMessage} isLoading={isLoading} />

      {/* Main App Header Section (Hidden in Print) */}
      <div className="no-print">
        <div className="max-w-3xl">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
          >
            Transform Messy Notes into Polished Study Guides
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            NoteForge uses Google Gemini AI to turn handwritten notebooks, lecture text, and Word docs into accessible, structured study documents with comparison tables and flowchart diagrams.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {errorPayload && (
        <ErrorState
          error={errorPayload}
          onRetry={handleRetry}
          onManualEntry={handleManualEntry}
        />
      )}

      {/* View 1: Input Panel */}
      {currentView === "input" && (
        <div className="no-print">
          <InputPanel onGenerate={handleGenerate} isLoading={isLoading} />

          <section id="how-it-works" className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4">How NoteForge Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 block mb-2">1. Input</span>
                <p>Upload a photo of handwritten notes, paste raw text, or drop in a .docx file. Images are downscaled safely in your browser.</p>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 block mb-2">2. Structure</span>
                <p>Gemini AI extracts key topics, compiles comparison tables, generates flowchart logic, and flags ambiguous handwriting.</p>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                <span className="text-2xl font-bold text-blue-600 block mb-2">3. Review & PDF</span>
                <p>Edit or add sections in the accessible editor, review flagged readings, and save an accessible, tagged PDF via browser print.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* View 2: Review & Edit */}
      {currentView === "review" && generatedDoc && (
        <div className="no-print">
          <ReviewEditor
            doc={generatedDoc}
            onChange={(updated) => setGeneratedDoc(updated)}
            onPreview={() => setCurrentView("document")}
          />
        </div>
      )}

      {/* View 3: Formatted Document & Print Preview */}
      {currentView === "document" && generatedDoc && (
        <div>
          <DocumentView
            doc={generatedDoc}
            notices={notices}
            onEdit={() => setCurrentView("review")}
            onReset={handleReset}
          />
        </div>
      )}
    </div>
  );
}
