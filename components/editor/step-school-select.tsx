"use client";

import React, { useState, useRef } from "react";
import {
  School,
  Plus,
  Check,
  Upload,
  Download,
  Trash2,
  Sparkles,
  Building2,
  FileSpreadsheet,
  RotateCcw,
  History,
  FileText,
  Calendar,
  Award,
  BookOpen,
  Eye,
  FileDown,
} from "lucide-react";
import { useSchoolStore } from "@/lib/store/school-store";
import { usePaperStore } from "@/lib/store/paper-store";
import { ImageAsset, calculateTotalMarks, calculateTotalQuestions } from "@/lib/model/paper";
import { downloadPaperDocx } from "@/lib/docx/generate-paper-docx";

export function StepSchoolSelect() {
  const { schools, selectedSchoolId, selectSchool, addSchool, deleteSchool } =
    useSchoolStore();
  const {
    paper,
    applySchoolProfile,
    setStep,
    loadSamplePaper,
    resetPaper,
    importPaperJSON,
    paperHistory,
    loadHistoryPaper,
    deleteFromHistory,
    clearHistory,
  } = usePaperStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");
  const [newBoard, setNewBoard] = useState("CBSE");
  const [newClass, setNewClass] = useState("Class X");
  const [newLogo, setNewLogo] = useState<ImageAsset | undefined>(undefined);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const backupInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setNewLogo({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          type: file.type,
          dataUrl,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importPaperJSON(content);
        if (success) {
          alert("Paper loaded successfully!");
        } else {
          alert("Invalid paper backup file.");
        }
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSchool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSchoolName.trim()) return;

    const created = addSchool({
      name: newSchoolName.trim(),
      board: newBoard.trim() || "CBSE",
      defaultClassName: newClass.trim() || "Class X",
      logo: newLogo,
    });

    // Reset previous exam data on school selection!
    applySchoolProfile(created);
    setShowAddForm(false);
    setNewSchoolName("");
    setNewLogo(undefined);
  };

  const handleSelectSchool = (school: any) => {
    selectSchool(school.id);
    // Reset previous exam data on school selection!
    applySchoolProfile(school);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in-up pb-32 flex flex-col">
      {/* Header & Top Navigation Bar */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 border-2 border-black font-extrabold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
            <Sparkles size={13} />
            Step 1 of 5
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-black dark:text-white uppercase tracking-tight">
            Select School Profile
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-xl mx-auto font-medium">
            Choose a saved school or add a new school profile. Saved schools are remembered
            for all future exam papers.
          </p>
        </div>

        {/* Top Navigation Control Bar */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs font-black uppercase text-zinc-500">
            Current: <span className="text-black dark:text-white">{paper.schoolName || "No School Selected"}</span>
          </div>

          <button
            onClick={() => setStep(1)}
            className="neo-btn px-6 py-2.5 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoSm hover:scale-[1.02]"
          >
            Continue to Exam Info →
          </button>
        </div>
      </div>

      {/* Preset & Action Bar */}
      <div className="order-last neo-box p-4 bg-zinc-50 dark:bg-zinc-900 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-black uppercase tracking-wider text-black dark:text-white flex items-center gap-1.5">
          <Sparkles size={14} className="text-yellow-500" />
          Quick Sample Exam Papers:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/Master_Exam_Paper_Template.docx"
            download="Master_Exam_Paper_Template.docx"
            className="neo-btn px-3 py-1.5 bg-yellow-400 text-black text-xs font-black uppercase flex items-center gap-1.5 shadow-neoSm"
          >
            <Download size={13} />
            <span>Download Master .docx Template</span>
          </a>

          <button
            onClick={() => loadSamplePaper("english")}
            className="neo-btn px-3 py-1.5 bg-cyan-300 text-black text-xs font-extrabold flex items-center gap-1"
          >
            <FileSpreadsheet size={13} />
            <span>Sample CBSE Paper</span>
          </button>

          <button
            onClick={() => loadSamplePaper("hindi")}
            className="neo-btn px-3 py-1.5 bg-pink-300 text-black text-xs font-extrabold flex items-center gap-1"
          >
            <FileSpreadsheet size={13} />
            <span>नमूना प्रश्न पत्र (Hindi)</span>
          </button>

          <button
            onClick={() => backupInputRef.current?.click()}
            className="neo-btn px-3 py-1.5 bg-emerald-300 text-black text-xs font-extrabold flex items-center gap-1"
          >
            <Upload size={13} />
            <span>Open Saved Exam File</span>
          </button>
          <input
            ref={backupInputRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />

          <button
            onClick={resetPaper}
            className="neo-btn px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-extrabold flex items-center gap-1"
          >
            <RotateCcw size={13} />
            <span>Blank Paper</span>
          </button>
        </div>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {schools.map((school) => {
          const isSelected = selectedSchoolId === school.id;

          return (
            <div
              key={school.id}
              onClick={() => handleSelectSchool(school)}
              className={`neo-box-lg p-6 cursor-pointer transition-all relative flex flex-col justify-between group ${
                isSelected
                  ? "bg-yellow-300 text-black shadow-neoLg border-black"
                  : "bg-white dark:bg-zinc-900 text-black dark:text-white hover:bg-yellow-50 dark:hover:bg-zinc-800"
              }`}
            >
              {isSelected && (
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-black text-yellow-300 border-2 border-black flex items-center justify-center font-black shadow-neoSm">
                  <Check size={16} />
                </div>
              )}

              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-300 border-2 border-black flex items-center justify-center font-black shadow-neoSm overflow-hidden shrink-0">
                  {school.logo ? (
                    <img
                      src={school.logo.dataUrl}
                      alt={school.name}
                      className="w-full h-full object-contain p-1"
                    />
                  ) : (
                    <Building2 size={24} className="text-black" />
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-black leading-tight line-clamp-2">
                    {school.name}
                  </h3>
                  <p className="text-xs font-semibold opacity-80 mt-1">
                    {school.board} • {school.defaultClassName || "Class X"}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t-2 border-black/20 dark:border-white/20 flex items-center justify-between">
                <span className="text-xs font-black uppercase">
                  {isSelected ? "Selected School" : "Click to Use"}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${school.name} profile?`)) {
                      deleteSchool(school.id);
                    }
                  }}
                  className="neo-btn p-1.5 bg-rose-200 text-black hover:bg-rose-400 text-xs"
                  title="Delete School Profile"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Add New School Card */}
        <button
          onClick={() => setShowAddForm(true)}
          className="neo-box-lg p-6 border-dashed border-4 border-black dark:border-white flex flex-col items-center justify-center gap-3 text-center bg-white/50 dark:bg-zinc-900/50 hover:bg-yellow-100 dark:hover:bg-zinc-800 transition-all min-h-[200px]"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-300 border-2 border-black flex items-center justify-center font-black shadow-neoSm">
            <Plus size={24} className="text-black" />
          </div>
          <div>
            <h3 className="text-base font-black text-black dark:text-white uppercase">
              Add New School Profile
            </h3>
            <p className="text-xs font-semibold text-zinc-500 mt-0.5">
              Save once, use for any exam
            </p>
          </div>
        </button>
      </div>

      {/* Add School Modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in-up">
          <div className="w-full max-w-lg neo-box-lg bg-white dark:bg-zinc-900 p-6 space-y-6 shadow-neoLg">
            <div className="flex items-center justify-between border-b-2 border-black dark:border-white pb-3">
              <h2 className="text-xl font-black text-black dark:text-white uppercase">
                Add School Profile
              </h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="neo-btn px-2.5 py-1 bg-rose-300 text-black text-xs font-black"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleCreateSchool} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black dark:text-white">
                  School Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. St. Xavier's Senior Secondary School"
                  value={newSchoolName}
                  onChange={(e) => setNewSchoolName(e.target.value)}
                  className="w-full h-11 px-3.5 neo-input text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-black dark:text-white">
                    Board / Affiliation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CBSE, ICSE"
                    value={newBoard}
                    onChange={(e) => setNewBoard(e.target.value)}
                    className="w-full h-10 px-3 neo-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black uppercase text-black dark:text-white">
                    Default Class
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Class X"
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full h-10 px-3 neo-input text-xs"
                  />
                </div>
              </div>

              {/* Logo Uploader */}
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-black dark:text-white">
                  School Logo (Optional)
                </label>
                {newLogo ? (
                  <div className="flex items-center justify-between p-3 neo-box bg-zinc-100 dark:bg-zinc-800">
                    <img
                      src={newLogo.dataUrl}
                      alt="Logo"
                      className="max-h-10 object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setNewLogo(undefined)}
                      className="neo-btn p-1 bg-rose-400 text-black text-xs"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="w-full py-4 neo-box border-dashed flex flex-col items-center justify-center gap-1 bg-zinc-50 dark:bg-zinc-950 text-xs font-bold"
                  >
                    <Upload size={16} />
                    <span>Upload School Logo Image</span>
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-black dark:border-white">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="neo-btn px-4 py-2 bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white text-xs font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="neo-btn px-5 py-2 bg-yellow-400 text-black text-xs font-black uppercase shadow-neoSm"
                >
                  Save School & Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* HISTORY SECTION: PAST GENERATED EXAM PAPERS              */}
      {/* ======================================================== */}
      <div className="space-y-4 pt-6 border-t-4 border-black dark:border-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-pink-400 text-black border-2 border-black flex items-center justify-center font-black shadow-neoSm">
              <History size={20} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black dark:text-white uppercase tracking-tight">
                Past Generated Exam Papers (History)
              </h2>
              <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                All previously created & downloaded exam papers across all schools
              </p>
            </div>
          </div>

          {paperHistory && paperHistory.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all paper history?")) {
                  clearHistory();
                }
              }}
              className="neo-btn px-3 py-1.5 bg-rose-300 text-black text-xs font-bold flex items-center gap-1"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {!paperHistory || paperHistory.length === 0 ? (
          <div className="neo-box p-8 text-center space-y-2 bg-zinc-50 dark:bg-zinc-900 border-2 border-dashed">
            <FileText size={32} className="mx-auto text-zinc-400" />
            <h3 className="text-base font-black text-black dark:text-white uppercase">
              No Past Exam Papers Yet
            </h3>
            <p className="text-xs text-zinc-500 font-medium max-w-sm mx-auto">
              Select a school above to create your first exam paper. Every generated paper is automatically saved here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paperHistory.map((histPaper) => {
              const totM = calculateTotalMarks(histPaper);
              const totQ = calculateTotalQuestions(histPaper);
              const dateStr = histPaper.date || new Date(histPaper.updatedAt).toLocaleDateString();

              return (
                <div
                  key={histPaper.id}
                  className="neo-box p-5 bg-white dark:bg-zinc-900 space-y-3 flex flex-col justify-between hover:bg-yellow-50 dark:hover:bg-zinc-800 transition-all border-2 border-black dark:border-white shadow-neoSm"
                >
                  <div className="space-y-2">
                    {/* Header line: School name & date */}
                    <div className="flex items-start justify-between gap-2 border-b border-black/20 dark:border-white/20 pb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {histPaper.schoolLogo ? (
                          <img
                            src={histPaper.schoolLogo.dataUrl}
                            alt=""
                            className="w-6 h-6 object-contain rounded"
                          />
                        ) : (
                          <Building2 size={16} className="text-yellow-600 shrink-0" />
                        )}
                        <span className="text-xs font-extrabold uppercase text-black dark:text-white truncate">
                          {histPaper.schoolName || "School"}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white shrink-0">
                        {dateStr}
                      </span>
                    </div>

                    {/* Subject & Exam Title */}
                    <div>
                      <h4 className="text-sm font-black text-black dark:text-white leading-snug uppercase line-clamp-1">
                        {histPaper.subject || histPaper.examName || "Untitled Exam Paper"}
                      </h4>
                      <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
                        {[histPaper.examName, histPaper.className, histPaper.board]
                          .filter(Boolean)
                          .join(" • ")}
                      </p>
                    </div>

                    {/* Quick Stats Pill */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-[11px] font-black px-2 py-0.5 rounded bg-yellow-300 text-black border border-black">
                        {totM} Marks
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-200 text-black border border-black">
                        {histPaper.sections?.length || 0} Secs ({totQ} Qs)
                      </span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-black/20 dark:border-white/20 flex items-center justify-between gap-2">
                    <button
                      onClick={() => loadHistoryPaper(histPaper)}
                      className="flex-1 neo-btn py-1.5 px-3 bg-yellow-400 text-black text-xs font-black uppercase flex items-center justify-center gap-1 shadow-neoSm hover:scale-[1.02]"
                    >
                      <Eye size={13} />
                      <span>Open Paper</span>
                    </button>

                    <button
                      onClick={() => downloadPaperDocx(histPaper, histPaper.includeAnswerKey)}
                      className="neo-btn p-1.5 bg-emerald-300 text-black text-xs font-black"
                      title="Direct Download .docx"
                    >
                      <FileDown size={14} />
                    </button>

                    <button
                      onClick={() => deleteFromHistory(histPaper.id)}
                      className="neo-btn p-1.5 bg-rose-300 text-black text-xs"
                      title="Delete from History"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => setStep(1)}
          className="neo-btn px-8 py-3 bg-yellow-400 text-black text-sm font-black uppercase shadow-neoLg hover:scale-[1.02]"
        >
          Continue to Exam Info →
        </button>
      </div>
    </div>
  );
}
