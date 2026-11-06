"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Question } from "@/lib/model/paper";
import { usePaperStore } from "@/lib/store/paper-store";

export function McqForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const { paper } = usePaperStore();
  const includeAnswerKey = !!paper.includeAnswerKey;

  const options = question.options || ["Option A", "Option B", "Option C", "Option D"];

  const handleOptionChange = (idx: number, val: string) => {
    const next = [...options];
    next[idx] = val;
    onUpdate({ options: next });
  };

  const handleAddOption = () => {
    if (options.length >= 6) return;
    const label = String.fromCharCode(65 + options.length);
    onUpdate({ options: [...options, `Option ${label}`] });
  };

  const handleRemoveOption = (idx: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== idx);
    let correct = question.correctOptionIndex;
    if (correct !== undefined && correct >= next.length) {
      correct = next.length - 1;
    }
    onUpdate({ options: next, correctOptionIndex: correct });
  };

  return (
    <div className="space-y-2 pt-1">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt, idx) => {
          const isCorrect = includeAnswerKey && question.correctOptionIndex === idx;
          const letter = String.fromCharCode(65 + idx);

          return (
            <div
              key={idx}
              className={`flex items-center gap-1.5 p-1 rounded-xl border-2 transition-all ${
                isCorrect
                  ? "bg-yellow-300 dark:bg-yellow-400 text-black border-black shadow-neoSm"
                  : "bg-zinc-50 dark:bg-zinc-800/80 border-black/20 dark:border-white/20 text-black dark:text-white"
              }`}
            >
              {includeAnswerKey ? (
                <button
                  type="button"
                  onClick={() => onUpdate({ correctOptionIndex: idx })}
                  className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 border border-black ${
                    isCorrect
                      ? "bg-black text-yellow-300"
                      : "bg-white dark:bg-zinc-900 text-black dark:text-white"
                  }`}
                  title="Mark correct option"
                >
                  {letter}
                </button>
              ) : (
                <span className="w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 bg-zinc-200 dark:bg-zinc-700 text-black dark:text-white border border-black/20">
                  {letter}
                </span>
              )}

              <input
                type="text"
                value={opt}
                placeholder={`Option ${letter}`}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                className="flex-1 h-8 px-2 bg-transparent font-medium text-xs focus:outline-none"
              />

              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="p-1 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950 rounded transition-all shrink-0"
                  title="Remove Option"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {options.length < 6 && (
        <button
          type="button"
          onClick={handleAddOption}
          className="px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white border border-black dark:border-white text-[11px] font-bold flex items-center gap-1 hover:bg-yellow-300 hover:text-black transition-all"
        >
          <Plus size={12} />
          <span>Add Option ({String.fromCharCode(65 + options.length)})</span>
        </button>
      )}
    </div>
  );
}
