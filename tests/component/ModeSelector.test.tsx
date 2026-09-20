import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeSelector } from "@/components/ModeSelector";
import { StatusRegion } from "@/components/StatusRegion";

describe("ModeSelector Component", () => {
  it("renders all three modes and allows switching", async () => {
    const onChange = vi.fn();
    render(<ModeSelector mode="study_guide" onChange={onChange} />);

    const studyRadio = screen.getByRole("radio", {
      name: /study guide/i,
    });
    const meetingRadio = screen.getByRole("radio", {
      name: /meeting summary/i,
    });
    const summaryPointsRadio = screen.getByRole("radio", {
      name: /summary with important points/i,
    });

    expect(studyRadio).toBeChecked();
    expect(meetingRadio).not.toBeChecked();
    expect(summaryPointsRadio).not.toBeChecked();

    await userEvent.click(summaryPointsRadio);
    expect(onChange).toHaveBeenCalledWith("summary_important_points");

    await userEvent.click(meetingRadio);
    expect(onChange).toHaveBeenCalledWith("meeting_summary");
  });
  it("supports keyboard arrow navigation between modes", async () => {
    const onChange = vi.fn();
    render(<ModeSelector mode="study_guide" onChange={onChange} />);

    const studyRadio = screen.getByRole("radio", {
      name: /study guide/i,
    });

    studyRadio.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("meeting_summary");

    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("summary_important_points");
  });

  it("links aria-describedby to mode descriptions", () => {
    render(<ModeSelector mode="summary_important_points" onChange={vi.fn()} />);

    const summaryRadio = screen.getByRole("radio", {
      name: /summary with important points/i,
    });

    expect(summaryRadio).toHaveAttribute("aria-describedby", "desc-summary-important-points");
    expect(
      document.getElementById("desc-summary-important-points")
    ).toHaveTextContent(/executive overview accompanied by highlighted critical takeaways/i);
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

  it("announces loading state when isLoading is true for study_guide", () => {
    render(<StatusRegion status={null} isLoading={true} mode="study_guide" />);
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Generating study guide, please wait...");
  });

  it("announces loading state when isLoading is true for summary_important_points", () => {
    render(
      <StatusRegion
        status={null}
        isLoading={true}
        mode="summary_important_points"
      />
    );
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent(
      "Generating summary with important points, please wait..."
    );
  });

  it("announces loading state when isLoading is true for meeting_summary", () => {
    render(
      <StatusRegion status={null} isLoading={true} mode="meeting_summary" />);
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveTextContent("Generating meeting summary, please wait...");
  });
});

