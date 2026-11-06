"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Question, uid } from "@/lib/model/paper";

export function CaseStudyForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const subQuestions = question.subQuestions || [];

  const handleAddSubQuestion = () => {
    const newSub: Question = {
      id: uid(),
      type: "short",
      prompt: "Sub-question text...",
      marks: 1,
      answerLines: 2,
    };
    onUpdate({ subQuestions: [...subQuestions, newSub] });
  };

  const handleUpdateSubQuestion = (
    idx: number,
    updates: Partial<Question>
  ) => {
    const next = [...subQuestions];
    next[idx] = { ...next[idx], ...updates };
    onUpdate({ subQuestions: next });
  };

  const handleRemoveSubQuestion = (idx: number) => {
    const next = subQuestions.filter((_, i) => i !== idx);
    onUpdate({ subQuestions: next });
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
          Passage / Story / Case Study Text
        </label>
        <textarea
          rows={3}
          value={question.passage || ""}
          placeholder="Enter the case study passage or experiment details here..."
          onChange={(e) => onUpdate({ passage: e.target.value })}
          className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400/60"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
            Sub-Questions ({subQuestions.length})
          </label>
          <button
            type="button"
            onClick={handleAddSubQuestion}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <Plus size={12} />
            Add Sub-Question
          </button>
        </div>

        <div className="space-y-2">
          {subQuestions.map((subQ, idx) => (
            <div
              key={subQ.id || idx}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-zinc-900/80 border border-white/10"
            >
              <span className="w-6 text-xs font-bold text-emerald-400 text-center">
                ({String.fromCharCode(97 + idx)})
              </span>
              <input
                type="text"
                value={subQ.prompt}
                placeholder={`Sub-question (${String.fromCharCode(97 + idx)})`}
                onChange={(e) =>
                  handleUpdateSubQuestion(idx, { prompt: e.target.value })
                }
                className="flex-1 h-8 px-2 rounded-lg bg-transparent text-white text-xs focus:outline-none"
              />
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={subQ.marks}
                  onChange={(e) =>
                    handleUpdateSubQuestion(idx, {
                      marks: Number(e.target.value) || 1,
                    })
                  }
                  className="w-14 h-8 px-2 rounded-lg bg-zinc-800 text-white text-xs font-bold text-center focus:outline-none"
                />
                <span className="text-[10px] text-zinc-400">marks</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSubQuestion(idx)}
                className="p-1 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
