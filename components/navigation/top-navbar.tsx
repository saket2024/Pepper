"use client";

import React, { useRef } from "react";
import {
  FileText,
  Download,
  RotateCcw,
  Sparkles,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";
import { downloadPaperDocx } from "@/lib/docx/generate-paper-docx";

export function TopNavbar() {
  const { paper, loadSamplePaper, resetPaper, importPaperJSON, showAnswerKey } =
    usePaperStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const jsonStr = JSON.stringify(paper, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${paper.title.replace(/\s+/g, "_")}_draft.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importPaperJSON(content);
        if (success) {
          alert("Paper loaded successfully!");
        } else {
          alert("Invalid paper backup file.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1500px] h-16 rounded-full bg-white/[0.04] backdrop-blur-2xl border border-white/10 px-5 flex items-center justify-between shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <FileText size={20} />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-white tracking-tight">
            Paperly
          </span>
          <span className="text-zinc-500 text-sm hidden sm:inline">/</span>
          <span className="text-zinc-300 text-sm font-medium truncate max-w-[180px] sm:max-w-[300px] hidden sm:inline">
            {paper.schoolName || paper.title}
          </span>
        </div>
      </div>

      {/* Center Autosave Indicator */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs text-zinc-400">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <CheckCircle2 size={13} className="text-emerald-400" />
        <span>Autosaved locally</span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Sample Paper Dropdown / Button */}
        <div className="relative group">
          <button className="px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-200 transition-all flex items-center gap-1.5">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="hidden lg:inline">Presets</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-52 py-2 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all duration-200 z-50 flex flex-col gap-1 px-2">
            <button
              onClick={() => loadSamplePaper("english")}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-300 text-xs text-zinc-300 transition-all flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              Sample CBSE Science (English)
            </button>
            <button
              onClick={() => loadSamplePaper("hindi")}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-300 text-xs text-zinc-300 transition-all flex items-center gap-2"
            >
              <FileSpreadsheet size={14} />
              नमूना प्रश्न पत्र (Hindi)
            </button>
            <hr className="border-white/10 my-1" />
            <button
              onClick={resetPaper}
              className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 text-xs text-zinc-400 transition-all flex items-center gap-2"
            >
              <RotateCcw size={14} />
              Create Blank Paper
            </button>
          </div>
        </div>

        {/* Export / Import Backup */}
        <button
          onClick={handleExport}
          title="Export Paper JSON Backup"
          className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-zinc-300 transition-all hidden sm:flex"
        >
          <Download size={15} />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          title="Import Paper JSON"
          className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-zinc-300 transition-all hidden sm:flex"
        >
          <Upload size={15} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportFile}
          className="hidden"
        />

        {/* Primary Interactive Action Button (as per Design Spec) */}
        <button
          onClick={() => downloadPaperDocx(paper, showAnswerKey)}
          className="group relative pl-5 pr-2 py-1.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-semibold text-xs transition-all duration-300 flex items-center gap-3 shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:scale-[1.03]"
        >
          <span>Download Word (.docx)</span>
          <div className="w-8 h-8 rounded-full bg-zinc-950 text-white flex items-center justify-center group-hover:bg-zinc-800 transition-all">
            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
          </div>
        </button>
      </div>
    </header>
  );
}
