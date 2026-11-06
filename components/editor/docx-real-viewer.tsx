"use client";

import React, { useEffect, useRef, useState } from "react";
import { Paper } from "@/lib/model/paper";
import { generatePaperDocxBlob } from "@/lib/docx/generate-paper-docx";
import { Loader2, AlertCircle } from "lucide-react";

export function DocxRealViewer({
  paper,
  showAnswerKey = false,
}: {
  paper: Paper;
  showAnswerKey?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewHeight, setPreviewHeight] = useState<number | undefined>();

  const fitPreviewToWidth = () => {
    const container = containerRef.current;
    const firstPage = container?.querySelector("section.docx") as HTMLElement | null;
    if (!container || !firstPage) return;

    const availableWidth = container.parentElement?.clientWidth || container.clientWidth;
    const pageWidth = firstPage.offsetWidth;
    if (!availableWidth || !pageWidth) return;

    const scale = Math.min(1, Math.max(0.35, (availableWidth - 8) / pageWidth));
    setPreviewScale(scale);
    setPreviewHeight(container.scrollHeight * scale + 8);
  };

  useEffect(() => {
    let isMounted = true;

    async function renderDocxDocument() {
      if (!containerRef.current) return;
      setLoading(true);
      setError(null);

      try {
        // 1. Generate real compiled Word .docx blob using exact website engine
        const blob = await generatePaperDocxBlob(paper, showAnswerKey);
        const arrayBuffer = await blob.arrayBuffer();

        if (!isMounted || !containerRef.current) return;

        // 2. Clear container
        containerRef.current.innerHTML = "";

        // 3. Dynamically import docx-preview for SSR compatibility
        const docxPreview = await import("docx-preview");

        if (containerRef.current && isMounted) {
          await docxPreview.renderAsync(arrayBuffer, containerRef.current, undefined, {
            className: "docx-real-render",
            inWrapper: false,
            ignoreWidth: false,
            ignoreHeight: false,
            ignoreFonts: false,
            breakPages: true,
            experimental: true,
            renderHeaders: true,
            renderFooters: true,
            renderFootnotes: true,
          });
          requestAnimationFrame(fitPreviewToWidth);
        }
      } catch (err: any) {
        console.error("Error rendering real DOCX file:", err);
        if (isMounted) {
          setError(err?.message || "Failed to render Word document preview.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    renderDocxDocument();

    const resizeObserver = new ResizeObserver(fitPreviewToWidth);
    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
    };
  }, [paper, showAnswerKey]);

  return (
    <div className="w-full relative min-h-[600px] flex flex-col items-center">
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm flex flex-col items-center justify-center gap-3 rounded-2xl">
          <Loader2 className="animate-spin text-yellow-500" size={36} />
          <span className="text-xs font-black uppercase tracking-wider text-black dark:text-white">
            Rendering Real Word (.docx) File...
          </span>
        </div>
      )}

      {error && (
        <div className="p-6 bg-rose-50 border-2 border-rose-500 rounded-2xl text-rose-700 text-xs font-bold flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Real Word DOCX Render Container */}
      <div
        ref={containerRef}
        className="docx-real-wrapper flex flex-col items-center py-2"
        style={{
          width: previewScale < 1 ? `${100 / previewScale}%` : "100%",
          height: previewHeight,
          transform: `scale(${previewScale})`,
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}
