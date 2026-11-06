"use client";

import React, { useRef } from "react";
import {
  School,
  BookOpen,
  Calendar,
  Clock,
  Award,
  Upload,
  Trash2,
  Plus,
  Info,
  Sparkles,
  FileText,
} from "lucide-react";
import { usePaperStore } from "@/lib/store/paper-store";
import { ImageAsset } from "@/lib/model/paper";

export function StepDetails() {
  const {
    paper,
    updatePaperDetails,
    setSchoolLogo,
    addInstruction,
    updateInstruction,
    removeInstruction,
  } = usePaperStore();

  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const logoAsset: ImageAsset = {
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          dataUrl,
        };
        setSchoolLogo(logoAsset);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in-up pb-24">
      {/* Header section */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-widest">
          <Sparkles size={12} />
          Step 1 of 4
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          School & Exam Details
        </h1>
        <p className="text-zinc-400 text-sm max-w-xl mx-auto">
          Set up your institution metadata, exam title, duration, and general
          instructions for students.
        </p>
      </div>

      {/* Main Glass Card Form Container (2.5rem / 40px radius as per spec!) */}
      <div className="rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 sm:p-10 space-y-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {/* School Name & Logo Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Logo Uploader */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest block">
              School Logo (Optional)
            </label>
            {paper.schoolLogo ? (
              <div className="relative group rounded-2xl bg-zinc-900/80 border border-white/10 p-4 flex flex-col items-center justify-center gap-2">
                <img
                  src={paper.schoolLogo.dataUrl}
                  alt="School Logo"
                  className="max-h-24 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setSchoolLogo(undefined)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-all"
                  title="Remove Logo"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="w-full h-32 rounded-2xl bg-zinc-900/50 hover:bg-zinc-900/80 border border-dashed border-white/15 hover:border-emerald-500/40 text-zinc-400 hover:text-zinc-200 transition-all flex flex-col items-center justify-center gap-2 p-4 text-center group"
              >
                <div className="w-10 h-10 rounded-full bg-white/[0.05] group-hover:bg-emerald-500/20 text-zinc-400 group-hover:text-emerald-400 flex items-center justify-center transition-all">
                  <Upload size={18} />
                </div>
                <span className="text-xs font-medium">Upload Logo (PNG / JPG)</span>
              </button>
            )}
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </div>

          {/* School Name & Board */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <School size={13} className="text-emerald-400" />
                School / Institution Name *
              </label>
              <input
                type="text"
                placeholder="e.g. St. Xavier's Senior Secondary School"
                value={paper.schoolName}
                onChange={(e) => updatePaperDetails({ schoolName: e.target.value })}
                className="w-full h-12 px-4 rounded-2xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/60 text-sm transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Board / Affiliation
                </label>
                <input
                  type="text"
                  placeholder="e.g. CBSE, ICSE, State Board"
                  value={paper.board}
                  onChange={(e) => updatePaperDetails({ board: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  Class / Grade *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Class X (10th)"
                  value={paper.className}
                  onChange={(e) => updatePaperDetails({ className: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* Exam Title, Subject, Date, Duration, Max Marks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <FileText size={13} className="text-emerald-400" />
              Exam Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Mid-Term Examination 2026"
              value={paper.examName}
              onChange={(e) => updatePaperDetails({ examName: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen size={13} className="text-emerald-400" />
              Subject *
            </label>
            <input
              type="text"
              placeholder="e.g. Science / Mathematics / हिंदी"
              value={paper.subject}
              onChange={(e) => updatePaperDetails({ subject: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={13} className="text-emerald-400" />
              Date
            </label>
            <input
              type="text"
              placeholder="e.g. 15-09-2026"
              value={paper.date}
              onChange={(e) => updatePaperDetails({ date: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock size={13} className="text-emerald-400" />
              Time Duration *
            </label>
            <input
              type="text"
              placeholder="e.g. 3 Hours or 90 Minutes"
              value={paper.duration}
              onChange={(e) => updatePaperDetails({ duration: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Award size={13} className="text-emerald-400" />
              Maximum Marks *
            </label>
            <input
              type="number"
              placeholder="e.g. 80"
              value={paper.maximumMarks}
              onChange={(e) =>
                updatePaperDetails({ maximumMarks: Number(e.target.value) || 0 })
              }
              className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-400/60 text-sm transition-all font-semibold text-emerald-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
              Paper Format (DOCX Page Size)
            </label>
            <select
              value={paper.templateFormat}
              onChange={(e) =>
                updatePaperDetails({
                  templateFormat: e.target.value as any,
                })
              }
              className="w-full h-11 px-4 rounded-xl bg-zinc-900/90 border border-white/10 text-white focus:outline-none focus:border-emerald-400/60 text-sm transition-all"
            >
              <option value="a5">A5 Portrait (Reference Exam Format)</option>
              <option value="a4">A4 Standard Format</option>
              <option value="a3">A3 Booklet Format</option>
            </select>
          </div>
        </div>

        <hr className="border-white/10" />

        {/* General Instructions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <Info size={13} className="text-emerald-400" />
              General Instructions for Students
            </label>
            <button
              type="button"
              onClick={() => addInstruction("")}
              className="px-3 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 text-xs font-medium transition-all flex items-center gap-1.5"
            >
              <Plus size={13} />
              Add Instruction
            </button>
          </div>

          <div className="space-y-2.5">
            {paper.instructions.map((inst, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/[0.05] text-zinc-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  value={inst}
                  placeholder={`Instruction ${idx + 1}`}
                  onChange={(e) => updateInstruction(idx, e.target.value)}
                  className="flex-1 h-10 px-3 rounded-xl bg-zinc-900/80 border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-400/60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => removeInstruction(idx)}
                  className="p-2 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 transition-all shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
