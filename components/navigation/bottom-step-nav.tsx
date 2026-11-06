"use client";

import React from "react";
import { ArrowLeft, ArrowRight, Check, Eye } from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";
import { calculateTotalMarks, calculateTotalQuestions } from "@/lib/model/paper";

const steps = [
  { label: "1. Exam Details", desc: "School & Meta" },
  { label: "2. Sections", desc: "Marks & Layout" },
  { label: "3. Questions", desc: "Add Questions" },
  { label: "4. Live Preview", desc: "Print & Download" },
];

export function BottomStepNav() {
  const { step, setStep, paper } = usePaperStore();
  const qCount = calculateTotalQuestions(paper);
  const totalM = calculateTotalMarks(paper);

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-[1200px] rounded-full bg-zinc-950/80 backdrop-blur-2xl border border-white/10 p-2 sm:p-2.5 flex items-center justify-between shadow-[0_12px_40px_rgba(0,0,0,0.6)]">
      {/* Steps Track */}
      <div className="flex items-center gap-1 sm:gap-2">
        {steps.map((s, idx) => {
          const isActive = step === idx;
          const isDone = step > idx;

          return (
            <button
              key={idx}
              onClick={() => setStep(idx)}
              className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium transition-all duration-300 ${
                isActive
                  ? "bg-emerald-400 text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] font-semibold"
                  : isDone
                  ? "bg-white/[0.08] text-white hover:bg-white/[0.12]"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  isActive
                    ? "bg-zinc-950 text-emerald-400 font-bold"
                    : isDone
                    ? "bg-emerald-400 text-zinc-950 font-bold"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {isDone ? <Check size={11} /> : idx + 1}
              </div>
              <span className="hidden md:inline">{s.label}</span>
              <span className="inline md:hidden">{idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* Center Stats summary badge */}
      <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-xs text-zinc-400">
        <span>
          Questions: <strong className="text-emerald-400">{qCount}</strong>
        </span>
        <span className="text-zinc-600">•</span>
        <span>
          Marks:{" "}
          <strong
            className={
              totalM === paper.maximumMarks
                ? "text-emerald-400"
                : "text-amber-400"
            }
          >
            {totalM} / {paper.maximumMarks}
          </strong>
        </span>
      </div>

      {/* Back / Next Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
          className="px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-zinc-300 text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          onClick={() => setStep(Math.min(3, step + 1))}
          className="px-5 py-2 rounded-full bg-white text-zinc-950 hover:bg-zinc-200 font-semibold text-xs transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02]"
        >
          {step === 3 ? (
            <>
              <span>Download Ready</span>
              <Check size={14} className="text-emerald-600" />
            </>
          ) : (
            <>
              <span>Next</span>
              <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
