import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeSelector } from "@/components/ModeSelector";
import { StatusRegion } from "@/components/StatusRegion";

describe("ModeSelector Component", () => {
  it("renders both modes and allows switching", async () => {
    const onChange = vi.fn();
    render(<ModeSelector mode="study_guide" onChange={onChange} />);

    const studyRadio = screen.getByRole("radio", {
      name: /study guide/i,
    });
    const meetingRadio = screen.getByRole("radio", {
      name: /meeting summary/i,
    });

    expect(studyRadio).toBeChecked();
    expect(meetingRadio).not.toBeChecked();

    await userEvent.click(meetingRadio);
    expect(onChange).toHaveBeenCalledWith("meeting_summary");
  });
});

describe("StatusRegion Component", () => {
  it("renders accessible status region with aria-live polite", () => {
    render(
      <StatusRegion
        status="Document generated successfully."
        isLoading={false}
      />
    );

    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveTextContent("Document generated successfully.");
  });

  it("announces loading state when isLoading is true", () => {
    render(<StatusRegion status={null} isLoading={true} />);
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Generating study guide, please wait...");
  });
});
