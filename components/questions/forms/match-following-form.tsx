"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Question, MatchPair, uid } from "@/lib/model/paper";

export function MatchFollowingForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const pairs = question.matchPairs || [
    { id: uid(), left: "Item 1", right: "Match 1" },
    { id: uid(), left: "Item 2", right: "Match 2" },
  ];

  const handlePairChange = (
    idx: number,
    field: "left" | "right",
    val: string
  ) => {
    const next = [...pairs];
    next[idx] = { ...next[idx], [field]: val };
    onUpdate({ matchPairs: next });
  };

  const handleAddPair = () => {
    const newPair: MatchPair = {
      id: uid(),
      left: `Column A Item ${pairs.length + 1}`,
      right: `Column B Item ${pairs.length + 1}`,
    };
    onUpdate({ matchPairs: [...pairs, newPair] });
  };

  const handleRemovePair = (idx: number) => {
    if (pairs.length <= 1) return;
    const next = pairs.filter((_, i) => i !== idx);
    onUpdate({ matchPairs: next });
  };

  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          Match Column A with Column B
        </label>
        <button
          type="button"
          onClick={handleAddPair}
          className="px-3 py-1 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1 transition-all"
        >
          <Plus size={13} />
          Add Pair Row
        </button>
      </div>

      {/* Two Column Table Headers */}
      <div className="grid grid-cols-12 gap-2 text-xs font-bold text-zinc-400 uppercase tracking-wider px-2">
        <div className="col-span-5">Column A</div>
        <div className="col-span-6">Column B</div>
        <div className="col-span-1 text-center"></div>
      </div>

      <div className="space-y-2">
        {pairs.map((pair, idx) => (
          <div key={pair.id || idx} className="grid grid-cols-12 gap-2 items-center">
            <div className="col-span-5 flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 w-4 text-right">
                {idx + 1}.
              </span>
              <input
                type="text"
                value={pair.left}
                placeholder="Column A text"
                onChange={(e) => handlePairChange(idx, "left", e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400/60"
              />
            </div>

            <div className="col-span-6 flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 w-4 text-right">
                ({String.fromCharCode(97 + idx)})
              </span>
              <input
                type="text"
                value={pair.right}
                placeholder="Column B matching text"
                onChange={(e) => handlePairChange(idx, "right", e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400/60"
              />
            </div>

            <div className="col-span-1 flex justify-center">
              {pairs.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemovePair(idx)}
                  className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
