"use client";

import React from "react";
import {
  GripVertical,
  Trash2,
  Copy,
  Award,
  Heading,
  Layers,
} from "lucide-react";
import { Question, QuestionType, calculateQuestionMarks, questionMeta } from "@/lib/model/paper";
import { NeoSelect, SelectOption } from "@/components/ui/neo-select";
import { McqForm } from "./forms/mcq-form";
import { MatchFollowingForm } from "./forms/match-following-form";
import { FillBlankForm } from "./forms/fill-blank-form";
import { TrueFalseForm } from "./forms/true-false-form";
import { TextQuestionForm } from "./forms/text-question-form";
import { PictureQuestionForm } from "./forms/picture-question-form";
import { AssertionReasonForm } from "./forms/assertion-reason-form";
import { CaseStudyForm } from "./forms/case-study-form";
import { WordMeaningForm } from "./forms/word-meaning-form";
import { CollectionForm } from "./forms/collection-form";

const formatSelectOptions: SelectOption[] = (
  Object.keys(questionMeta) as QuestionType[]
).map((t) => ({
  value: t,
  label: questionMeta[t].label,
  sublabel: `${questionMeta[t].defaultMarks}m`,
}));

export function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
  dragHandleProps,
}: {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  dragHandleProps?: any;
}) {
  const isHeader = question.type === "section_header";
  const isCollection = question.type === "collection";
  const calculatedMarks = calculateQuestionMarks(question);

  return (
    <div
      className={`neo-box p-3.5 sm:p-4 space-y-2.5 transition-all ${
        isHeader
          ? "bg-yellow-100 dark:bg-zinc-800 border-2 border-black dark:border-yellow-400"
          : isCollection
          ? "bg-cyan-50 dark:bg-zinc-850 border-2 border-cyan-500 dark:border-cyan-400"
          : "bg-white dark:bg-zinc-900"
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2 border-b-2 border-black dark:border-white pb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* Drag Handle */}
          <button
            type="button"
            {...dragHandleProps}
            className="neo-btn p-1 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white cursor-grab active:cursor-grabbing"
            title="Drag to reorder"
          >
            <GripVertical size={14} />
          </button>

          <span
            className={`w-7 h-7 rounded-lg text-black border-2 border-black font-black text-xs flex items-center justify-center shrink-0 shadow-neoSm ${
              isHeader
                ? "bg-pink-400"
                : isCollection
                ? "bg-cyan-400"
                : "bg-yellow-400"
            }`}
          >
            {isHeader ? "H" : isCollection ? "📁" : `Q${index + 1}`}
          </span>

          {/* Question Format Dropdown Selector directly on card */}
          <div className="flex-1 min-w-0 sm:w-56 sm:flex-none">
            <NeoSelect
              options={formatSelectOptions}
              value={question.type || "mcq"}
              onChange={(val) => {
                const nextType = val as QuestionType;
                onUpdate({
                  type: nextType,
                  marks: questionMeta[nextType]?.defaultMarks || 1,
                });
              }}
            />
          </div>
        </div>

        {/* Actions & Marks */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
          {!isHeader && (
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-white rounded-lg px-2 py-0.5">
              <Award size={13} className="text-yellow-500" />
              {isCollection ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs">
                  {calculatedMarks}m
                </span>
              ) : (
                <input
                  type="number"
                  min={0.5}
                  step={0.5}
                  max={50}
                  value={question.marks}
                  onChange={(e) => onUpdate({ marks: parseFloat(e.target.value) || 0.5 })}
                  className="w-10 bg-transparent text-emerald-600 dark:text-emerald-400 font-black text-xs text-center focus:outline-none"
                />
              )}
              {!isCollection && (
                <span className="text-[10px] font-black uppercase text-zinc-500">m</span>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={onDuplicate}
            className="neo-btn p-1.5 bg-pink-300 text-black"
            title="Duplicate"
          >
            <Copy size={13} />
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="neo-btn p-1.5 bg-rose-300 text-black"
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Section Heading Divider Editor */}
      {isHeader ? (
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <Heading size={16} className="text-yellow-600 shrink-0" />
            <input
              type="text"
              placeholder="Section Heading Title (e.g. I. दिए गए शब्दों में से किन्हीं 3 शब्दों के अर्थ लिखो :-)"
              value={question.prompt || ""}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              className="w-full h-10 px-3 neo-input text-xs sm:text-sm font-black bg-white dark:bg-zinc-900"
            />
          </div>
          <input
            type="text"
            placeholder="Section Subtitle / Instructions (e.g. Attempt all questions)"
            value={question.sectionSubtitle || ""}
            onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
            className="w-full h-9 px-3 neo-input text-xs italic bg-white dark:bg-zinc-900"
          />
        </div>
      ) : isCollection ? (
        /* Question Collection Form */
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
              <Layers size={12} className="text-cyan-500" />
              Collection Group Title / Heading
            </label>
            <input
              type="text"
              placeholder="e.g. 1. Write the meaning of following words:"
              value={question.prompt}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              className="w-full h-10 px-3 neo-input text-xs font-bold bg-white dark:bg-zinc-900"
            />
          </div>

          <CollectionForm question={question} onUpdate={onUpdate} />
        </div>
      ) : (
        /* Standard Question Prompt & Specific Question Type Forms */
        <div className="space-y-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
              Question Prompt / Text
            </label>
            <input
              type="text"
              placeholder="Type your question prompt here..."
              value={question.prompt}
              onChange={(e) => onUpdate({ prompt: e.target.value })}
              className="w-full h-10 px-3 neo-input text-xs font-semibold"
            />
          </div>

          {/* Form specific components */}
          {question.type === "mcq" && (
            <McqForm question={question} onUpdate={onUpdate} />
          )}

          {question.type === "match" && (
            <MatchFollowingForm question={question} onUpdate={onUpdate} />
          )}

          {question.type === "fill_blank" && (
            <FillBlankForm question={question} onUpdate={onUpdate} />
          )}

          {question.type === "true_false" && (
            <TrueFalseForm question={question} onUpdate={onUpdate} />
          )}

          {question.type === "word_meaning" && (
            <WordMeaningForm question={question} onUpdate={onUpdate} />
          )}

          {(question.type === "short" ||
            question.type === "long" ||
            question.type === "one_word") && (
            <TextQuestionForm question={question} onUpdate={onUpdate} />
          )}

          {(question.type === "picture" || question.type === "diagram") && (
            <PictureQuestionForm question={question} onUpdate={onUpdate} />
          )}

          {question.type === "assertion_reason" && (
            <AssertionReasonForm question={question} onUpdate={onUpdate} />
          )}

          {question.type === "case_study" && (
            <CaseStudyForm question={question} onUpdate={onUpdate} />
          )}
        </div>
      )}
    </div>
  );
}
