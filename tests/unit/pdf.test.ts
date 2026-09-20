import { describe, it, expect, vi } from "vitest";
import { extractTextFromPdf } from "@/lib/pdf";
import * as unpdf from "unpdf";

vi.mock("unpdf", () => ({
  extractText: vi.fn(),
}));

describe("extractTextFromPdf", () => {
  it("extracts and trims plain text from PDF document array buffer across pages", async () => {
    vi.mocked(unpdf.extractText).mockResolvedValueOnce({
      totalPages: 2,
      text: ["   Page 1 lecture notes on Quantum Mechanics.   ", "Page 2 Heisenberg uncertainty principle.  "],
    });

    const buffer = new ArrayBuffer(16);
    const result = await extractTextFromPdf(buffer);
    expect(result.totalPages).toBe(2);
    expect(result.text).toBe(
      "Page 1 lecture notes on Quantum Mechanics.\n\nPage 2 Heisenberg uncertainty principle."
    );
  });

  it("handles scanned/image-only PDFs where text is empty but pages exist", async () => {
    vi.mocked(unpdf.extractText).mockResolvedValueOnce({
      totalPages: 4,
      text: ["", "  ", ""],
    });

    const buffer = new ArrayBuffer(16);
    const result = await extractTextFromPdf(buffer);
    expect(result.totalPages).toBe(4);
    expect(result.text).toBe("");
  });

  it("handles string text response format from unpdf", async () => {
    vi.mocked(unpdf.extractText).mockResolvedValueOnce({
      totalPages: 1,
      text: "Single page note content." as any,
    });

    const buffer = new ArrayBuffer(16);
    const result = await extractTextFromPdf(buffer);
    expect(result.totalPages).toBe(1);
    expect(result.text).toBe("Single page note content.");
  });

  it("propagates unpdf extraction failures cleanly with a descriptive message", async () => {
    vi.mocked(unpdf.extractText).mockRejectedValueOnce(
      new Error("Invalid PDF file header")
    );

    const buffer = new ArrayBuffer(16);
    await expect(extractTextFromPdf(buffer)).rejects.toThrow(
      "Invalid PDF file header"
    );
  });
});
