import mammoth from "mammoth";

/**
 * Extracts raw text from a .docx file buffer using mammoth.
 * Runs on the client or server.
 */
export async function extractTextFromDocx(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value.trim();
    if (!text) {
      throw new Error("The .docx file appears to be empty or contains no extractable text.");
    }
    return text;
  } catch (error: any) {
    throw new Error(
      error?.message || "Failed to extract text from the provided Word document."
    );
  }
}
