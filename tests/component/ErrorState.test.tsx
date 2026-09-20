import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "@/components/ErrorState";

describe("ErrorState Component", () => {
  it("renders rate limit error with Retry button and retryAfter text", async () => {
    const onRetry = vi.fn();
    render(
      <ErrorState
        error={{
          code: "RATE_LIMITED",
          message: "Too many requests.",
          retryAfter: 30,
        }}
        onRetry={onRetry}
      />
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Service is Temporarily Busy")).toBeInTheDocument();
    expect(screen.getByText(/wait 30 seconds/i)).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();
    await userEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders unreadable error with photo tips", () => {
    render(
      <ErrorState
        error={{
          code: "UNREADABLE",
          message: "Nothing legible was found.",
        }}
      />
    );

    expect(screen.getByText("No Legible Notes Found")).toBeInTheDocument();
    expect(screen.getByText(/Tips for taking clearer note photos:/i)).toBeInTheDocument();
  });

  it("renders AI unavailable error with manual entry fallback option", async () => {
    const onManualEntry = vi.fn();
    render(
      <ErrorState
        error={{
          code: "AI_UNAVAILABLE",
          message: "Gemini AI connection failed.",
        }}
        onManualEntry={onManualEntry}
      />
    );

    expect(screen.getByText("AI Service Unavailable")).toBeInTheDocument();
    const manualBtn = screen.getByRole("button", { name: /create \/ edit manually/i });
    expect(manualBtn).toBeInTheDocument();

    await userEvent.click(manualBtn);
    expect(onManualEntry).toHaveBeenCalledTimes(1);
  });
});
