"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Layers,
  Sparkles,
  Award,
  HelpCircle,
  CheckSquare,
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
import { Section, QuestionType, questionMeta, calculateTotalMarks } from "@/lib/model/paper";
import { QuestionTypePicker } from "../questions/question-type-picker";
import { NeoSelect, SelectOption } from "@/components/ui/neo-select";

function SortableSectionNeoCard({
  section,
  index,
  onUpdate,
  onDelete,
}: {
  section: Section;
  index: number;
  onUpdate: (updates: Partial<Section>) => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
  };

  const sectionMarks =
    Math.round(
      section.questions.reduce(
        (sum, q) => sum + (Number(q.marks) || 0),
        0
      ) * 100
    ) / 100;

  const types = Object.keys(questionMeta) as QuestionType[];
  const selectOptions: SelectOption[] = types.map((t) => ({
    value: t,
    label: questionMeta[t].label,
    sublabel: `${questionMeta[t].defaultMarks}m`,
  }));

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`neo-box p-3 sm:p-4 ${
        isDragging ? "opacity-60 scale-[1.02] bg-yellow-100" : ""
      }`}
    >
      <div className="flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3 w-full">
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="neo-btn p-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-white cursor-grab active:cursor-grabbing shrink-0"
          title="Drag to reorder section"
        >
          <GripVertical size={16} />
        </button>

        {/* Section Title Input */}
        <input
          type="text"
          value={section.title}
          placeholder={`Section ${String.fromCharCode(65 + index)} Title`}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="h-10 px-3 neo-input text-xs sm:text-sm font-extrabold w-44 sm:w-56 shrink-0"
        />

        {/* Question Format Selector */}
        <div className="w-48 sm:w-56 shrink-0">
          <NeoSelect
            options={selectOptions}
            value={section.questionType || "mcq"}
            onChange={(val) => {
              const newType = val as QuestionType;
              onUpdate({
                questionType: newType,
                questions: section.questions.map((q) => ({
                  ...q,
                  type: newType,
                })),
              });
            }}
          />
        </div>

        {/* Section Subtitle / Instructions Input */}
        <input
          type="text"
          value={section.instructions || ""}
          placeholder="Subtitle / Instructions (e.g. Attempt all questions)"
          onChange={(e) => onUpdate({ instructions: e.target.value })}
          className="h-10 px-3 neo-input text-xs flex-1 min-w-[160px]"
        />

        {/* COMBINED SINGLE PILL: [ Letter Badge (A) | xQs • 0m Stats | Delete Button ] */}
        <div className="flex items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 border-2 border-black dark:border-white p-0.5 overflow-hidden shrink-0 shadow-neoSm">
          {/* Section Letter Badge */}
          <span className="w-8 h-8 rounded-lg bg-yellow-400 text-black border border-black font-black text-xs flex items-center justify-center shrink-0">
            {String.fromCharCode(65 + index)}
          </span>

          {/* Stats Info */}
          <div className="flex items-center gap-1.5 px-2.5 text-xs font-bold text-black dark:text-white">
            <HelpCircle size={13} className="text-cyan-500" />
            <span>{section.questions.length} Qs</span>
            <span className="opacity-40">•</span>
            <Award size={13} className="text-yellow-500" />
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {sectionMarks}m
            </span>
          </div>

          {/* Delete Action */}
          <button
            type="button"
            onClick={onDelete}
            className="w-8 h-8 rounded-lg bg-rose-300 hover:bg-rose-400 text-black border border-black flex items-center justify-center shrink-0 transition-all"
            title="Delete Section"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function StepSectionsSetup() {
  const { paper, addSection, updateSection, deleteSection, reorderSections, setStep } =
    usePaperStore();

  const [pickerOpen, setPickerOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = paper.sections.findIndex((s) => s.id === active.id);
      const newIndex = paper.sections.findIndex((s) => s.id === over.id);
      reorderSections(arrayMove(paper.sections, oldIndex, newIndex));
    }
  };

  const handleAddSectionWithType = (type: QuestionType) => {
    const letter = String.fromCharCode(65 + paper.sections.length);
    const label = questionMeta[type].label;
    addSection(`Section ${letter} (${label})`, type);
  };

  const totalAllocatedMarks = calculateTotalMarks(paper);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-32">
      {/* Header & Top Navigation Bar */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-300 border-2 border-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles size={13} />
            Step 3 of 5
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black dark:text-white uppercase tracking-tight">
            Define Exam Sections
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto font-medium">
            Each section is dedicated to <strong className="text-black dark:text-white underline">one question format</strong> (e.g. Section A = MCQs, Section B = Short Answers).
          </p>
        </div>

        {/* Top Navigation Row */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setStep(1)}
            className="neo-btn px-6 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-extrabold uppercase"
          >
            ← Exam Info
          </button>

          <button
            onClick={() => setStep(3)}
            className="neo-btn px-6 py-2.5 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoSm hover:scale-[1.02]"
          >
            Start Filling Questions →
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="neo-box p-5 flex flex-wrap items-center justify-between gap-4 bg-yellow-300 text-black border-2 shadow-neoLg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black text-yellow-300 flex items-center justify-center font-black shadow-neoSm">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xs font-black uppercase">
              Total Sections: {paper.sections.length}
            </div>
            <div className="text-sm font-extrabold">
              Target Max Marks: {paper.maximumMarks} Marks
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right font-extrabold text-xs">
            <div>Current Marks Sum:</div>
            <div
              className={`text-base font-black ${
                totalAllocatedMarks === paper.maximumMarks
                  ? "text-emerald-800"
                  : "text-rose-800"
              }`}
            >
              {totalAllocatedMarks} / {paper.maximumMarks} Marks
            </div>
          </div>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="neo-btn px-4 py-2.5 bg-black text-white text-xs font-black uppercase shadow-[3px_3px_0px_0px_#fff]"
          >
            + Add Section
          </button>
        </div>
      </div>

      {/* Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={paper.sections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {paper.sections.map((sec, idx) => (
              <SortableSectionNeoCard
                key={sec.id}
                section={sec}
                index={idx}
                onUpdate={(updates) => updateSection(sec.id, updates)}
                onDelete={() => deleteSection(sec.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {paper.sections.length === 0 && (
        <div className="text-center py-12 neo-box border-dashed">
          <p className="text-zinc-500 font-bold text-sm">No sections defined yet.</p>
          <button
            onClick={() => setPickerOpen(true)}
            className="mt-3 neo-btn px-4 py-2 bg-yellow-400 text-black text-xs font-black"
          >
            Create Section A
          </button>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex justify-between pt-4">
        <button
          onClick={() => setStep(1)}
          className="neo-btn px-6 py-2.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-extrabold uppercase"
        >
          ← Exam Info
        </button>

        <button
          onClick={() => setStep(3)}
          className="neo-btn px-8 py-3 bg-yellow-400 text-black text-sm font-black uppercase shadow-neoLg hover:scale-[1.02]"
        >
          Start Filling Questions →
        </button>
      </div>

      {/* Custom Modal for Selecting Question Type when creating a New Section */}
      {pickerOpen && (
        <QuestionTypePicker
          onSelect={handleAddSectionWithType}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
