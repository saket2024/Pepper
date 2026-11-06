"use client";

import React from "react";
import { Question } from "@/lib/model/paper";
import { Check, X } from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";

export function TrueFalseForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const { paper } = usePaperStore();
  const includeAnswerKey = !!paper.includeAnswerKey;

  if (!includeAnswerKey) {
    return null;
  }

  const isTrue = question.isTrue ?? true;

  return (
    <div className="space-y-2 pt-2">
      <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
        Correct Answer (for Teacher Answer Key)
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onUpdate({ isTrue: true })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isTrue
              ? "bg-emerald-400 text-zinc-950 shadow-md"
              : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
          }`}
        >
          <Check size={14} />
          True Statement
        </button>

        <button
          type="button"
          onClick={() => onUpdate({ isTrue: false })}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            !isTrue
              ? "bg-rose-500 text-white shadow-md"
              : "bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
          }`}
        >
          <X size={14} />
          False Statement
        </button>
      </div>
    </div>
  );
}
