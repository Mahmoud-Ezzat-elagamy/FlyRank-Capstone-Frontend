import React from "react";

interface StatusRegionProps {
  status: string | null;
  isLoading?: boolean;
}

/**
 * Accessible polite live region to announce async progress and status changes
 * to assistive technologies (screen readers) without interrupting speech.
 */
export function StatusRegion({ status, isLoading }: StatusRegionProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {isLoading && "Generating study guide, please wait..."}
      {status}
    </div>
  );
}
