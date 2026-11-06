"use client";

import React from "react";
import { Question } from "@/lib/model/paper";

export function AssertionReasonForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  return (
    <div className="space-y-3 pt-2">
      <div className="space-y-1">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
          Assertion Statement (A) *
        </label>
        <input
          type="text"
          value={question.assertion || ""}
          placeholder="e.g. Sky appears blue during daytime."
          onChange={(e) => onUpdate({ assertion: e.target.value })}
          className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400/60"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
          Reason Statement (R) *
        </label>
        <input
          type="text"
          value={question.reason || ""}
          placeholder="e.g. Atmosphere scatters blue light more strongly than red light."
          onChange={(e) => onUpdate({ reason: e.target.value })}
          className="w-full h-10 px-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400/60"
        />
      </div>
    </div>
  );
}
