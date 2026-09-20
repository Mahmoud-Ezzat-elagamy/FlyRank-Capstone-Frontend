import { GoogleGenAI } from "@google/genai";
import { AppError } from "./errors";
import { buildPrompt, Mode } from "./prompts";
import {
  NoteDocSchema,
  salvageDocument,
  DocumentWithNotices,
} from "./schema";

export interface GenerateInput {
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


const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          heading: { type: "string" },
          paragraphs: {
            type: "array",
            items: { type: "string" },
          },
          bullets: {
            type: "array",
            items: { type: "string" },
          },
          table: {
            type: "object",
            properties: {
              caption: { type: "string" },
              headers: {
                type: "array",
                items: { type: "string" },
              },
              rows: {
                type: "array",
                items: {
                  type: "array",
                  items: { type: "string" },
                },
              },
            },
            required: ["caption", "headers", "rows"],
          },
          diagram: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["flowchart"] },
              title: { type: "string" },
              description: { type: "string" },
              nodes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    label: { type: "string" },
                  },
                  required: ["id", "label"],
                },
              },
              edges: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    from: { type: "string" },
                    to: { type: "string" },
                    label: { type: "string" },
                  },
                  required: ["from", "to"],
                },
              },
            },
            required: ["type", "title", "description", "nodes", "edges"],
          },
        },
        required: ["heading"],
      },
    },
    uncertain: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string" },
          reason: { type: "string" },
        },
        required: ["text", "reason"],
      },
    },
  },
  required: ["title", "summary", "sections", "uncertain"],
};

const REQUEST_TIMEOUT_MS = 25000;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function generateNoteDoc(input: GenerateInput): Promise<DocumentWithNotices> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "your_key_here") {
    throw new AppError(
      "AI_UNAVAILABLE",
      "GEMINI_API_KEY is not configured on the server. Please set your Google AI Studio API key.",
      503
    );
  }

  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const ai = new GoogleGenAI({ apiKey });

  const executeApiCall = async (promptText: string, retryCount = 0): Promise<string> => {
    const contents: any[] = [];

    if (input.image) {
      contents.push({
        inlineData: {
          data: input.image.base64Data,
          mimeType: input.image.mimeType,
        },
      });
    } else if (input.pdf) {
      contents.push({
        inlineData: {
          data: input.pdf.base64Data,
          mimeType: input.pdf.mimeType || "application/pdf",
        },
      });
    }

    const fullInstruction = input.text
      ? `${promptText}\n\nUSER NOTES:\n${input.text}`
      : input.pdf
      ? `${promptText}\n\nPlease analyze the attached PDF document of notes carefully, synthesizing all pages, text, handwriting, and diagrams.`
      : `${promptText}\n\nPlease analyze the attached image of notes carefully.`;

    contents.push(fullInstruction);


    // Abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_JSON_SCHEMA as any,
          temperature: 0.2,
        },
      });

      clearTimeout(timeoutId);

      const candidateText = typeof response.text === "function"
        ? (response.text as any)()
        : (response.text as unknown as string);
      if (!candidateText || candidateText.trim().length === 0) {
        throw new AppError(
          "UNREADABLE",
          "The model could not extract readable notes from the provided input.",
          422
        );
      }

      return candidateText;
    } catch (err: any) {
      clearTimeout(timeoutId);

      // Check for timeout
      if (err?.name === "AbortError" || err?.message?.includes("aborted")) {
        throw new AppError(
          "TIMEOUT",
          "The AI synthesis request timed out after 25 seconds. Try shorter notes or a smaller image.",
          504
        );
      }

      // Check for rate limit / 429
      const is429 =
        err?.status === 429 ||
        err?.statusCode === 429 ||
        err?.message?.includes("429") ||
        err?.message?.includes("RESOURCE_EXHAUSTED");

      if (is429) {
        if (retryCount === 0) {
          // One server-side backoff retry
          await sleep(2000);
          return executeApiCall(promptText, 1);
        }
        throw new AppError(
          "QUOTA_EXCEEDED",
          "Google Gemini rate limit or quota exceeded. Please wait a moment and try again.",
          429
        );
      }

      if (err instanceof AppError) {
        throw err;
      }

      throw new AppError(
        "AI_UNAVAILABLE",
        `AI service error: ${err?.message || "Unknown communication failure"}`,
        503
      );
    }
  };

  // First Attempt
  let rawJson = await executeApiCall(buildPrompt(input.mode));

  // Parse and validate with Zod
  let parsedObject: unknown;
  try {
    parsedObject = JSON.parse(rawJson);
  } catch (parseErr: any) {
    // Attempt one repair retry
    try {
      rawJson = await executeApiCall(
        buildPrompt(input.mode, `Invalid JSON syntax: ${parseErr?.message}`)
      );
      parsedObject = JSON.parse(rawJson);
    } catch (retryParseErr) {
      throw new AppError(
        "MODEL_INVALID_OUTPUT",
        "The AI returned malformed JSON that could not be repaired.",
        422
      );
    }
  }

  // Validate with Zod
  const zodResult = NoteDocSchema.safeParse(parsedObject);

  if (!zodResult.success) {
    // Check if partial-failure salvage is possible
    try {
      const salvaged = salvageDocument(parsedObject);
      return salvaged;
    } catch {
      // If complete structure failed, attempt ONE repair retry
      const issueSummary = zodResult.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");

      try {
        const repairedJson = await executeApiCall(
          buildPrompt(input.mode, `Schema validation failure: ${issueSummary}`)
        );
        const repairedObj = JSON.parse(repairedJson);
        return salvageDocument(repairedObj);
      } catch (finalErr) {
        throw new AppError(
          "MODEL_INVALID_OUTPUT",
          `The AI output could not be validated against the document schema: ${issueSummary}`,
          422
        );
      }
    }
  }

  // Directly valid or salvaged
  return salvageDocument(zodResult.data);
}
