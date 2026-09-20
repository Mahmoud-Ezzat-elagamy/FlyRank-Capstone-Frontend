"use client";

import React, { useEffect, useState, useId } from "react";
import type { Diagram } from "@/lib/schema";
import { buildMermaid } from "@/lib/buildMermaid";

interface DiagramViewProps {
  diagram: Diagram;
}

export function DiagramView({ diagram }: DiagramViewProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const rawId = useId();
  const containerId = `mermaid-${rawId.replace(/:/g, "")}`;

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          securityLevel: "strict",
          fontFamily: "system-ui, sans-serif",
          flowchart: {
            useMaxWidth: true,
            htmlLabels: false,
          },
        });

        const definition = buildMermaid(diagram);
        const { svg } = await mermaid.render(`${containerId}-svg`, definition);

        if (isMounted) {
          setSvgContent(svg);
          setRenderError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setRenderError(err?.message || "Visual diagram rendering failed.");
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
    };
  }, [diagram, containerId]);

  return (
    <figure
      role="img"
      aria-label={diagram.title}
      className="my-6 p-4 rounded-xl border border-slate-300 bg-white shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
        <h4 className="text-base font-bold text-slate-900">{diagram.title}</h4>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
          Flowchart Diagram
        </span>
      </div>

      {renderError ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900">
          <p className="font-semibold mb-1">
            Visual flowchart preview could not be rendered:
          </p>
          <p className="text-slate-700">{diagram.description}</p>
        </div>
      ) : svgContent ? (
        <div
          id={containerId}
          className="flex justify-center my-4 overflow-x-auto print:max-w-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="py-8 text-center text-sm text-slate-500 animate-pulse">
          Rendering flowchart visualization...
        </div>
      )}

      <figcaption className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-600 italic">
        <strong>Diagram description:</strong> {diagram.description}
      </figcaption>
    </figure>
  );
}
