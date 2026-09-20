"use client";

import React, { useState, useRef } from "react";
import { Mode } from "@/lib/prompts";
import { downscaleImage, ProcessedImage } from "@/lib/image";
import { extractTextFromDocx } from "@/lib/docx";
import { ModeSelector } from "./ModeSelector";

export interface GenerateInputPayload {
  mode: Mode;
  text?: string;
  image?: {
    base64Data: string;
    mimeType: string;
  };
}

interface InputPanelProps {
  onGenerate: (payload: GenerateInputPayload) => void;
  isLoading: boolean;
}

type TabType = "text" | "photo" | "docx";

const MAX_CHARS = 30000;

export function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [mode, setMode] = useState<Mode>("study_guide");
  const [textInput, setTextInput] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);

  // Image state
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Docx state
  const [docxFileName, setDocxFileName] = useState<string | null>(null);
  const [docxExtractedText, setDocxExtractedText] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setClientError(null);
    setIsProcessingImage(true);

    try {
      const processed = await downscaleImage(file);
      setProcessedImage(processed);
      setImageFileName(file.name);
    } catch (err: any) {
      setClientError(err?.message || "Failed to process image.");
      setProcessedImage(null);
      setImageFileName(null);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDocxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setClientError(null);

    if (!file.name.endsWith(".docx") && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      setClientError("Please select a valid Microsoft Word (.docx) document.");
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const extracted = await extractTextFromDocx(buffer);
      setDocxExtractedText(extracted);
      setDocxFileName(file.name);
    } catch (err: any) {
      setClientError(err?.message || "Could not extract text from Word document.");
      setDocxExtractedText(null);
      setDocxFileName(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    if (activeTab === "text") {
      const trimmed = textInput.trim();
      if (!trimmed) {
        setClientError("Please enter or paste your notes before submitting.");
        return;
      }
      if (trimmed.length > MAX_CHARS) {
        setClientError(`Text exceeds maximum allowed ${MAX_CHARS.toLocaleString()} characters.`);
        return;
      }
      onGenerate({ mode, text: trimmed });
    } else if (activeTab === "photo") {
      if (!processedImage) {
        setClientError("Please upload a photo of your handwritten or printed notes.");
        return;
      }
      onGenerate({
        mode,
        image: {
          base64Data: processedImage.base64Data,
          mimeType: processedImage.mimeType,
        },
      });
    } else if (activeTab === "docx") {
      if (!docxExtractedText) {
        setClientError("Please upload a .docx file containing notes.");
        return;
      }
      onGenerate({ mode, text: docxExtractedText });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Input Your Notes</h2>
      <p className="text-sm text-slate-600 mb-6">
        Upload photos of handwritten pages, paste messy lecture notes, or import a Word (.docx) document.
      </p>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 mb-6" role="tablist" aria-label="Input Method">
        <button
          type="button"
          role="tab"
          id="tab-text"
          aria-selected={activeTab === "text"}
          aria-controls="panel-text"
          onClick={() => { setActiveTab("text"); setClientError(null); }}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors min-h-[44px] ${
            activeTab === "text"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Paste Text
        </button>
        <button
          type="button"
          role="tab"
          id="tab-photo"
          aria-selected={activeTab === "photo"}
          aria-controls="panel-photo"
          onClick={() => { setActiveTab("photo"); setClientError(null); }}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors min-h-[44px] ${
            activeTab === "photo"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Photo of Notes
        </button>
        <button
          type="button"
          role="tab"
          id="tab-docx"
          aria-selected={activeTab === "docx"}
          aria-controls="panel-docx"
          onClick={() => { setActiveTab("docx"); setClientError(null); }}
          className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors min-h-[44px] ${
            activeTab === "docx"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Word File (.docx)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Text Area Tab */}
        {activeTab === "text" && (
          <div id="panel-text" role="tabpanel" aria-labelledby="tab-text">
            <label htmlFor="notes-textarea" className="block text-sm font-semibold text-slate-800 mb-2">
              Pasted Notes or Outline
            </label>
            <textarea
              id="notes-textarea"
              rows={8}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste raw lecture notes, brainstorm ideas, summaries, or messy thoughts..."
              disabled={isLoading}
              className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
            <div className="flex justify-between items-center text-xs text-slate-500 mt-1">
              <span>{textInput.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters</span>
              {textInput.length > MAX_CHARS && (
                <span className="text-red-600 font-medium">Exceeds limit</span>
              )}
            </div>
          </div>
        )}

        {/* Photo Upload Tab */}
        {activeTab === "photo" && (
          <div id="panel-photo" role="tabpanel" aria-labelledby="tab-photo">
            <label
              htmlFor="photo-file-input"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Upload Handwriting or Whiteboard Photo (JPEG, PNG, WebP up to 10 MB)
            </label>
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center hover:bg-slate-100 transition-colors">
              <input
                ref={fileInputRef}
                id="photo-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isLoading || isProcessingImage}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                >
                  Choose Image File
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Images are automatically compressed & downscaled client-side before uploading.
                </p>
              </div>

              {isProcessingImage && (
                <p className="mt-3 text-xs text-blue-600 font-semibold animate-pulse">
                  Optimizing image resolution...
                </p>
              )}

              {processedImage && imageFileName && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left text-xs text-blue-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{imageFileName}</span>
                    <span className="text-blue-700 ml-2">
                      ({processedImage.width}x{processedImage.height}px, ~{Math.round(processedImage.compressedSize / 1024)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setProcessedImage(null); setImageFileName(null); }}
                    className="text-red-600 hover:text-red-800 font-semibold ml-4 p-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Word Document (.docx) Tab */}
        {activeTab === "docx" && (
          <div id="panel-docx" role="tabpanel" aria-labelledby="tab-docx">
            <label
              htmlFor="docx-file-input"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Upload Microsoft Word (.docx) File
            </label>
            <div className="p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center hover:bg-slate-100 transition-colors">
              <input
                ref={docxInputRef}
                id="docx-file-input"
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleDocxChange}
                disabled={isLoading}
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <button
                  type="button"
                  onClick={() => docxInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                >
                  Choose .docx Document
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Extracts clean raw text directly in the browser via Mammoth.
                </p>
              </div>

              {docxFileName && docxExtractedText && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-left text-xs text-emerald-900 flex items-center justify-between">
                  <div>
                    <span className="font-bold">{docxFileName}</span>
                    <span className="text-emerald-700 ml-2">
                      ({docxExtractedText.length.toLocaleString()} characters extracted)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setDocxExtractedText(null); setDocxFileName(null); }}
                    className="text-red-600 hover:text-red-800 font-semibold ml-4 p-1"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mode Selector */}
        <ModeSelector mode={mode} onChange={setMode} disabled={isLoading} />

        {/* Client validation error */}
        {clientError && (
          <div role="alert" className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800">
            {clientError}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={isLoading || isProcessingImage}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Synthesizing Study Guide...</span>
              </>
            ) : (
              <span>Transform Into Study Guide</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
