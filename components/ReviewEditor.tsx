"use client";

import React, { useState } from "react";
import type { NoteDoc, Section, UncertainItem } from "@/lib/schema";

interface ReviewEditorProps {
  doc: NoteDoc;
  onChange: (updatedDoc: NoteDoc) => void;
  onPreview: () => void;
}

export function ReviewEditor({ doc, onChange, onPreview }: ReviewEditorProps) {
  const [localDoc, setLocalDoc] = useState<NoteDoc>(doc);

  const updateTitle = (newTitle: string) => {
    const updated = { ...localDoc, title: newTitle };
    setLocalDoc(updated);
    onChange(updated);
  };

  const updateSummary = (newSummary: string) => {
    const updated = { ...localDoc, summary: newSummary };
    setLocalDoc(updated);
    onChange(updated);
  };

  const updateSectionHeading = (index: number, newHeading: string) => {
    const updatedSections = [...localDoc.sections];
    updatedSections[index] = { ...updatedSections[index], heading: newHeading };
    const updated = { ...localDoc, sections: updatedSections };
    setLocalDoc(updated);
    onChange(updated);
  };

  const updateSectionParagraph = (sectionIdx: number, pIdx: number, text: string) => {
    const updatedSections = [...localDoc.sections];
    const paras = [...(updatedSections[sectionIdx].paragraphs || [])];
    paras[pIdx] = text;
    updatedSections[sectionIdx] = { ...updatedSections[sectionIdx], paragraphs: paras };
    const updated = { ...localDoc, sections: updatedSections };
    setLocalDoc(updated);
    onChange(updated);
  };

  const updateSectionBullet = (sectionIdx: number, bIdx: number, text: string) => {
    const updatedSections = [...localDoc.sections];
    const bullets = [...(updatedSections[sectionIdx].bullets || [])];
    bullets[bIdx] = text;
    updatedSections[sectionIdx] = { ...updatedSections[sectionIdx], bullets };
    const updated = { ...localDoc, sections: updatedSections };
    setLocalDoc(updated);
    onChange(updated);
  };

  const deleteSection = (index: number) => {
    if (localDoc.sections.length <= 1) {
      alert("A study guide must have at least one section.");
      return;
    }
    const updatedSections = localDoc.sections.filter((_, i) => i !== index);
    const updated = { ...localDoc, sections: updatedSections };
    setLocalDoc(updated);
    onChange(updated);
  };

  const addSection = () => {
    const newSection: Section = {
      heading: `Section ${localDoc.sections.length + 1}`,
      paragraphs: ["Add your notes or explanations here."],
      bullets: [],
    };
    const updated = { ...localDoc, sections: [...localDoc.sections, newSection] };
    setLocalDoc(updated);
    onChange(updated);
  };

  const dismissUncertain = (index: number) => {
    const updatedUncertain = localDoc.uncertain.filter((_, i) => i !== index);
    const updated = { ...localDoc, uncertain: updatedUncertain };
    setLocalDoc(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-slate-200 mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Review & Edit Guide</h2>
          <p className="text-sm text-slate-600">
            Make any corrections, add insights, or resolve flagged handwriting readings.
          </p>
        </div>
        <button
          type="button"
          onClick={onPreview}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
        >
          View Formatted Document →
        </button>
      </div>

      {/* Flagged Readings to double check */}
      {localDoc.uncertain && localDoc.uncertain.length > 0 && (
        <section
          aria-labelledby="readings-heading"
          className="mb-8 p-5 bg-amber-50 border-2 border-amber-300 rounded-xl"
        >
          <div className="flex items-center space-x-2 text-amber-900 mb-2">
            <span aria-hidden="true" className="text-xl">⚠️</span>
            <h3 id="readings-heading" className="font-bold text-base">
              Readings to double-check
            </h3>
          </div>
          <p className="text-xs text-amber-800 mb-3">
            The AI detected handwriting or terms that were slightly ambiguous or smudged. Please verify them against your notes:
          </p>
          <ul className="space-y-2">
            {localDoc.uncertain.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start justify-between p-3 bg-white rounded-lg border border-amber-200 text-xs text-slate-800"
              >
                <div>
                  <span className="inline-block font-bold text-amber-950 bg-amber-100 px-2 py-0.5 rounded mr-2">
                    [Flagged] &ldquo;{item.text}&rdquo;
                  </span>
                  <span className="text-slate-600">Reason: {item.reason}</span>
                </div>
                <button
                  type="button"
                  onClick={() => dismissUncertain(idx)}
                  className="ml-3 text-slate-500 hover:text-slate-900 font-semibold p-1 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
                  aria-label={`Dismiss warning for ${item.text}`}
                >
                  Dismiss
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Title Field */}
      <div className="mb-6">
        <label htmlFor="doc-title-input" className="block text-sm font-bold text-slate-800 mb-1">
          Document Title
        </label>
        <input
          id="doc-title-input"
          type="text"
          value={localDoc.title}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full text-lg font-bold text-slate-900 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Summary Field */}
      <div className="mb-8">
        <label htmlFor="doc-summary-input" className="block text-sm font-bold text-slate-800 mb-1">
          Executive Summary
        </label>
        <textarea
          id="doc-summary-input"
          rows={3}
          value={localDoc.summary}
          onChange={(e) => updateSummary(e.target.value)}
          className="w-full text-sm text-slate-800 p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Sections List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Document Sections</h3>
          <button
            type="button"
            onClick={addSection}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[36px]"
          >
            + Add New Section
          </button>
        </div>

        {localDoc.sections.map((section, sIdx) => (
          <div
            key={sIdx}
            className="p-5 rounded-xl border border-slate-200 bg-slate-50 relative group"
          >
            <div className="flex items-center justify-between mb-3">
              <label
                htmlFor={`section-heading-${sIdx}`}
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Section {sIdx + 1} Heading
              </label>
              <button
                type="button"
                onClick={() => deleteSection(sIdx)}
                className="text-xs font-semibold text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[36px]"
                aria-label={`Delete section ${section.heading}`}
              >
                Delete Section
              </button>
            </div>

            <input
              id={`section-heading-${sIdx}`}
              type="text"
              value={section.heading}
              onChange={(e) => updateSectionHeading(sIdx, e.target.value)}
              className="w-full font-bold text-slate-900 p-2.5 rounded-lg border border-slate-300 bg-white mb-4 focus:ring-2 focus:ring-blue-600"
            />

            {/* Paragraphs */}
            {section.paragraphs && section.paragraphs.length > 0 && (
              <div className="space-y-2 mb-4">
                <span className="block text-xs font-semibold text-slate-600">Paragraphs:</span>
                {section.paragraphs.map((p, pIdx) => (
                  <textarea
                    key={pIdx}
                    rows={2}
                    value={p}
                    aria-label={`Section ${sIdx + 1} paragraph ${pIdx + 1}`}
                    onChange={(e) => updateSectionParagraph(sIdx, pIdx, e.target.value)}
                    className="w-full text-sm text-slate-800 p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600"
                  />
                ))}
              </div>
            )}

            {/* Bullets */}
            {section.bullets && section.bullets.length > 0 && (
              <div className="space-y-2 mb-4">
                <span className="block text-xs font-semibold text-slate-600">Key Points:</span>
                {section.bullets.map((b, bIdx) => (
                  <input
                    key={bIdx}
                    type="text"
                    value={b}
                    aria-label={`Section ${sIdx + 1} bullet ${bIdx + 1}`}
                    onChange={(e) => updateSectionBullet(sIdx, bIdx, e.target.value)}
                    className="w-full text-sm text-slate-800 p-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-600"
                  />
                ))}
              </div>
            )}

            {/* Table indicator */}
            {section.table && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 mb-2">
                <strong>Table included:</strong> {section.table.caption} ({section.table.rows.length} rows)
              </div>
            )}

            {/* Diagram indicator */}
            {section.diagram && (
              <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                <strong>Flowchart included:</strong> {section.diagram.title} ({section.diagram.nodes.length} nodes)
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
