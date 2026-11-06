"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Question, uid } from "@/lib/model/paper";
import { usePaperStore } from "@/lib/store/paper-store";

export function WordMeaningForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const { paper } = usePaperStore();
  const includeAnswerKey = !!paper.includeAnswerKey;
  const pairs = question.wordMeaningPairs || [];

  const handlePairChange = (idx: number, field: "word" | "meaning", val: string) => {
    const next = [...pairs];
    next[idx] = { ...next[idx], [field]: val };
    onUpdate({ wordMeaningPairs: next });
  };

  const handleAddPair = () => {
    onUpdate({
      wordMeaningPairs: [...pairs, { id: uid(), word: "", meaning: "" }],
    });
  };

  const handleRemovePair = (idx: number) => {
    onUpdate({
      wordMeaningPairs: pairs.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="space-y-3 pt-1">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
          Word List / शब्द सूची (Formatted as 2-Column Word _____ Grid)
        </label>
        <button
          type="button"
          onClick={handleAddPair}
          className="px-2 py-1 rounded bg-yellow-300 text-black border border-black text-[11px] font-black flex items-center gap-1 hover:scale-[1.02] shadow-neoSm"
        >
          <Plus size={12} />
          <span>Add Word</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {pairs.map((item, idx) => (
          <div
            key={item.id || idx}
            className="flex items-center gap-2 p-1.5 rounded-xl border-2 border-black/20 dark:border-white/20 bg-zinc-50 dark:bg-zinc-800"
          >
            <span className="w-5 h-5 rounded bg-black text-yellow-300 font-extrabold text-[10px] flex items-center justify-center shrink-0">
              {idx + 1}
            </span>

            <input
              type="text"
              value={item.word}
              placeholder={`Word ${idx + 1} (e.g. निबौरी)`}
              onChange={(e) => handlePairChange(idx, "word", e.target.value)}
              className="flex-1 h-8 px-2 neo-input text-xs font-semibold"
            />

            {includeAnswerKey && (
              <input
                type="text"
                value={item.meaning || ""}
                placeholder="Meaning (Answer key)"
                onChange={(e) => handlePairChange(idx, "meaning", e.target.value)}
                className="flex-1 h-8 px-2 neo-input text-xs"
              />
            )}

            <button
              type="button"
              onClick={() => handleRemovePair(idx)}
              className="p-1 text-rose-600 hover:bg-rose-100 rounded shrink-0"
              title="Remove Word"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
