import { describe, it, expect } from "vitest";
import {
  buildPrompt,
  STUDY_GUIDE_INSTRUCTIONS,
  MEETING_SUMMARY_INSTRUCTIONS,
  SUMMARY_IMPORTANT_POINTS_INSTRUCTIONS,
} from "@/lib/prompts";

describe("buildPrompt", () => {
  it("generates prompt for study_guide mode", () => {
    const prompt = buildPrompt("study_guide");
    expect(prompt).toContain(STUDY_GUIDE_INSTRUCTIONS);
    expect(prompt).toContain("MODE: STUDY GUIDE");
    expect(prompt).toContain("CORE OPERATIONAL RULES");
  });

  it("generates prompt for meeting_summary mode", () => {
    const prompt = buildPrompt("meeting_summary");
    expect(prompt).toContain(MEETING_SUMMARY_INSTRUCTIONS);
    expect(prompt).toContain("MODE: MEETING SUMMARY");
    expect(prompt).toContain("Action Items");
  });

  it("generates prompt for summary_important_points mode", () => {
    const prompt = buildPrompt("summary_important_points");
    expect(prompt).toContain(SUMMARY_IMPORTANT_POINTS_INSTRUCTIONS);
    expect(prompt).toContain("MODE: SUMMARY WITH IMPORTANT POINTS");
    expect(prompt).toContain("Important Points & Critical Highlights");
    expect(prompt).toContain("Executive Summary & Core Overview");
  });

  it("appends critical fix instructions when repairErrorMessage is provided", () => {
    const prompt = buildPrompt("summary_important_points", "Missing required property: summary");
    expect(prompt).toContain("CRITICAL FIX REQUIRED:");
    expect(prompt).toContain("Missing required property: summary");
  });
});
