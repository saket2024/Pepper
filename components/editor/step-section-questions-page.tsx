"use client";

import React, { useState } from "react";
import {
  Plus,
  Sparkles,
  Layers,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Heading,
  Award,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { usePaperStore } from "@/lib/store/paper-store";
import { Question, QuestionType, calculateTotalMarks, questionMeta } from "@/lib/model/paper";
import { QuestionCard } from "../questions/question-card";
import { QuestionTypePicker } from "../questions/question-type-picker";

function SortableQuestionNeoItem({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  question: Question;
  index: number;
  onUpdate: (updates: Partial<Question>) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50 scale-[1.01]" : ""}>
      <QuestionCard
        question={question}
        index={index}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDuplicate={onDuplicate}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function StepSectionQuestionsPage() {
  const {
    paper,
    setStep,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    duplicateQuestion,
    reorderQuestions,
  } = usePaperStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [insertIndexTarget, setInsertIndexTarget] = useState<number | undefined>(undefined);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Ensure primary section exists
  const primarySection = paper.sections[0] || {
    id: "default-sec",
    title: "Main Paper",
    questionType: "mcq",
    marksPerQuestion: 1,
    questions: [],
  };

  const questions = primarySection.questions || [];
  const currentMarksSum = calculateTotalMarks(paper);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      const newQs = arrayMove(questions, oldIndex, newIndex);
      reorderQuestions(primarySection.id, newQs);
    }
  };

  const handleOpenPickerForInsert = (insertIdx?: number) => {
    setInsertIndexTarget(insertIdx);
    setPickerOpen(true);
  };

  const handleSelectQuestionType = (type: QuestionType) => {
    addQuestion(primarySection.id, type, insertIndexTarget);
    setInsertIndexTarget(undefined);
  };

  const handleAddSectionHeading = (insertIdx?: number) => {
    addQuestion(primarySection.id, "section_header", insertIdx);
  };

  const handleAddCollection = (insertIdx?: number) => {
    addQuestion(primarySection.id, "collection", insertIdx);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-32">
      {/* Header & Top Navigation Bar */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-300 border-2 border-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles size={13} />
            Step 3 of 4 • Questions Builder
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-black dark:text-white uppercase tracking-tight">
            Add Questions & Headings
          </h1>

          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto font-medium">
            Set format per question directly on each card. Add Section Headings anywhere to divide your paper into sections.
          </p>
        </div>

        {/* Top Navigation Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2">
          <button
            onClick={() => setStep(1)}
            className="neo-btn w-full sm:w-auto justify-center px-4 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-[11px] sm:text-xs font-extrabold uppercase flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>← Back to Exam Info</span>
          </button>

          <button
            onClick={() => setStep(3)}
            className="neo-btn w-full sm:w-auto justify-center px-4 py-2.5 bg-yellow-400 text-black text-[11px] sm:text-xs font-black uppercase shadow-neoSm hover:scale-[1.02] flex items-center gap-1.5"
          >
            <span>Complete & Review Paper →</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* Main Toolbar Card */}
      <div className="neo-box p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border-2 border-black dark:border-white text-xs font-bold shadow-neoSm">
            <HelpCircle size={14} className="text-cyan-500" />
            <span>{questions.length} Items</span>
            <span>•</span>
            <Award size={14} className="text-yellow-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {currentMarksSum} / {paper.maximumMarks || 0} Marks
            </span>
          </div>
        </div>

        {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleOpenPickerForInsert()}
            className="neo-btn w-full justify-center px-5 py-2.5 bg-yellow-400 text-black text-xs font-black uppercase flex items-center gap-1.5 shadow-neoLg hover:scale-[1.02]"
          >
            <Plus size={16} />
            <span>+ Add Question</span>
          </button>
        </div>
      </div>

      {/* Questions & Section Headings List */}
      {questions.length === 0 ? (
        <div className="neo-box p-12 text-center space-y-4 bg-white dark:bg-zinc-900 border-2 border-dashed">
          <div className="w-16 h-16 rounded-2xl bg-yellow-300 text-black border-2 border-black mx-auto flex items-center justify-center font-black shadow-neoLg">
            <Plus size={32} />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-black text-black dark:text-white uppercase">
              No Questions Added Yet
            </h3>
            <p className="text-xs text-zinc-500 font-semibold max-w-md mx-auto">
              Click the <strong className="text-black dark:text-white underline">+ Add Question</strong> button below to choose any format (MCQs, Fill in Blanks, Word Meanings, Section Headings, Question Collections, etc.).
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => handleOpenPickerForInsert()}
              className="neo-btn w-full sm:w-auto justify-center px-5 py-3 bg-yellow-400 text-black text-sm font-black uppercase shadow-neoLg hover:scale-[1.02] flex items-center gap-2"
            >
              <Plus size={18} />
              <span>+ Add Question</span>
            </button>
          </div>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((q) => q.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <React.Fragment key={q.id}>
                  {/* Inline Insert Handle BEFORE each item */}
                  <div className="group relative py-0.5 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t-2 border-dashed border-zinc-300 dark:border-zinc-700 group-hover:border-yellow-400" />
                    </div>
                    <div className="relative opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex items-center gap-2 bg-white dark:bg-zinc-900 px-3 py-1 rounded-full border-2 border-black dark:border-white shadow-neoSm">
                  <button
                        type="button"
                        onClick={() => handleOpenPickerForInsert(idx)}
                        className="text-[11px] font-black uppercase text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Insert Question Here
                      </button>
                    </div>
                  </div>

                  {/* Question / Heading Card */}
                  <SortableQuestionNeoItem
                    question={q}
                    index={idx}
                    onUpdate={(updates) => updateQuestion(primarySection.id, q.id, updates)}
                    onDelete={() => deleteQuestion(primarySection.id, q.id)}
                    onDuplicate={() => duplicateQuestion(primarySection.id, q.id)}
                  />
                </React.Fragment>
              ))}

              {/* Final Bottom Insert Bar */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleOpenPickerForInsert()}
                    className="neo-btn w-full sm:w-auto justify-center px-6 py-3 bg-yellow-400 text-black text-xs font-black uppercase flex items-center gap-2 shadow-neoLg hover:scale-[1.02]"
                >
                  <Plus size={16} />
                  <span>+ Add Question</span>
                </button>
              </div>
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Question Type Picker Modal */}
      {pickerOpen && (
        <QuestionTypePicker
          onSelect={handleSelectQuestionType}
          onClose={() => {
            setPickerOpen(false);
            setInsertIndexTarget(undefined);
          }}
        />
      )}

      {/* Bottom Navigation */}
      <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:items-center sm:justify-between pt-6 border-t-2 border-black dark:border-white">
        <button
          onClick={() => setStep(1)}
          className="neo-btn w-full sm:w-auto justify-center px-4 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-[11px] sm:text-xs font-extrabold uppercase flex items-center gap-1"
        >
          <ArrowLeft size={14} />
          <span>← Back to Exam Info</span>
        </button>

        <button
          onClick={() => setStep(3)}
          className="neo-btn w-full sm:w-auto justify-center px-5 py-3 bg-yellow-400 text-black text-sm font-black uppercase shadow-neoLg flex items-center gap-2 hover:scale-[1.02]"
        >
          <span>Complete & Review Paper →</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
