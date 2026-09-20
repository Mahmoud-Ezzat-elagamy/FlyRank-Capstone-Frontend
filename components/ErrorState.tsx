"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ErrorCode, ERROR_MESSAGES, AppErrorPayload } from "@/lib/errors";

interface ErrorStateProps {
  error: AppErrorPayload;
  onRetry?: () => void;
  onManualEntry?: () => void;
}

export function ErrorState({ error, onRetry, onManualEntry }: ErrorStateProps) {
  const shouldReduceMotion = useReducedMotion();
  const { code, message, retryAfter } = error;

  const displayMessage = message || ERROR_MESSAGES[code] || "An unexpected error occurred.";

  const showRetry = ["RATE_LIMITED", "QUOTA_EXCEEDED", "TIMEOUT", "MODEL_INVALID_OUTPUT"].includes(code);
  const showManualFallback = ["AI_UNAVAILABLE", "TIMEOUT", "MODEL_INVALID_OUTPUT"].includes(code) && onManualEntry;

  return (
    <div
      role="alert"
      aria-labelledby="error-heading"
      className="p-6 my-6 rounded-xl border border-red-200 bg-red-50 text-red-950 shadow-sm"
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 text-red-600 mt-0.5" aria-hidden="true">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div className="flex-1">
          <h2 id="error-heading" className="text-lg font-bold text-red-900">
            {code === "QUOTA_EXCEEDED" || code === "RATE_LIMITED"
              ? "Service is Temporarily Busy"
              : code === "UNREADABLE"
              ? "No Legible Notes Found"
              : code === "AI_UNAVAILABLE"
              ? "AI Service Unavailable"
              : "Unable to Generate Study Document"}
          </h2>

          <p className="mt-2 text-sm text-red-800 leading-relaxed">
            {displayMessage}
          </p>

          {retryAfter && retryAfter > 0 && (
            <p className="mt-1 text-xs font-semibold text-red-700">
              Please wait {retryAfter} seconds before trying again.
            </p>
          )}

          {code === "UNREADABLE" && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-red-100 text-xs text-slate-700">
              <strong className="block text-slate-900 mb-1">Tips for taking clearer note photos:</strong>
              <ul className="list-disc pl-4 space-y-1">
                <li>Ensure even lighting without dark phone shadows over text.</li>
                <li>Keep the notebook page flat on a table rather than curved.</li>
                <li>Hold the camera parallel and tap to ensure sharp focus.</li>
              </ul>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {showRetry && onRetry && (
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.12 }}
                onClick={onRetry}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors shadow-sm"
              >
                Try Again
              </motion.button>
            )}

            {showManualFallback && (
              <motion.button
                type="button"
                whileHover={shouldReduceMotion ? undefined : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                transition={{ duration: 0.12 }}
                onClick={onManualEntry}
                className="px-4 py-2 text-sm font-semibold rounded-lg bg-white text-slate-800 border border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors shadow-sm"
              >
                Create / Edit Manually in Editor
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
