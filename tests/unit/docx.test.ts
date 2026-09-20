import { describe, it, expect, vi } from "vitest";
import { extractTextFromDocx } from "@/lib/docx";
import mammoth from "mammoth";

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(),
  },
}));

describe("extractTextFromDocx", () => {
  it("extracts and trims plain text from Word document array buffer", async () => {
    vi.mocked(mammoth.extractRawText).mockResolvedValueOnce({
      value: "   Lecture notes on Computer Architecture.   ",
      messages: [],
    });

    const buffer = new ArrayBuffer(8);
    const result = await extractTextFromDocx(buffer);
    expect(result).toBe("Lecture notes on Computer Architecture.");
  });

  it("throws an error when docx is empty", async () => {
    vi.mocked(mammoth.extractRawText).mockResolvedValueOnce({
      value: "   ",
      messages: [],
    });

    const buffer = new ArrayBuffer(8);
    await expect(extractTextFromDocx(buffer)).rejects.toThrow(
      /empty or contains no extractable text/
    );
  });

  it("propagates mammoth extraction failures cleanly", async () => {
    vi.mocked(mammoth.extractRawText).mockRejectedValueOnce(
      new Error("Corrupt docx file archive")
    );

    const buffer = new ArrayBuffer(8);
    await expect(extractTextFromDocx(buffer)).rejects.toThrow(
      "Corrupt docx file archive"
    );
  });
});
