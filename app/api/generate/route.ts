import { NextRequest, NextResponse } from "next/server";
import { AppError } from "@/lib/errors";
import { checkRateLimit } from "@/lib/rateLimit";
import { generateNoteDoc } from "@/lib/gemini";
import type { Mode } from "@/lib/prompts";

export const dynamic = "force-dynamic";

const MAX_TEXT_LENGTH = 30000;
const MAX_IMAGE_BASE64_LENGTH = 7 * 1024 * 1024; // ~5MB decoded binary, fits within 4.5MB Vercel limit after downscaling
const MAX_PDF_BASE64_LENGTH = 10 * 1024 * 1024; // ~7.5MB decoded binary

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Parse and validate request body
    let body: any;
    try {
      body = await req.json();
    } catch {
      throw new AppError("BAD_INPUT", "Malformed JSON request body.", 400);
    }

    const { mode = "study_guide", text, image, pdf } = body || {};

    if (
      mode !== "study_guide" &&
      mode !== "meeting_summary" &&
      mode !== "summary_important_points"
    ) {
      throw new AppError(
        "BAD_INPUT",
        'Invalid mode. Mode must be "study_guide", "meeting_summary", or "summary_important_points".',
        400
      );
    }

    if (!text && !image && !pdf) {
      throw new AppError(
        "BAD_INPUT",
        "Please provide notes text, an image, or a PDF document of your notes.",
        400
      );
    }

    if (text) {
      if (typeof text !== "string" || text.trim().length === 0) {
        throw new AppError("BAD_INPUT", "Provided text input is empty.", 400);
      }
      if (text.length > MAX_TEXT_LENGTH) {
        throw new AppError(
          "TOO_LARGE",
          `Text exceeds maximum allowed ${MAX_TEXT_LENGTH.toLocaleString()} characters.`,
          413
        );
      }
    }

    if (image) {
      if (
        !image.base64Data ||
        typeof image.base64Data !== "string" ||
        !image.mimeType ||
        typeof image.mimeType !== "string"
      ) {
        throw new AppError(
          "BAD_INPUT",
          "Invalid image payload format. Expected base64Data and mimeType.",
          400
        );
      }

      const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedMimes.includes(image.mimeType)) {
        throw new AppError(
          "BAD_INPUT",
          `Invalid image type "${image.mimeType}". Allowed formats: JPEG, PNG, WebP.`,
          400
        );
      }

      if (image.base64Data.length > MAX_IMAGE_BASE64_LENGTH) {
        throw new AppError(
          "TOO_LARGE",
          "Image payload exceeds maximum payload limit after downscaling.",
          413
        );
      }
    }

    if (pdf) {
      if (
        !pdf.base64Data ||
        typeof pdf.base64Data !== "string" ||
        !pdf.mimeType ||
        typeof pdf.mimeType !== "string"
      ) {
        throw new AppError(
          "BAD_INPUT",
          "Invalid PDF payload format. Expected base64Data and mimeType.",
          400
        );
      }

      if (pdf.mimeType !== "application/pdf") {
        throw new AppError(
          "BAD_INPUT",
          `Invalid PDF MIME type "${pdf.mimeType}". Expected "application/pdf".`,
          400
        );
      }

      if (pdf.base64Data.length > MAX_PDF_BASE64_LENGTH) {
        throw new AppError(
          "TOO_LARGE",
          "PDF document exceeds maximum payload limit (10 MB).",
          413
        );
      }
    }

    // 2. Apply rate limiting per IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      throw new AppError(
        "RATE_LIMITED",
        `Too many requests. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
        429,
        rateLimit.retryAfter
      );
    }

    // 3. Call Gemini synthesis (includes repair retry, partial failure salvage)
    const result = await generateNoteDoc({
      mode: mode as Mode,
      text: text?.trim(),
      image,
      pdf,
    });


    const elapsedMs = Date.now() - startTime;
    // Log only status and timing, NEVER request bodies or notes
    console.log(`[GENERATE SUCCESS] Duration: ${elapsedMs}ms | Notices: ${result.notices.length}`);

    return NextResponse.json(
      {
        doc: result.doc,
        notices: result.notices,
      },
      {
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (err: any) {
    const elapsedMs = Date.now() - startTime;

    if (err instanceof AppError) {
      console.warn(`[GENERATE ERROR] Code: ${err.code} | Status: ${err.statusCode} | Duration: ${elapsedMs}ms`);
      return NextResponse.json(err.toJSON(), {
        status: err.statusCode,
        headers: err.retryAfter ? { "Retry-After": String(err.retryAfter) } : undefined,
      });
    }

    console.error(`[GENERATE UNEXPECTED ERROR] Duration: ${elapsedMs}ms | Message: ${err?.message}`);
    return NextResponse.json(
      {
        error: {
          code: "AI_UNAVAILABLE",
          message: "An unexpected server error occurred. Please try again shortly.",
        },
      },
      { status: 500 }
    );
  }
}
