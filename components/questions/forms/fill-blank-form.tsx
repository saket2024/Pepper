"use client";

import React from "react";
import { Question } from "@/lib/model/paper";
import { Sparkles } from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";

export function FillBlankForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const { paper } = usePaperStore();
  const includeAnswerKey = !!paper.includeAnswerKey;

  const insertBlank = () => {
    onUpdate({ prompt: (question.prompt || "") + " ______ " });
  };

  const blankAnswers = question.blankAnswers || [""];

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          Fill in Blanks Setup
        </label>
        <button
          type="button"
          onClick={insertBlank}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <Sparkles size={12} />
          <span>Insert Blank Underline (______)</span>
        </button>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
          Word Bank / Options Pool (Optional)
        </label>
        <input
          type="text"
          value={question.sectionSubtitle || ""}
          placeholder="e.g. (पुस्तके, सफ़ाई, झाड़ू, परदे) or (गायों / भेड़ों)"
          onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
          className="w-full h-8 px-3 neo-input text-xs italic bg-white dark:bg-zinc-900"
        />
      </div>

      {includeAnswerKey && (
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400">Expected Answers for Blanks (Answer Key)</label>
          <input
            type="text"
            value={blankAnswers.join(", ")}
            placeholder="e.g. Paris, 1789 (comma separated if multiple blanks)"
            onChange={(e) =>
              onUpdate({
                blankAnswers: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-white/10 text-emerald-400 text-xs focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
