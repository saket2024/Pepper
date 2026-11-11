"use client";

import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";

export function BottomNavHub() {
  const {
    step,
    setStep,
    nextSectionOrStep,
    prevSectionOrStep,
    paper,
    stepValidationError,
    clearValidationError,
  } = usePaperStore();

  return (
    <>
      {/* Toast Warning for missing required information */}
      {stepValidationError && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[100] w-[92%] max-w-lg bg-rose-500 text-white font-black text-xs sm:text-sm px-4 py-3 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-between gap-3 animate-fade-in-up">
          <div className="flex items-center gap-2">
            <AlertTriangle size={18} className="shrink-0" />
            <span>{stepValidationError}</span>
          </div>
          <button
            onClick={clearValidationError}
            className="px-2 py-0.5 rounded bg-black/20 text-white hover:bg-black/40 text-xs font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      )}

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 w-[96%] max-w-[1250px] bg-white dark:bg-zinc-900 border-2 border-black dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff] rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition-colors">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-extrabold shadow-[2px_2px_0px_0px_#000]">
            <FileText size={18} />
          </div>

          <div className="hidden lg:flex flex-col">
            <span className="font-extrabold text-sm leading-tight text-black dark:text-white uppercase tracking-tight">
              Pepper
            </span>
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
              {paper.schoolName || paper.title || "Exam Builder"}
            </span>
          </div>
        </div>

        {/* Step Indicators (4 Steps Workflow) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
          {/* Step 1: School */}
          <button
            onClick={() => setStep(0)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 border-black dark:border-white ${
              step === 0
                ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]"
                : step > 0
                ? "bg-emerald-400 text-black"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-extrabold">
              {step > 0 ? <Check size={10} /> : 1}
            </span>
            <span className="hidden md:inline">1. School</span>
            <span className="inline md:hidden">1</span>
          </button>

          {/* Step 2: Exam Info */}
          <button
            onClick={() => setStep(1)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 border-black dark:border-white ${
              step === 1
                ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]"
                : step > 1
                ? "bg-emerald-400 text-black"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-extrabold">
              {step > 1 ? <Check size={10} /> : 2}
            </span>
            <span className="hidden md:inline">2. Exam Info</span>
            <span className="inline md:hidden">2</span>
          </button>

          {/* Step 3: Questions */}
          <button
            onClick={() => setStep(2)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 border-black dark:border-white ${
              step === 2
                ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]"
                : step > 2
                ? "bg-emerald-400 text-black"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-extrabold">
              {step > 2 ? <Check size={10} /> : 3}
            </span>
            <span className="hidden md:inline">3. Questions</span>
            <span className="inline md:hidden">3</span>
          </button>

          {/* Step 4: Review & Export */}
          <button
            onClick={() => setStep(3)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border-2 border-black dark:border-white ${
              step === 3
                ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_#000]"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center text-[10px] font-extrabold">
              4
            </span>
            <span className="hidden md:inline">4. Review</span>
            <span className="inline md:hidden">4</span>
          </button>
        </div>

        {/* Prev / Next Nav Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSectionOrStep}
            disabled={step === 0}
            className="neo-btn px-3 py-1.5 sm:px-4 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-black disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Back</span>
          </button>

          <button
            onClick={nextSectionOrStep}
            disabled={step === 3}
            className="neo-btn px-3 py-1.5 sm:px-5 bg-yellow-400 text-black text-xs font-black shadow-neoSm hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </nav>
    </>
  );
}
