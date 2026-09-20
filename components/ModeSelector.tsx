import React from "react";
import type { Mode } from "@/lib/prompts";

interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}

export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  return (
    <fieldset className="my-4">
      <legend className="block text-sm font-semibold text-slate-800 mb-2">
        Document Format Mode
      </legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Synthesis Mode">
        <label
          className={`flex items-start p-3.5 rounded-lg border-2 cursor-pointer transition-colors min-h-[44px] ${
            mode === "study_guide"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name="document-mode"
            value="study_guide"
            checked={mode === "study_guide"}
            onChange={() => onChange("study_guide")}
            disabled={disabled}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <div className="ml-3">
            <span className="block text-sm font-bold text-slate-900">
              Study Guide (Recommended)
            </span>
            <span className="block text-xs text-slate-600 mt-0.5">
              Organized topic sections, bullet summaries, comparison tables, and flowchart diagrams.
            </span>
          </div>
        </label>

        <label
          className={`flex items-start p-3.5 rounded-lg border-2 cursor-pointer transition-colors min-h-[44px] ${
            mode === "meeting_summary"
              ? "border-blue-600 bg-blue-50/50 shadow-sm"
              : "border-slate-200 bg-white hover:border-slate-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          <input
            type="radio"
            name="document-mode"
            value="meeting_summary"
            checked={mode === "meeting_summary"}
            onChange={() => onChange("meeting_summary")}
            disabled={disabled}
            className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
          />
          <div className="ml-3">
            <span className="block text-sm font-bold text-slate-900">
              Meeting Summary
            </span>
            <span className="block text-xs text-slate-600 mt-0.5">
              Structured decisions, action items table (owner & due date), and open follow-up questions.
            </span>
          </div>
        </label>
      </div>
    </fieldset>
  );
}
