import React from "react";
import type { Mode } from "@/lib/prompts";

interface StatusRegionProps {
  status: string | null;
  isLoading?: boolean;
  mode?: Mode;
}

/**
 * Accessible polite live region to announce async progress and status changes
 * to assistive technologies (screen readers) without interrupting speech.
 */
export function StatusRegion({ status, isLoading, mode = "study_guide" }: StatusRegionProps) {
  const getLoadingAnnouncement = () => {
    switch (mode) {
      case "meeting_summary":
        return "Generating meeting summary, please wait...";
      case "summary_important_points":
        return "Generating summary with important points, please wait...";
      default:
        return "Generating study guide, please wait...";
    }
  };

  const announcement = status || (isLoading ? getLoadingAnnouncement() : null);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

