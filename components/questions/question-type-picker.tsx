"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  CheckSquare,
  FileQuestion,
  Columns,
  CheckCircle,
  AlignLeft,
  FileText,
  Image,
  PenTool,
  MessageSquare,
  HelpCircle,
  BookOpen,
  BookMarked,
  Heading,
  Layers,
  Search,
  X,
} from "lucide-react";
import { QuestionType, questionMeta } from "@/lib/model/paper";

const typeIcons: Record<QuestionType, React.ReactNode> = {
  collection: <Layers size={18} className="text-black" />,
  section_header: <Heading size={18} className="text-black" />,
  mcq: <CheckSquare size={18} className="text-black" />,
  fill_blank: <FileQuestion size={18} className="text-black" />,
  match: <Columns size={18} className="text-black" />,
  true_false: <CheckCircle size={18} className="text-black" />,
  word_meaning: <BookMarked size={18} className="text-black" />,
  short: <AlignLeft size={18} className="text-black" />,
  long: <FileText size={18} className="text-black" />,
  picture: <Image size={18} className="text-black" />,
  diagram: <PenTool size={18} className="text-black" />,
  one_word: <MessageSquare size={18} className="text-black" />,
  assertion_reason: <HelpCircle size={18} className="text-black" />,
  case_study: <BookOpen size={18} className="text-black" />,
};

export function QuestionTypePicker({
  onSelect,
  onClose,
}: {
  onSelect: (type: QuestionType) => void;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const types = Object.keys(questionMeta) as QuestionType[];

  const filteredTypes = types.filter((type) => {
    const meta = questionMeta[type];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      meta.label.toLowerCase().includes(q) ||
      meta.description.toLowerCase().includes(q) ||
      type.toLowerCase().includes(q)
    );
  });

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-3xl neo-box-lg bg-white dark:bg-zinc-900 p-3 sm:p-6 shadow-neoLg flex flex-col max-h-[92vh] sm:max-h-[85vh]">
        {/* Fixed Header */}
        <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3 shrink-0">
          <h2 className="text-base sm:text-2xl font-black text-black dark:text-white uppercase tracking-tight">
            SELECT QUESTION TYPE
          </h2>
          <button
            onClick={onClose}
            className="neo-btn px-2.5 py-1.5 bg-rose-300 text-black text-[11px] font-black shadow-neoSm hover:scale-[1.02]"
          >
            ✕ Close
          </button>
        </div>

        {/* Instant Search Bar */}
        <div className="pt-3 pb-1 shrink-0">
          <div className="relative flex items-center">
            <Search size={16} className="absolute left-3 text-zinc-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question formats... (e.g. MCQ, Word Meaning, Collection, Section Header)"
              className="w-full h-10 pl-9 pr-8 neo-input text-xs font-semibold placeholder:text-zinc-400 bg-zinc-50 dark:bg-zinc-800"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-zinc-400 hover:text-black dark:hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Bento Grid */}
        <div className="flex-1 overflow-y-auto pt-3 pr-1 custom-scrollbar">
          {filteredTypes.length > 0 ? (
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-3 gap-2.5 pb-4">
              {filteredTypes.map((type) => {
                const meta = questionMeta[type];

                return (
                  <button
                    key={type}
                    onClick={() => {
                      onSelect(type);
                      onClose();
                    }}
                    className="neo-btn p-3.5 bg-zinc-50 dark:bg-zinc-800 hover:bg-yellow-300 dark:hover:bg-yellow-400 text-black dark:text-white hover:text-black text-left transition-all flex flex-col justify-between gap-2.5 shadow-neoSm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-yellow-400 text-black border-2 border-black flex items-center justify-center font-black">
                        {typeIcons[type]}
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-black text-yellow-300 uppercase">
                        {meta.defaultMarks} MARKS
                      </span>
                    </div>

                    <div>
                      <div className="text-xs sm:text-sm font-extrabold leading-snug">
                        {meta.label}
                      </div>
                      <div className="text-[11px] opacity-75 font-medium line-clamp-2 mt-0.5">
                        {meta.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 space-y-2">
              <p className="text-sm font-bold text-zinc-500">
                No matching question format for "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-xs font-bold hover:bg-yellow-300 hover:text-black transition-all"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
