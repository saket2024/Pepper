"use client";

import React from "react";
import {
  FileText,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Plus,
  Trash2,
  Sparkles,
  Info,
} from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";
import { NeoSelect, SelectOption } from "@/components/ui/neo-select";

const formatOptions: SelectOption[] = [
  { value: "a5", label: "A5 Portrait (Reference Exam Format)" },
  { value: "a4", label: "A4 Standard Format" },
  { value: "a3", label: "A3 Booklet Format" },
];

export function StepExamInfo() {
  const {
    paper,
    updatePaperDetails,
    addInstruction,
    updateInstruction,
    removeInstruction,
    setStep,
  } = usePaperStore();

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-32">
      {/* Header & Top Navigation Bar */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-300 border-2 border-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles size={13} />
            Step 2 of 5
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black dark:text-white uppercase tracking-tight">
            Exam Details & Instructions
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto font-medium">
            Set up exam details, duration, maximum marks, and general student instructions for <strong className="text-black dark:text-white underline">{paper.schoolName || "your school"}</strong>.
          </p>
        </div>

        {/* Top Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setStep(0)}
            className="neo-btn px-6 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-extrabold uppercase"
          >
            ← School Selection
          </button>

          <button
            onClick={() => setStep(2)}
            className="neo-btn px-6 py-2.5 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoSm hover:scale-[1.02]"
          >
            Continue to Questions →
          </button>
        </div>
      </div>

      {/* Main Neo Card */}
      <div className="neo-box-lg p-6 sm:p-10 space-y-8 relative">
        {/* Autosave Indicator in Corner */}
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-500 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Autosaved</span>
        </div>

        {/* Core Exam Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
              <FileText size={14} className="text-yellow-500" />
              Exam Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Mid-Term Examination 2026"
              value={paper.examName}
              onChange={(e) => updatePaperDetails({ examName: e.target.value })}
              className="w-full h-11 px-3.5 neo-input text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
              <BookOpen size={14} className="text-cyan-500" />
              Subject *
            </label>
            <input
              type="text"
              placeholder="e.g. Science / Mathematics / हिंदी"
              value={paper.subject}
              onChange={(e) => updatePaperDetails({ subject: e.target.value })}
              className="w-full h-11 px-3.5 neo-input text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white">
              Class / Grade *
            </label>
            <input
              type="text"
              placeholder="e.g. Class X (10th)"
              value={paper.className}
              onChange={(e) => updatePaperDetails({ className: e.target.value })}
              className="w-full h-11 px-3.5 neo-input text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
              <Calendar size={14} className="text-pink-500" />
              Date
            </label>
            <input
              type="text"
              placeholder="e.g. 15-09-2026"
              value={paper.date}
              onChange={(e) => updatePaperDetails({ date: e.target.value })}
              className="w-full h-11 px-3.5 neo-input text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
              <Clock size={14} className="text-green-500" />
              Time Duration *
            </label>
            <input
              type="text"
              placeholder="e.g. 3 Hours or 90 Mins"
              value={paper.duration}
              onChange={(e) => updatePaperDetails({ duration: e.target.value })}
              className="w-full h-11 px-3.5 neo-input text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
              <Award size={14} className="text-yellow-500" />
              Maximum Marks *
            </label>
            <input
              type="number"
              min={0.5}
              step={0.5}
              placeholder="e.g. 80"
              value={paper.maximumMarks}
              onChange={(e) =>
                updatePaperDetails({ maximumMarks: parseFloat(e.target.value) || 0 })
              }
              className="w-full h-11 px-3.5 neo-input text-sm font-extrabold text-emerald-600 dark:text-emerald-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white">
              Paper Page Format
            </label>
            <NeoSelect
              options={formatOptions}
              value={paper.templateFormat}
              onChange={(val) => updatePaperDetails({ templateFormat: val as any })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white">
              Paper Font Family
            </label>
            <NeoSelect
              options={[
                { value: "Calibri", label: "Calibri (English)" },
                { value: "Mangal", label: "Mangal (Hindi)" },
                { value: "Inter", label: "Inter (Modern)" },
                { value: "Times New Roman", label: "Times New Roman" },
              ]}
              value={paper.fontFamily}
              onChange={(val) => updatePaperDetails({ fontFamily: val as any })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-black dark:text-white">
              Include Answer Key at End?
            </label>
            <button
              type="button"
              onClick={() =>
                updatePaperDetails({ includeAnswerKey: !paper.includeAnswerKey })
              }
              className={`w-full h-11 px-3.5 neo-input text-xs font-extrabold flex items-center justify-between transition-all ${
                paper.includeAnswerKey
                  ? "bg-emerald-400 text-black border-black shadow-neoSm"
                  : "bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white"
              }`}
            >
              <span>{paper.includeAnswerKey ? "Yes (Add Answer Key)" : "No (Student Paper Only)"}</span>
              <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-black">
                {paper.includeAnswerKey ? "✓" : "✕"}
              </span>
            </button>
          </div>
        </div>

        <hr className="border-2 border-black dark:border-white" />

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase text-black dark:text-white flex items-center gap-1.5">
              <Info size={14} className="text-cyan-500" />
              General Instructions for Students
            </label>

            <button
              type="button"
              onClick={() => addInstruction("")}
              className="neo-btn px-3 py-1 bg-yellow-300 text-black text-xs font-extrabold flex items-center gap-1"
            >
              <Plus size={14} />
              Add Instruction
            </button>
          </div>

          <div className="space-y-2.5">
            {paper.instructions.map((inst, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-xl bg-black text-yellow-300 border-2 border-black font-black text-xs flex items-center justify-center shrink-0 shadow-neoSm">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={inst}
                  placeholder={`Instruction ${idx + 1}`}
                  onChange={(e) => updateInstruction(idx, e.target.value)}
                  className="flex-1 h-10 px-3 neo-input text-xs"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(idx)}
                  className="neo-btn p-2 bg-rose-300 text-black shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(0)}
          className="neo-btn px-6 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-extrabold uppercase"
        >
          ← School Selection
        </button>

        <button
          onClick={() => setStep(2)}
          className="neo-btn px-8 py-3 bg-yellow-400 text-black text-sm font-black uppercase shadow-neoLg hover:scale-[1.02]"
        >
          Continue to Section Setup →
        </button>
      </div>
    </div>
  );
}
