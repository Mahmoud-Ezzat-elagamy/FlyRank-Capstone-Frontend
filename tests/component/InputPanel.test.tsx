import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputPanel } from "@/components/InputPanel";
import * as imageUtils from "@/lib/image";
import * as pdfUtils from "@/lib/pdf";

vi.mock("@/lib/pdf", () => ({
  extractTextFromPdf: vi.fn(),
}));

describe("InputPanel Component", () => {
  it("accepts pasted text and submits with chosen mode", async () => {
    const onGenerate = vi.fn();
    render(<InputPanel onGenerate={onGenerate} isLoading={false} />);

    const textarea = screen.getByPlaceholderText(/paste raw lecture notes/i);
    await userEvent.type(textarea, "Newton's Laws of Motion...");

    const submitBtn = screen.getByRole("button", { name: /transform into study guide/i });
    await userEvent.click(submitBtn);

    expect(onGenerate).toHaveBeenCalledWith({
      mode: "study_guide",
      text: "Newton's Laws of Motion...",
    });
  });

  it("shows an error when submitting empty input", async () => {
    const onGenerate = vi.fn();
    render(<InputPanel onGenerate={onGenerate} isLoading={false} />);

    const submitBtn = screen.getByRole("button", { name: /transform into study guide/i });
    await userEvent.click(submitBtn);

    expect(screen.getByRole("alert")).toHaveTextContent(/please enter or paste your notes/i);
    expect(onGenerate).not.toHaveBeenCalled();
  });

  it("rejects wrong file types when uploading photo with visible error message", async () => {
    vi.spyOn(imageUtils, "downscaleImage").mockRejectedValueOnce(
      new Error('Unsupported file type "application/pdf". Allowed formats: JPEG, PNG, WebP.')
    );

    render(<InputPanel onGenerate={vi.fn()} isLoading={false} />);

    const photoTab = screen.getByRole("tab", { name: /photo of notes/i });
    await userEvent.click(photoTab);

    const fileInput = document.getElementById("photo-file-input") as HTMLInputElement;
    const invalidFile = new File(["dummy"], "notes.pdf", { type: "application/pdf" });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/unsupported file type/i);
    });
  });

  it("rejects oversized images (> 10 MB) with visible error message", async () => {
    vi.spyOn(imageUtils, "downscaleImage").mockRejectedValueOnce(
      new Error("File size (11.0 MB) exceeds the maximum allowed 10 MB.")
    );

    render(<InputPanel onGenerate={vi.fn()} isLoading={false} />);

    const photoTab = screen.getByRole("tab", { name: /photo of notes/i });
    await userEvent.click(photoTab);

    const fileInput = document.getElementById("photo-file-input") as HTMLInputElement;
    const oversizedFile = new File(["dummy"], "huge.jpg", { type: "image/jpeg" });

    fireEvent.change(fileInput, { target: { files: [oversizedFile] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/exceeds the maximum allowed 10 MB/i);
    });
  });

  it("switches to PDF tab, extracts text, allows selecting summary_important_points mode, and submits", async () => {
    vi.mocked(pdfUtils.extractTextFromPdf).mockResolvedValueOnce({
      text: "Thermodynamics first law: energy cannot be created or destroyed.",
      totalPages: 3,
    });

    const onGenerate = vi.fn();
    render(<InputPanel onGenerate={onGenerate} isLoading={false} />);

    // Switch to PDF tab
    const pdfTab = screen.getByRole("tab", { name: /pdf document/i });
    await userEvent.click(pdfTab);

    // Switch to Summary with Important Points mode
    const summaryPointsRadio = screen.getByRole("radio", {
      name: /summary with important points/i,
    });
    await userEvent.click(summaryPointsRadio);

    // Upload PDF
    const fileInput = document.getElementById("pdf-file-input") as HTMLInputElement;
    const pdfFile = new File(["fake-pdf-content"], "thermo_lecture.pdf", {
      type: "application/pdf",
    });
    pdfFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(16));

    fireEvent.change(fileInput, { target: { files: [pdfFile] } });


    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: /uploaded pdf document details/i })
      ).toBeInTheDocument();
      expect(screen.getByRole("status")).toHaveTextContent(/thermo_lecture\.pdf.*3 pages/i);
    });

    // Check dynamic button label
    const submitBtn = screen.getByRole("button", {
      name: /make summary & important points/i,
    });
    await userEvent.click(submitBtn);

    expect(onGenerate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "summary_important_points",
        text: "Thermodynamics first law: energy cannot be created or destroyed.",
        pdf: expect.objectContaining({
          mimeType: "application/pdf",
        }),
      })
    );
  });

  it("rejects non-PDF files in PDF tab", async () => {
    render(<InputPanel onGenerate={vi.fn()} isLoading={false} />);

    const pdfTab = screen.getByRole("tab", { name: /pdf document/i });
    await userEvent.click(pdfTab);

    const fileInput = document.getElementById("pdf-file-input") as HTMLInputElement;
    const invalidFile = new File(["dummy"], "report.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(/please select a valid pdf/i);
    });

    // Dismiss error button
    const dismissBtn = screen.getByRole("button", { name: /dismiss error message/i });
    await userEvent.click(dismissBtn);
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("announces removal when removing an uploaded PDF document", async () => {
    vi.mocked(pdfUtils.extractTextFromPdf).mockResolvedValueOnce({
      text: "Sample chemistry notes",
      totalPages: 1,
    });

    render(<InputPanel onGenerate={vi.fn()} isLoading={false} />);

    const pdfTab = screen.getByRole("tab", { name: /pdf document/i });
    await userEvent.click(pdfTab);

    const fileInput = document.getElementById("pdf-file-input") as HTMLInputElement;
    const pdfFile = new File(["pdf-bytes"], "chem_notes.pdf", {
      type: "application/pdf",
    });
    pdfFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));

    fireEvent.change(fileInput, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(
        screen.getByRole("region", { name: /uploaded pdf document details/i })
      ).toBeInTheDocument();
    });

    const removeBtn = screen.getByRole("button", {
      name: /remove uploaded pdf document chem_notes\.pdf/i,
    });
    await userEvent.click(removeBtn);

    expect(screen.getByRole("status")).toHaveTextContent(/pdf document removed/i);
    expect(
      screen.queryByRole("region", { name: /uploaded pdf document details/i })
    ).not.toBeInTheDocument();
  });

  it("supports drag and drop on PDF tab", async () => {
    vi.mocked(pdfUtils.extractTextFromPdf).mockResolvedValueOnce({
      text: "Dropped physics notes",
      totalPages: 2,
    });

    render(<InputPanel onGenerate={vi.fn()} isLoading={false} />);

    const pdfTab = screen.getByRole("tab", { name: /pdf document/i });
    await userEvent.click(pdfTab);

    const pdfFile = new File(["dropped-bytes"], "physics.pdf", {
      type: "application/pdf",
    });
    pdfFile.arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(8));

    const dropzone = screen.getByText(/extracts text and supports multimodal/i).parentElement?.parentElement;
    expect(dropzone).toBeInTheDocument();

    fireEvent.dragOver(dropzone!, { dataTransfer: { files: [pdfFile] } });
    fireEvent.drop(dropzone!, { dataTransfer: { files: [pdfFile] } });

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/physics\.pdf.*2 pages/i);
    });
  });
});


