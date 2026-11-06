"use client";

import React from "react";
import { Plus, Trash2, Layers, Award } from "lucide-react";
import { Question, QuestionType, questionMeta, uid } from "@/lib/model/paper";
import { NeoSelect, SelectOption } from "@/components/ui/neo-select";
import { McqForm } from "./mcq-form";
import { MatchFollowingForm } from "./match-following-form";
import { FillBlankForm } from "./fill-blank-form";
import { TrueFalseForm } from "./true-false-form";
import { TextQuestionForm } from "./text-question-form";
import { WordMeaningForm } from "./word-meaning-form";
import { PictureQuestionForm } from "./picture-question-form";

const formatSelectOptions: SelectOption[] = (
  Object.keys(questionMeta) as QuestionType[]
)
  .filter((t) => t !== "collection" && t !== "section_header")
  .map((t) => ({
    value: t,
    label: questionMeta[t].label,
    sublabel: `${questionMeta[t].defaultMarks}m`,
  }));

export function CollectionForm({
  question,
  onUpdate,
}: {
  question: Question;
  onUpdate: (updates: Partial<Question>) => void;
}) {
  const collectionFormat = question.collectionType || "word_meaning";
  const subQuestions = question.subQuestions || [];
  const totalCollectionMarks = Number(question.marks) || 0;

  const handleAddSubQuestion = () => {
    const newSubQ: Question = {
      id: uid(),
      type: collectionFormat,
      prompt: `Question ${subQuestions.length + 1}`,
      // Collection marks are entered once for the whole group. Sub-question
      // marks are retained only for backward compatibility and are ignored.
      marks: 0,
      options: collectionFormat === "mcq" ? ["", "", "", ""] : undefined,
      blankAnswers: collectionFormat === "fill_blank" ? [""] : undefined,
      wordMeaningPairs:
        collectionFormat === "word_meaning"
          ? [{ id: uid(), word: "", meaning: "" }]
          : undefined,
    };
    onUpdate({ subQuestions: [...subQuestions, newSubQ] });
  };

  const handleUpdateSubQuestion = (subId: string, updates: Partial<Question>) => {
    const updated = subQuestions.map((sq) =>
      sq.id === subId ? { ...sq, ...updates } : sq
    );
    onUpdate({ subQuestions: updated });
  };

  const handleDeleteSubQuestion = (subId: string) => {
    onUpdate({ subQuestions: subQuestions.filter((sq) => sq.id !== subId) });
  };

  const handleFormatChange = (newFormat: QuestionType) => {
    const updated = subQuestions.map((sq) => ({
      ...sq,
      type: newFormat,
      options: newFormat === "mcq" ? ["", "", "", ""] : sq.options,
      wordMeaningPairs:
        newFormat === "word_meaning"
          ? [{ id: uid(), word: sq.prompt || "", meaning: "" }]
          : sq.wordMeaningPairs,
    }));
    onUpdate({ collectionType: newFormat, subQuestions: updated });
  };

  const handleMarksChange = (newMarks: number) => {
    onUpdate({ marks: newMarks });
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Collection Header Configuration */}
      <div className="p-3 bg-yellow-50 dark:bg-zinc-800/80 rounded-xl border-2 border-black dark:border-white space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-black uppercase text-black dark:text-white">
              Collection Format & Setup
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl border-2 border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5">
            <Award size={15} className="text-yellow-600 dark:text-yellow-400 shrink-0" />
            <div className="flex flex-col leading-none">
              <label
                htmlFor={`collection-total-marks-${question.id}`}
                className="text-[10px] font-black uppercase text-emerald-900 dark:text-emerald-200"
              >
                Group Total Marks
              </label>
              <span className="text-[9px] text-emerald-700 dark:text-emerald-300 mt-1">
                Enter marks for the whole group
              </span>
            </div>
            <input
              id={`collection-total-marks-${question.id}`}
              aria-label="Group total marks"
              type="number"
              min={0.5}
              step={0.5}
              max={50}
              value={totalCollectionMarks}
              onChange={(e) => handleMarksChange(parseFloat(e.target.value) || 1)}
              className="w-16 h-8 px-1 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white rounded-lg text-emerald-700 dark:text-emerald-300 font-black text-sm text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="text-xs font-black text-emerald-900 dark:text-emerald-200">marks</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
              Collection Question Format (All items)
            </label>
            <NeoSelect
              options={formatSelectOptions}
              value={collectionFormat}
              onChange={(val) => handleFormatChange(val as QuestionType)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase text-zinc-600 dark:text-zinc-400">
              Collection Instructions / Subtitle
            </label>
            <input
              type="text"
              placeholder="e.g. Attempt any 4 questions."
              value={question.sectionSubtitle || ""}
              onChange={(e) => onUpdate({ sectionSubtitle: e.target.value })}
              className="w-full h-10 px-3 neo-input text-xs font-semibold bg-white dark:bg-zinc-900"
            />
          </div>
        </div>
      </div>

      {/* List of Sub-Questions inside Collection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-zinc-600 dark:text-zinc-400">
            Collection Questions ({subQuestions.length})
          </span>
          <button
            type="button"
            onClick={handleAddSubQuestion}
            className="neo-btn px-3 py-1 bg-yellow-400 text-black text-xs font-black uppercase flex items-center gap-1 shadow-neoSm"
          >
            <Plus size={13} />
            <span>+ Add Item</span>
          </button>
        </div>

        {subQuestions.length === 0 ? (
          <div className="p-6 text-center border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl bg-zinc-50 dark:bg-zinc-800/40">
            <p className="text-xs text-zinc-500 font-bold mb-2">
              No questions in this collection yet.
            </p>
            <button
              type="button"
              onClick={handleAddSubQuestion}
              className="neo-btn px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoSm"
            >
              + Add First Question to Collection
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {subQuestions.map((sq, sqIdx) => (
              <div
                key={sq.id}
                className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 space-y-2 relative group"
              >
                <div className="flex items-center justify-between gap-2 border-b border-zinc-300 dark:border-zinc-700 pb-1.5">
                  <span className="font-extrabold text-xs text-black dark:text-white">
                    ({String.fromCharCode(97 + sqIdx)}) Item #{sqIdx + 1}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteSubQuestion(sq.id)}
                    className="p-1 text-rose-500 hover:text-rose-700 rounded transition-colors"
                    title="Delete item from collection"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder={`Item ${sqIdx + 1} Prompt / Word...`}
                    value={sq.prompt}
                    onChange={(e) =>
                      handleUpdateSubQuestion(sq.id, { prompt: e.target.value })
                    }
                    className="w-full h-9 px-2.5 neo-input text-xs font-semibold bg-white dark:bg-zinc-900"
                  />

                  {/* Render format specific sub-inputs */}
                  {collectionFormat === "mcq" && (
                    <McqForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}

                  {collectionFormat === "word_meaning" && (
                    <WordMeaningForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}

                  {collectionFormat === "match" && (
                    <MatchFollowingForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}

                  {collectionFormat === "fill_blank" && (
                    <FillBlankForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}

                  {collectionFormat === "true_false" && (
                    <TrueFalseForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}

                  {(collectionFormat === "short" ||
                    collectionFormat === "long" ||
                    collectionFormat === "one_word") && (
                    <TextQuestionForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}

                  {(collectionFormat === "picture" ||
                    collectionFormat === "diagram") && (
                    <PictureQuestionForm
                      question={sq}
                      onUpdate={(up) => handleUpdateSubQuestion(sq.id, up)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {subQuestions.length > 0 && (
          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={handleAddSubQuestion}
              className="neo-btn px-4 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase flex items-center gap-1 shadow-neoSm"
            >
              <Plus size={13} />
              <span>+ Add Item to Collection</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
