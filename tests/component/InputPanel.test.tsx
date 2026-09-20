import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { InputPanel } from "@/components/InputPanel";
import * as imageUtils from "@/lib/image";

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
});
