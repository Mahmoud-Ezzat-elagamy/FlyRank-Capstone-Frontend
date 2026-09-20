import { extractText } from "unpdf";

export interface ExtractedPdfResult {
  text: string;
  totalPages: number;
}

/**
 * Extracts text and metadata from a PDF file buffer using unpdf.
 * Handles both typed/digital PDFs and scanned PDFs.
 */
export async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<ExtractedPdfResult> {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    const result = await extractText(uint8Array);

    const pages = Array.isArray(result.text) ? result.text : [result.text];
    const cleanedPages = pages.map((p) => (typeof p === "string" ? p.trim() : "")).filter(Boolean);
    const combinedText = cleanedPages.join("\n\n");
    const totalPages = result.totalPages || pages.length || 1;

    return {
      text: combinedText,
      totalPages,
    };
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to extract text from the provided PDF document."
    );
  }
}
