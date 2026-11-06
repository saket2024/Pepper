"use client";

import React from "react";
import { Question } from "@/lib/model/paper";
import { usePaperStore } from "@/lib/store/paper-store";

export function TextQuestionForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const { paper } = usePaperStore();
  const includeAnswerKey = !!paper.includeAnswerKey;

  const currentLines = question.answerLines !== undefined
    ? question.answerLines
    : question.type === "long"
    ? 6
    : 3;

  return (
    <div className="space-y-3 pt-2">
      {question.type === "one_word" && includeAnswerKey && (
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
            Expected One-Word Answer (Answer Key)
          </label>
          <input
            type="text"
            value={question.expectedAnswer || ""}
            placeholder="e.g. Ampere / Mitochondria"
            onChange={(e) => onUpdate({ expectedAnswer: e.target.value })}
            className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400 text-xs focus:outline-none"
          />
        </div>
      )}

      {(question.type === "short" || question.type === "long") && (
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
            Number of Blank Lines / Answer Space in Printed Paper
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={20}
              value={currentLines}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdate({ answerLines: isNaN(val) ? 0 : Math.max(0, val) });
              }}
              className="w-24 h-9 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs font-semibold focus:outline-none"
            />
            <span className="text-xs text-zinc-400">
              {currentLines === 0 ? "0 (No Lines / Question Only)" : "solid lines"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
