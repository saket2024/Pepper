"use client";

import React from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Layers,
  Sparkles,
  HelpCircle,
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
import { Section, calculateTotalMarks } from "@/lib/model/paper";

function SortableSectionCard({
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

  const sectionMarks = section.questions.reduce(
    (sum, q) => sum + (Number(q.marks) || 0),
    0
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 p-5 sm:p-6 space-y-4 transition-all ${
        isDragging ? "opacity-60 scale-[1.02] border-emerald-400/50 shadow-2xl" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Drag handle */}
          <button
            type="button"
            {...attributes}
            {...listeners}
            className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-zinc-400 hover:text-white cursor-grab active:cursor-grabbing transition-all"
            title="Drag to reorder section"
          >
            <GripVertical size={16} />
          </button>

          <span className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center">
            {String.fromCharCode(65 + index)}
          </span>

          <input
            type="text"
            value={section.title}
            placeholder={`Section ${String.fromCharCode(65 + index)} Title`}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="h-10 px-3 rounded-xl bg-zinc-900/90 border border-white/10 text-white font-bold text-base focus:outline-none focus:border-emerald-400/60 transition-all w-full max-w-sm"
          />
        </div>

        {/* Section Stats & Delete */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/5 text-xs text-zinc-400">
            <HelpCircle size={13} className="text-zinc-500" />
            <span>{section.questions.length} questions</span>
            <span className="text-zinc-600">•</span>
            <Award size={13} className="text-emerald-400" />
            <span className="text-emerald-400 font-bold">{sectionMarks} Marks</span>
          </div>

          <button
            type="button"
            onClick={onDelete}
            className="p-2.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-all"
            title="Delete Section"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Section Subtitle / Instructions */}
      <div className="space-y-1.5 pt-2">
        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
          Section Subtitle / Instructions (Optional)
        </label>
        <input
          type="text"
          value={section.instructions || ""}
          placeholder="e.g. Attempt any 5 questions. Each question carries 2 marks."
          onChange={(e) => onUpdate({ instructions: e.target.value })}
          className="w-full h-10 px-3.5 rounded-xl bg-zinc-900/70 border border-white/10 text-zinc-200 text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 transition-all"
        />
      </div>
    </div>
  );
}

export function StepSections() {
  const { paper, addSection, updateSection, deleteSection, reorderSections } =
    usePaperStore();

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

  const totalAllocatedMarks = calculateTotalMarks(paper);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-24">
      {/* Header section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles size={12} />
          Step 2 of 4
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Exam Sections & Structure
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Organize your question paper into clear sections (e.g. Section A, Section B). Reorder them using drag-and-drop.
        </p>
      </div>

      {/* Marks Summary Card */}
      <div className="rounded-3xl bg-zinc-900/90 border border-white/10 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Layers size={20} />
          </div>
          <div>
            <div className="text-xs text-zinc-400 uppercase tracking-widest font-bold">
              Total Sections: {paper.sections.length}
            </div>
            <div className="text-sm font-semibold text-white">
              Target Maximum Marks: {paper.maximumMarks} Marks
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs text-zinc-400">Current Question Marks Sum</div>
            <div
              className={`text-lg font-bold ${
                totalAllocatedMarks === paper.maximumMarks
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {totalAllocatedMarks} / {paper.maximumMarks} Marks
            </div>
          </div>

          <button
            type="button"
            onClick={() => addSection()}
            className="px-4 py-2.5 rounded-full bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-bold text-xs transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:scale-[1.03]"
          >
            <Plus size={15} />
            Add New Section
          </button>
        </div>
      </div>

      {/* Drag & Drop Section List */}
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
              <SortableSectionCard
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
        <div className="text-center py-12 rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
          <p className="text-zinc-400 text-sm">No sections created yet.</p>
          <button
            onClick={() => addSection()}
            className="mt-3 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
          >
            Create Section A
          </button>
        </div>
      )}
    </div>
  );
}
