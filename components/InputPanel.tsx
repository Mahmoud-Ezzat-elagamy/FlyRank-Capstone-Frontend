"use client";

import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Mode } from "@/lib/prompts";
import { downscaleImage, ProcessedImage } from "@/lib/image";
import { extractTextFromDocx } from "@/lib/docx";
import { extractTextFromPdf } from "@/lib/pdf";
import { ModeSelector } from "./ModeSelector";

export interface GenerateInputPayload {
  mode: Mode;
  text?: string;
  image?: {
    base64Data: string;
    mimeType: string;
  };
  pdf?: {
    base64Data: string;
    mimeType: string;
  };
}

interface InputPanelProps {
  onGenerate: (payload: GenerateInputPayload) => void;
  isLoading: boolean;
}

type TabType = "text" | "photo" | "docx" | "pdf";

const MAX_CHARS = 30000;

export function InputPanel({ onGenerate, isLoading }: InputPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<TabType>("text");
  const [mode, setMode] = useState<Mode>("study_guide");
  const [textInput, setTextInput] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [a11yStatus, setA11yStatus] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Image state
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  // Docx state
  const [docxFileName, setDocxFileName] = useState<string | null>(null);
  const [docxExtractedText, setDocxExtractedText] = useState<string | null>(null);

  // PDF state
  const [pdfFileName, setPdfFileName] = useState<string | null>(null);
  const [pdfExtractedText, setPdfExtractedText] = useState<string | null>(null);
  const [pdfTotalPages, setPdfTotalPages] = useState<number | null>(null);
  const [pdfBase64, setPdfBase64] = useState<string | null>(null);
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const docxInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const processImageFile = async (file: File) => {
    setClientError(null);
    setIsProcessingImage(true);
    setA11yStatus("Optimizing image resolution, please wait...");

    try {
      const processed = await downscaleImage(file);
      setProcessedImage(processed);
      setImageFileName(file.name);
      setA11yStatus(`Image "${file.name}" processed successfully (${processed.width} by ${processed.height} pixels).`);
    } catch (err: any) {
      const msg = err?.message || "Failed to process image.";
      setClientError(msg);
      setA11yStatus(`Error: ${msg}`);
      setProcessedImage(null);
      setImageFileName(null);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processImageFile(file);
  };

  const readFileArrayBuffer = async (file: File): Promise<ArrayBuffer> => {
    if (typeof file.arrayBuffer === "function") {
      return await file.arrayBuffer();
    }
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = (err) => reject(err);
      reader.readAsArrayBuffer(file);
    });
  };

  const processDocxFile = async (file: File) => {
    setClientError(null);

    if (!file.name.endsWith(".docx") && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const msg = "Please select a valid Microsoft Word (.docx) document.";
      setClientError(msg);
      setA11yStatus(`Error: ${msg}`);
      return;
    }

    setA11yStatus("Extracting text from Word document, please wait...");

    try {
      const buffer = await readFileArrayBuffer(file);
      const extracted = await extractTextFromDocx(buffer);
      setDocxExtractedText(extracted);
      setDocxFileName(file.name);
      setA11yStatus(`Word document "${file.name}" uploaded successfully: ${extracted.length.toLocaleString()} characters extracted.`);
    } catch (err: any) {
      const msg = err?.message || "Could not extract text from Word document.";
      setClientError(msg);
      setA11yStatus(`Error: ${msg}`);
      setDocxExtractedText(null);
      setDocxFileName(null);
    }
  };

  const handleDocxChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processDocxFile(file);
  };

  const processPdfFile = async (file: File) => {
    setClientError(null);

    if (
      !file.name.toLowerCase().endsWith(".pdf") &&
      file.type !== "application/pdf"
    ) {
      const msg = "Please select a valid PDF (.pdf) document.";
      setClientError(msg);
      setA11yStatus(`Error: ${msg}`);
      return;
    }

    const MAX_PDF_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_PDF_BYTES) {
      const msg = "PDF file size exceeds the maximum allowed 10 MB.";
      setClientError(msg);
      setA11yStatus(`Error: ${msg}`);
      return;
    }

    setIsProcessingPdf(true);
    setA11yStatus("Extracting text and preparing PDF document, please wait...");

    try {
      const buffer = await readFileArrayBuffer(file);
      const extracted = await extractTextFromPdf(buffer);

      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const res = reader.result as string;
          const base64 = res.includes(",") ? res.split(",")[1] : res;
          resolve(base64);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      setPdfFileName(file.name);
      setPdfExtractedText(extracted.text || null);
      setPdfTotalPages(extracted.totalPages);
      setPdfBase64(base64Data);
      setA11yStatus(
        `PDF document "${file.name}" uploaded successfully: ${extracted.totalPages} page${
          extracted.totalPages === 1 ? "" : "s"
        }${extracted.text ? `, ${extracted.text.length.toLocaleString()} characters extracted` : ", visual scanned pages ready"}.`
      );
    } catch (err: any) {
      const msg = err?.message || "Could not process the uploaded PDF document.";
      setClientError(msg);
      setA11yStatus(`Error: ${msg}`);
      setPdfFileName(null);
      setPdfExtractedText(null);
      setPdfTotalPages(null);
      setPdfBase64(null);
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processPdfFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent, tab: TabType) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (tab === "photo") {
      await processImageFile(file);
    } else if (tab === "docx") {
      await processDocxFile(file);
    } else if (tab === "pdf") {
      await processPdfFile(file);
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
    } else if (activeTab === "pdf") {
      if (!pdfBase64 && !pdfExtractedText) {
        setClientError("Please upload a .pdf document containing notes.");
        return;
      }
      onGenerate({
        mode,
        text: pdfExtractedText || undefined,
        pdf: pdfBase64 ? { base64Data: pdfBase64, mimeType: "application/pdf" } : undefined,
      });
    }
  };

  const getSubmitButtonLabel = () => {
    if (isLoading) {
      switch (mode) {
        case "meeting_summary":
          return "Generating Meeting Summary...";
        case "summary_important_points":
          return "Synthesizing Summary & Points...";
        default:
          return "Synthesizing Study Guide...";
      }
    }
    switch (mode) {
      case "meeting_summary":
        return "Generate Meeting Summary";
      case "summary_important_points":
        return "Make Summary & Important Points";
      default:
        return "Transform Into Study Guide";
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "text", label: "Paste Text" },
    { id: "photo", label: "Photo of Notes" },
    { id: "docx", label: "Word File (.docx)" },
    { id: "pdf", label: "PDF Document (.pdf)" },
  ];

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight") {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === "Home") {
      nextIndex = 0;
    } else if (e.key === "End") {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const nextTab = tabs[nextIndex].id;
    setActiveTab(nextTab);
    setClientError(null);
    const tabEl = document.getElementById(`tab-${nextTab}`);
    tabEl?.focus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Input Your Notes</h2>
      <p className="text-sm text-slate-600 mb-6">
        Upload photos of handwritten pages, paste messy lecture notes, or import a Word (.docx) or PDF (.pdf) document.
      </p>

      {/* Tab Navigation with WAI-ARIA Tabs pattern */}
      <div
        className="flex border-b border-slate-200 mb-6 overflow-x-auto"
        role="tablist"
        aria-label="Input Method"
      >
        {tabs.map((tab, idx) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => {
              setActiveTab(tab.id);
              setClientError(null);
            }}
            onKeyDown={(e) => handleTabKeyDown(e, idx)}
            className={`pb-3 px-4 font-semibold text-sm border-b-2 transition-colors min-h-[44px] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Screen Reader Live Region for File Events */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {a11yStatus}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Text Area Tab */}
        {activeTab === "text" && (
          <motion.div
            key="panel-text"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            id="panel-text"
            role="tabpanel"
            aria-labelledby="tab-text"
            tabIndex={0}
          >
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
              aria-describedby="notes-char-count"
              className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 shadow-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            />
            <div id="notes-char-count" className="flex justify-between items-center text-xs text-slate-500 mt-1" aria-live="polite">
              <span>{textInput.length.toLocaleString()} / {MAX_CHARS.toLocaleString()} characters</span>
              {textInput.length > MAX_CHARS && (
                <span role="alert" className="text-red-600 font-semibold">Exceeds limit</span>
              )}
            </div>
          </motion.div>
        )}

        {/* Photo Upload Tab */}
        {activeTab === "photo" && (
          <motion.div
            key="panel-photo"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            id="panel-photo"
            role="tabpanel"
            aria-labelledby="tab-photo"
            tabIndex={0}
          >
            <label
              htmlFor="photo-file-input"
              id="photo-upload-label"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Upload Handwriting or Whiteboard Photo (JPEG, PNG, WebP up to 10 MB)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "photo")}
              aria-dropeffect="copy"
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <input
                ref={fileInputRef}
                id="photo-file-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={isLoading || isProcessingImage}
                aria-labelledby="photo-upload-label"
                aria-describedby="photo-file-help"
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-slate-400 mb-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Choose photo file of notes (JPEG, PNG, WebP up to 10 MB)"
                  aria-describedby="photo-file-help"
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                >
                  Choose Image File
                </button>
                <p id="photo-file-help" className="text-xs text-slate-500 mt-2">
                  Images are automatically compressed & downscaled client-side before uploading. Drag and drop supported.
                </p>
              </div>

              {isProcessingImage && (
                <p role="status" aria-live="polite" className="mt-3 text-xs text-blue-600 font-semibold animate-pulse">
                  Optimizing image resolution...
                </p>
              )}

              {processedImage && imageFileName && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  role="region"
                  aria-label="Uploaded photo details"
                  className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-left text-xs text-blue-900 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold">{imageFileName}</span>
                    <span className="text-blue-700 ml-2">
                      ({processedImage.width}x{processedImage.height}px, ~{Math.round(processedImage.compressedSize / 1024)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setProcessedImage(null);
                      setImageFileName(null);
                      setA11yStatus("Photo removed.");
                    }}
                    aria-label={`Remove uploaded photo ${imageFileName}`}
                    className="text-red-600 hover:text-red-800 font-semibold ml-4 p-2.5 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Word Document (.docx) Tab */}
        {activeTab === "docx" && (
          <motion.div
            key="panel-docx"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            id="panel-docx"
            role="tabpanel"
            aria-labelledby="tab-docx"
            tabIndex={0}
          >
            <label
              htmlFor="docx-file-input"
              id="docx-upload-label"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Upload Microsoft Word (.docx) File
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "docx")}
              aria-dropeffect="copy"
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <input
                ref={docxInputRef}
                id="docx-file-input"
                type="file"
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleDocxChange}
                disabled={isLoading}
                aria-labelledby="docx-upload-label"
                aria-describedby="docx-file-help"
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-slate-400 mb-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <button
                  type="button"
                  onClick={() => docxInputRef.current?.click()}
                  aria-label="Choose Microsoft Word document (.docx)"
                  aria-describedby="docx-file-help"
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                >
                  Choose .docx Document
                </button>
                <p id="docx-file-help" className="text-xs text-slate-500 mt-2">
                  Extracts clean raw text directly in the browser via Mammoth. Drag and drop supported.
                </p>
              </div>

              {docxFileName && docxExtractedText && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  role="region"
                  aria-label="Uploaded Word document details"
                  className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-left text-xs text-emerald-900 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold">{docxFileName}</span>
                    <span className="text-emerald-700 ml-2">
                      ({docxExtractedText.length.toLocaleString()} characters extracted)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDocxExtractedText(null);
                      setDocxFileName(null);
                      setA11yStatus("Word document removed.");
                    }}
                    aria-label={`Remove uploaded Word document ${docxFileName}`}
                    className="text-red-600 hover:text-red-800 font-semibold ml-4 p-2.5 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* PDF Document (.pdf) Tab */}
        {activeTab === "pdf" && (
          <motion.div
            key="panel-pdf"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            id="panel-pdf"
            role="tabpanel"
            aria-labelledby="tab-pdf"
            tabIndex={0}
          >
            <label
              htmlFor="pdf-file-input"
              id="pdf-upload-label"
              className="block text-sm font-semibold text-slate-800 mb-2"
            >
              Upload PDF Document (.pdf up to 10 MB)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, "pdf")}
              aria-dropeffect="copy"
              className={`p-6 border-2 border-dashed rounded-xl text-center transition-colors ${
                isDragging
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-400"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <input
                ref={pdfInputRef}
                id="pdf-file-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
                disabled={isLoading || isProcessingPdf}
                aria-labelledby="pdf-upload-label"
                aria-describedby="pdf-file-help"
                className="sr-only"
              />
              <div className="flex flex-col items-center">
                <svg className="w-10 h-10 text-slate-400 mb-3" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 9h1m0 4h6m-6 4h6" />
                </svg>
                <button
                  type="button"
                  onClick={() => pdfInputRef.current?.click()}
                  aria-label="Choose PDF document (.pdf up to 10 MB)"
                  aria-describedby="pdf-file-help"
                  className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[44px]"
                >
                  Choose PDF Document
                </button>
                <p id="pdf-file-help" className="text-xs text-slate-500 mt-2">
                  Extracts text and supports multimodal analysis of handwritten notes, slides, and diagrams. Drag and drop supported.
                </p>
              </div>

              {isProcessingPdf && (
                <p role="status" aria-live="polite" className="mt-3 text-xs text-blue-600 font-semibold animate-pulse">
                  Extracting text and preparing PDF document...
                </p>
              )}

              {pdfFileName && (
                <motion.div
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.18 }}
                  role="region"
                  aria-label="Uploaded PDF document details"
                  className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-left text-xs text-purple-900 flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold">{pdfFileName}</span>
                    <span className="text-purple-700 ml-2">
                      ({pdfTotalPages} page{pdfTotalPages === 1 ? "" : "s"}
                      {pdfExtractedText ? `, ${pdfExtractedText.length.toLocaleString()} chars extracted` : ", visual / scanned pages ready"})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPdfFileName(null);
                      setPdfExtractedText(null);
                      setPdfTotalPages(null);
                      setPdfBase64(null);
                      setA11yStatus("PDF document removed.");
                    }}
                    aria-label={`Remove uploaded PDF document ${pdfFileName}`}
                    className="text-red-600 hover:text-red-800 font-semibold ml-4 p-2.5 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Mode Selector */}
        <ModeSelector mode={mode} onChange={setMode} disabled={isLoading} />

        {/* Client validation error */}
        {clientError && (
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            role="alert"
            aria-live="assertive"
            className="mt-3 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-900 flex items-center justify-between gap-3 shadow-xs"
          >
            <div className="flex items-center space-x-2">
              <span aria-hidden="true" className="text-base text-red-600">⚠️</span>
              <span>{clientError}</span>
            </div>
            <button
              type="button"
              onClick={() => setClientError(null)}
              aria-label="Dismiss error message"
              className="text-red-700 hover:text-red-950 p-2 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 min-h-[44px] min-w-[44px] inline-flex items-center justify-center font-bold text-sm transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Action Button */}
        <div className="mt-6">
          <motion.button
            type="submit"
            whileHover={shouldReduceMotion || isLoading || isProcessingImage || isProcessingPdf ? undefined : { scale: 1.02 }}
            whileTap={shouldReduceMotion || isLoading || isProcessingImage || isProcessingPdf ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.15 }}
            disabled={isLoading || isProcessingImage || isProcessingPdf}
            aria-busy={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" aria-hidden="true" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{getSubmitButtonLabel()}</span>
              </>
            ) : (
              <span>{getSubmitButtonLabel()}</span>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
}



