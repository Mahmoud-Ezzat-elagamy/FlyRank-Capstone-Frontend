"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Mode } from "@/lib/prompts";

interface ModeSelectorProps {
  mode: Mode;
  onChange: (mode: Mode) => void;
  disabled?: boolean;
}

const MODES: { id: Mode; title: string; desc: string }[] = [
  {
    id: "study_guide",
    title: "Study Guide (Recommended)",
    desc: "Organized topic sections, bullet summaries, comparison tables, and flowchart diagrams.",
  },
  {
    id: "meeting_summary",
    title: "Meeting Summary",
    desc: "Structured decisions, action items table (owner & due date), and open follow-up questions.",
  },
  {
    id: "summary_important_points",
    title: "Summary with Important Points",
    desc: "Executive overview accompanied by highlighted critical takeaways, must-know facts, and points.",
  },
];

export function ModeSelector({ mode, onChange, disabled }: ModeSelectorProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    let nextIdx = currentIdx;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      nextIdx = (currentIdx + 1) % MODES.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      nextIdx = (currentIdx - 1 + MODES.length) % MODES.length;
    } else {
      return;
    }
    e.preventDefault();
    const nextMode = MODES[nextIdx].id;
    onChange(nextMode);
    const nextRadio = document.getElementById(`mode-${nextMode.replace(/_/g, "-")}`);
    nextRadio?.focus();
  };

  return (
    <fieldset className="my-4">
      <legend className="block text-sm font-semibold text-slate-800 mb-2">
        Document Format Mode
      </legend>
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-3"
        role="radiogroup"
        aria-label="Document Format Mode"
      >
        {MODES.map((item, idx) => {
          const isSelected = mode === item.id;
          const inputId = `mode-${item.id.replace(/_/g, "-")}`;
          const titleId = `title-${item.id.replace(/_/g, "-")}`;
          const descId = `desc-${item.id.replace(/_/g, "-")}`;

          return (
            <motion.label
              key={item.id}
              htmlFor={inputId}
              whileHover={
                shouldReduceMotion || disabled
                  ? undefined
                  : { y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
              }
              whileTap={
                shouldReduceMotion || disabled
                  ? undefined
                  : { scale: 0.99 }
              }
              transition={{ duration: 0.15 }}
              className={`flex items-start p-3.5 rounded-lg border-2 cursor-pointer transition-colors min-h-[44px] focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 ${
                isSelected
                  ? "border-blue-600 bg-blue-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <input
                id={inputId}
                type="radio"
                name="document-mode"
                value={item.id}
                checked={isSelected}
                aria-checked={isSelected}
                onChange={() => onChange(item.id)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                disabled={disabled}
                aria-labelledby={titleId}
                aria-describedby={descId}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
              />
              <div className="ml-3">
                <span id={titleId} className="block text-sm font-bold text-slate-900">
                  {item.title}
                </span>
                <span id={descId} className="block text-xs text-slate-600 mt-0.5">
                  {item.desc}
                </span>
              </div>
            </motion.label>
          );
        })}
      </div>
    </fieldset>
  );
}


