export type ErrorCode =
  | "RATE_LIMITED"
  | "QUOTA_EXCEEDED"
  | "BAD_INPUT"
  | "TOO_LARGE"
  | "UNREADABLE"
  | "MODEL_INVALID_OUTPUT"
  | "AI_UNAVAILABLE"
  | "TIMEOUT";

export interface AppErrorPayload {
  code: ErrorCode;
  message: string;
  retryAfter?: number; // in seconds for rate limit
}

export class AppError extends Error {
  code: ErrorCode;
  statusCode: number;
  retryAfter?: number;

  constructor(code: ErrorCode, message: string, statusCode = 400, retryAfter?: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.retryAfter = retryAfter;
  }

  toJSON(): { error: AppErrorPayload } {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.retryAfter !== undefined ? { retryAfter: this.retryAfter } : {}),
      },
    };
  }
}

export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  RATE_LIMITED: "You have sent too many requests. Please wait a moment before trying again.",
  QUOTA_EXCEEDED: "The AI service is currently busy. Please wait a few moments and try again.",
  BAD_INPUT: "Invalid input. Please provide valid text or an image.",
  TOO_LARGE: "The input exceeds the maximum allowed size (10 MB for images, 30,000 characters for text).",
  UNREADABLE: "Nothing legible was found in the input. Ensure photos have good lighting, a flat page, and no harsh shadows.",
  MODEL_INVALID_OUTPUT: "The AI generated an unreadable response. You can retry or edit your notes.",
  AI_UNAVAILABLE: "AI processing is currently unavailable. You can compose or edit your study guide manually.",
  TIMEOUT: "The request timed out. Please try again with shorter notes or a smaller image.",
};
