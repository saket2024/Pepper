"use client";

import React from "react";
import {
  Download,
  Printer,
  Sparkles,
  Eye,
  ArrowLeft,
  FileCheck,
} from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";
import { downloadPaperDocx } from "@/lib/docx/generate-paper-docx";
import {
  calculateTotalMarks,
  calculateTotalQuestions,
  Paper,
} from "@/lib/model/paper";
import { NeoSelect, SelectOption } from "@/components/ui/neo-select";
import { DocxRealViewer } from "./docx-real-viewer";

const fontOptions: SelectOption[] = [
  { value: "Calibri", label: "Calibri (English)" },
  { value: "Mangal", label: "Mangal (Hindi Devanagari)" },
  { value: "Inter", label: "Inter (Modern)" },
  { value: "Times New Roman", label: "Times New Roman (Academic)" },
  { value: "Arial", label: "Arial (Clean)" },
];

const pageFormatOptions: SelectOption[] = [
  { value: "a5", label: "A5 Portrait (Standard Exam Format)" },
  { value: "a4", label: "A4 Standard Format" },
  { value: "a3", label: "A3 Booklet Format" },
];

export function StepPreview() {
  const {
    paper,
    setStep,
    updatePaperDetails,
    showAnswerKey,
    setShowAnswerKey,
  } = usePaperStore();

  const totalQs = calculateTotalQuestions(paper);
  const totalMarks = calculateTotalMarks(paper);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-32">
      {/* Header & Controls */}
      <div className="space-y-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black dark:border-white pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-300 border-2 border-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
              <Sparkles size={13} />
              Step 4 of 4 • Final Review
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black dark:text-white uppercase tracking-tight">
              Real Word (.docx) Paper Review
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
              Viewing the actual compiled Word document file ({paper.templateFormat?.toUpperCase() || "A5"} Page Format, {paper.fontFamily || "Calibri"} Font).
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <button
              onClick={() => setStep(2)}
              className="neo-btn justify-center px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-extrabold uppercase flex items-center gap-1"
            >
              <ArrowLeft size={14} />
              <span>← Edit Questions</span>
            </button>

            <button
              onClick={() => window.print()}
              className="neo-btn justify-center px-4 py-2 bg-cyan-300 text-black text-xs font-black uppercase flex items-center gap-1.5 shadow-neoSm"
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              onClick={() => downloadPaperDocx(paper, showAnswerKey)}
              className="neo-btn justify-center px-5 py-2 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoLg flex items-center gap-2 hover:scale-[1.03]"
            >
              <Download size={15} />
              <span>Download .docx</span>
            </button>
          </div>
        </div>

        {/* Paper Details Control Bar */}
        <div className="neo-box p-4 bg-zinc-50 dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 bg-yellow-300 text-black px-3 py-1 rounded-xl border border-black font-extrabold shadow-neoSm">
              <FileCheck size={14} />
              <span>{totalQs} Questions</span>
              <span>•</span>
              <span>{totalMarks} Total Marks</span>
            </div>

            {/* Answer Key Toggle if enabled */}
            {paper.includeAnswerKey && (
              <label className="flex items-center gap-2 cursor-pointer font-extrabold select-none">
                <input
                  type="checkbox"
                  checked={showAnswerKey}
                  onChange={(e) => setShowAnswerKey(e.target.checked)}
                  className="w-4 h-4 accent-yellow-400 rounded cursor-pointer"
                />
                <span className="text-zinc-800 dark:text-zinc-200">
                  Include Answer Key Section in Review & Export
                </span>
              </label>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Template Selector */}
            <div className="w-48">
              <NeoSelect
                options={pageFormatOptions}
                value={paper.templateFormat || "a5"}
                onChange={(val) =>
                  updatePaperDetails({
                    templateFormat: val as Paper["templateFormat"],
                  })
                }
              />
            </div>

            {/* Font Family Selector */}
            <div className="w-48">
              <NeoSelect
                options={fontOptions}
                value={paper.fontFamily || "Calibri"}
                onChange={(val) => updatePaperDetails({ fontFamily: val as Paper["fontFamily"] })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real Word (.docx) Document Renderer Frame */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl bg-zinc-800 dark:bg-zinc-950 p-2 sm:p-8 neo-box-lg shadow-neoLg overflow-hidden">
        <div className="w-full min-w-0 bg-white text-zinc-900 p-1 sm:p-6 shadow-2xl rounded-xl border-2 border-black overflow-hidden">
          <DocxRealViewer paper={paper} showAnswerKey={showAnswerKey} />
        </div>
      </div>
    </div>
  );
}
