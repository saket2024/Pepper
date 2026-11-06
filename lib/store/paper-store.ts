import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createDefaultPaper,
  createDefaultQuestion,
  createDefaultSection,
  createHindiSamplePaper,
  Paper,
  Question,
  QuestionType,
  Section,
  uid,
} from "../model/paper";
import { SchoolProfile } from "../model/school";

type PaperStore = {
  paper: Paper;
  step: number; // 0: School, 1: Exam Info, 2: Section Setup, 3: Section Questions, 4: Review
  currentSectionIndex: number; // For section-by-section filling in Step 3
  activeQuestionId: string | null;
  showAnswerKey: boolean;
  paperHistory: Paper[];

  // History & Storage
  saveToHistory: (targetPaper?: Paper) => void;
  deleteFromHistory: (paperId: string) => void;
  loadHistoryPaper: (paper: Paper) => void;
  clearHistory: () => void;

  stepValidationError: string | null;
  clearValidationError: () => void;

  // Navigation
  setStep: (step: number) => void;
  setCurrentSectionIndex: (index: number) => void;
  nextSectionOrStep: () => void;
  prevSectionOrStep: () => void;
  setActiveQuestionId: (id: string | null) => void;
  setShowAnswerKey: (show: boolean) => void;

  // School Selection
  applySchoolProfile: (school: SchoolProfile) => void;

  // Paper Details
  updatePaperDetails: (details: Partial<Paper>) => void;
  setSchoolLogo: (logo?: Paper["schoolLogo"]) => void;
  addInstruction: (text?: string) => void;
  updateInstruction: (index: number, text: string) => void;
  removeInstruction: (index: number) => void;

  // Sections
  addSection: (title?: string, questionType?: QuestionType) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  deleteSection: (sectionId: string) => void;
  reorderSections: (newSections: Section[]) => void;

  // Questions
  addQuestion: (sectionId: string, type: QuestionType, insertIndex?: number) => void;
  updateQuestion: (
    sectionId: string,
    questionId: string,
    updates: Partial<Question>
  ) => void;
  deleteQuestion: (sectionId: string, questionId: string) => void;
  duplicateQuestion: (sectionId: string, questionId: string) => void;
  reorderQuestions: (sectionId: string, newQuestions: Question[]) => void;

  // Presets & Actions
  loadSamplePaper: (preset: "english" | "hindi") => void;
  resetPaper: () => void;
  importPaperJSON: (json: string) => boolean;
};

export const validateStepNavigation = (
  paper: Paper,
  currentStep: number,
  targetStep: number
): { valid: boolean; error?: string } => {
  // Always allow moving backwards
  if (targetStep <= currentStep) {
    return { valid: true };
  }

  // Validate Step 0 -> Step 1+ (School Selection)
  if (currentStep <= 0 && targetStep > 0) {
    if (!paper.schoolName || !paper.schoolName.trim()) {
      return {
        valid: false,
        error: "Please select a school or enter a School Name before proceeding.",
      };
    }
  }

  // Validate Step 1 -> Step 2+ (Exam Details)
  if (currentStep <= 1 && targetStep > 1) {
    if (!paper.schoolName || !paper.schoolName.trim()) {
      return {
        valid: false,
        error: "Please select a school or enter a School Name before proceeding.",
      };
    }
    const hasExamName =
      (paper.examName && paper.examName.trim()) ||
      (paper.title && paper.title.trim());
    if (!hasExamName) {
      return {
        valid: false,
        error: "Please enter an Exam Name (e.g. Unit Test 2 / First Term Exam).",
      };
    }
    if (!paper.subject || !paper.subject.trim()) {
      return {
        valid: false,
        error: "Please enter the Subject (e.g. Hindi / Mathematics).",
      };
    }
    if (!paper.className || !paper.className.trim()) {
      return {
        valid: false,
        error: "Please enter the Class / Grade (e.g. Class 2 / 4th).",
      };
    }
  }

  // Validate Step 2 -> Step 3 (Questions Builder -> Review)
  if (currentStep <= 2 && targetStep > 2) {
    const questionsCount = (paper.sections || []).reduce(
      (acc, sec) => acc + (sec.questions ? sec.questions.length : 0),
      0
    );
    if (questionsCount === 0) {
      return {
        valid: false,
        error: "Please add at least 1 question before completing your paper.",
      };
    }
  }

  return { valid: true };
};

export const usePaperStore = create<PaperStore>()(
  persist(
    (set, get) => ({
      paper: createDefaultPaper(),
      step: 0,
      currentSectionIndex: 0,
      activeQuestionId: null,
      showAnswerKey: false,
      paperHistory: [],

      saveToHistory: (targetPaper) => {
        const p = targetPaper || get().paper;
        if (!p || !p.sections || p.sections.length === 0) return;
        const currentHistory = get().paperHistory || [];
        const existingIdx = currentHistory.findIndex((item) => item.id === p.id);
        const itemToSave = { ...p, updatedAt: new Date().toISOString() };
        let nextHistory = [...currentHistory];
        if (existingIdx >= 0) {
          nextHistory[existingIdx] = itemToSave;
        } else {
          nextHistory.unshift(itemToSave);
        }
        set({ paperHistory: nextHistory });
      },

      deleteFromHistory: (paperId) =>
        set((state) => ({
          paperHistory: (state.paperHistory || []).filter((p) => p.id !== paperId),
        })),

      loadHistoryPaper: (paperToLoad) => {
        set({
          paper: JSON.parse(JSON.stringify(paperToLoad)),
          step: 3,
          currentSectionIndex: 0,
          activeQuestionId: null,
        });
      },

      clearHistory: () => set({ paperHistory: [] }),

      stepValidationError: null as string | null,
      clearValidationError: () => set({ stepValidationError: null }),

      setStep: (targetStep) => {
        const { paper, step: currentStep } = get();
        const validation = validateStepNavigation(paper, currentStep, targetStep);
        if (!validation.valid) {
          set({ stepValidationError: validation.error || "Required information missing" });
          return;
        }
        set({ step: targetStep, stepValidationError: null });
      },
      setCurrentSectionIndex: (currentSectionIndex) => set({ currentSectionIndex }),

      nextSectionOrStep: () => {
        const { step } = get();
        get().setStep(Math.min(3, step + 1));
      },

      prevSectionOrStep: () => {
        const { step } = get();
        set({ step: Math.max(0, step - 1), stepValidationError: null });
      },

      setActiveQuestionId: (activeQuestionId) => set({ activeQuestionId }),
      setShowAnswerKey: (showAnswerKey) => set({ showAnswerKey }),

      // When selecting a school card: RESET all previous exam data, only keep school metadata!
      applySchoolProfile: (school) => {
        const { paper, paperHistory } = get();
        let updatedHistory = [...(paperHistory || [])];
        if (paper.sections && paper.sections.length > 0) {
          const existingIdx = updatedHistory.findIndex((p) => p.id === paper.id);
          if (existingIdx >= 0) {
            updatedHistory[existingIdx] = { ...paper, updatedAt: new Date().toISOString() };
          } else {
            updatedHistory.unshift({ ...paper, updatedAt: new Date().toISOString() });
          }
        }

        set({
          paperHistory: updatedHistory,
          paper: {
            id: uid(),
            title: "",
            schoolId: school.id,
            schoolName: school.name,
            schoolLogo: school.logo,
            board: school.board,
            className: school.defaultClassName || "",
            subject: "",
            examName: "",
            date: "",
            duration: "",
            maximumMarks: 0,
            instructions: [],
            sections: [],
            templateFormat: "a5",
            fontFamily: "Calibri",
            includeAnswerKey: false,
            updatedAt: new Date().toISOString(),
          },
          currentSectionIndex: 0,
          activeQuestionId: null,
        });
      },

      updatePaperDetails: (details) =>
        set((state) => ({
          paper: {
            ...state.paper,
            ...details,
            updatedAt: new Date().toISOString(),
          },
        })),

      setSchoolLogo: (logo) =>
        set((state) => ({
          paper: {
            ...state.paper,
            schoolLogo: logo,
            updatedAt: new Date().toISOString(),
          },
        })),

      addInstruction: (text = "") =>
        set((state) => ({
          paper: {
            ...state.paper,
            instructions: [...state.paper.instructions, text],
            updatedAt: new Date().toISOString(),
          },
        })),

      updateInstruction: (index, text) =>
        set((state) => {
          const next = [...state.paper.instructions];
          next[index] = text;
          return {
            paper: {
              ...state.paper,
              instructions: next,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      removeInstruction: (index) =>
        set((state) => ({
          paper: {
            ...state.paper,
            instructions: state.paper.instructions.filter((_, i) => i !== index),
            updatedAt: new Date().toISOString(),
          },
        })),

      addSection: (title, questionType = "mcq") =>
        set((state) => {
          const letter = String.fromCharCode(65 + state.paper.sections.length);
          const newSec = createDefaultSection(letter, title, questionType);
          return {
            paper: {
              ...state.paper,
              sections: [...state.paper.sections, newSec],
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      updateSection: (sectionId, updates) =>
        set((state) => ({
          paper: {
            ...state.paper,
            sections: state.paper.sections.map((sec) =>
              sec.id === sectionId ? { ...sec, ...updates } : sec
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteSection: (sectionId) =>
        set((state) => {
          const filtered = state.paper.sections.filter((s) => s.id !== sectionId);
          return {
            paper: {
              ...state.paper,
              sections: filtered,
              updatedAt: new Date().toISOString(),
            },
            currentSectionIndex: Math.max(0, state.currentSectionIndex - 1),
          };
        }),

      reorderSections: (newSections) =>
        set((state) => ({
          paper: {
            ...state.paper,
            sections: newSections,
            updatedAt: new Date().toISOString(),
          },
        })),

      addQuestion: (sectionId, type, insertIndex) =>
        set((state) => {
          const newQ = createDefaultQuestion(type);
          let sections = state.paper.sections || [];

          // If no sections exist yet, create default section with new question
          if (sections.length === 0) {
            const defaultSec = createDefaultSection("A", "Main Paper", "mcq");
            defaultSec.questions = [newQ];
            return {
              paper: {
                ...state.paper,
                sections: [defaultSec],
                updatedAt: new Date().toISOString(),
              },
              activeQuestionId: newQ.id,
            };
          }

          const targetSecId = sectionId || sections[0].id;
          let foundTarget = false;

          const updatedSections = sections.map((sec) => {
            if (sec.id === targetSecId || (!foundTarget && sections.length === 1)) {
              foundTarget = true;
              const newQuestions = [...sec.questions];
              if (typeof insertIndex === "number" && insertIndex >= 0) {
                newQuestions.splice(insertIndex + 1, 0, newQ);
              } else {
                newQuestions.push(newQ);
              }
              return {
                ...sec,
                questions: newQuestions,
              };
            }
            return sec;
          });

          // Fallback if target section ID wasn't found
          if (!foundTarget && updatedSections.length > 0) {
            const newQuestions = [...updatedSections[0].questions];
            if (typeof insertIndex === "number" && insertIndex >= 0) {
              newQuestions.splice(insertIndex + 1, 0, newQ);
            } else {
              newQuestions.push(newQ);
            }
            updatedSections[0] = {
              ...updatedSections[0],
              questions: newQuestions,
            };
          }

          return {
            paper: {
              ...state.paper,
              sections: updatedSections,
              updatedAt: new Date().toISOString(),
            },
            activeQuestionId: newQ.id,
          };
        }),

      updateQuestion: (sectionId, questionId, updates) =>
        set((state) => ({
          paper: {
            ...state.paper,
            sections: state.paper.sections.map((sec) => {
              if (sec.id === sectionId) {
                return {
                  ...sec,
                  questions: sec.questions.map((q) =>
                    q.id === questionId ? { ...q, ...updates } : q
                  ),
                };
              }
              return sec;
            }),
            updatedAt: new Date().toISOString(),
          },
        })),

      deleteQuestion: (sectionId, questionId) =>
        set((state) => ({
          paper: {
            ...state.paper,
            sections: state.paper.sections.map((sec) => {
              if (sec.id === sectionId) {
                return {
                  ...sec,
                  questions: sec.questions.filter((q) => q.id !== questionId),
                };
              }
              return sec;
            }),
            updatedAt: new Date().toISOString(),
          },
        })),

      duplicateQuestion: (sectionId, questionId) =>
        set((state) => {
          const updatedSections = state.paper.sections.map((sec) => {
            if (sec.id === sectionId) {
              const qIndex = sec.questions.findIndex((q) => q.id === questionId);
              if (qIndex === -1) return sec;
              const target = sec.questions[qIndex];
              const clone: Question = {
                ...JSON.parse(JSON.stringify(target)),
                id: uid(),
                prompt: `${target.prompt} (Copy)`,
              };
              const newQuestions = [...sec.questions];
              newQuestions.splice(qIndex + 1, 0, clone);
              return { ...sec, questions: newQuestions };
            }
            return sec;
          });
          return {
            paper: {
              ...state.paper,
              sections: updatedSections,
              updatedAt: new Date().toISOString(),
            },
          };
        }),

      reorderQuestions: (sectionId, newQuestions) =>
        set((state) => ({
          paper: {
            ...state.paper,
            sections: state.paper.sections.map((sec) =>
              sec.id === sectionId ? { ...sec, questions: newQuestions } : sec
            ),
            updatedAt: new Date().toISOString(),
          },
        })),

      loadSamplePaper: (preset) => {
        const sample = preset === "hindi" ? createHindiSamplePaper() : createDefaultPaper();
        set({
          paper: sample,
          step: 0,
          currentSectionIndex: 0,
        });
      },

      resetPaper: () => {
        const fresh = createDefaultPaper();
        set({
          paper: fresh,
          step: 0,
          currentSectionIndex: 0,
        });
      },

      importPaperJSON: (jsonString) => {
        try {
          const parsed = JSON.parse(jsonString);
          if (parsed && parsed.title && Array.isArray(parsed.sections)) {
            set({
              paper: { ...parsed, id: uid(), updatedAt: new Date().toISOString() },
              step: 0,
              currentSectionIndex: 0,
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },
    }),
    {
      name: "paperly-paper-draft",
      onRehydrateStorage: () => (state) => {
        if (state && state.paper && Array.isArray(state.paper.sections)) {
          state.paper.sections = state.paper.sections.map((sec) => {
            let cleanTitle = sec.title;
            if (sec.title.includes("Objective & MCQs")) cleanTitle = "Section A";
            if (sec.title.includes("Short Answer Questions")) cleanTitle = "Section B";

            let cleanInstructions = sec.instructions || "";
            if (sec.instructions === "Attempt all questions. Each question carries 1 mark.") cleanInstructions = "";
            if (sec.instructions === "Answer in 30–50 words each. Each question carries 2 marks.") cleanInstructions = "";

            return {
              ...sec,
              title: cleanTitle,
              instructions: cleanInstructions,
            };
          });
        }
      },
    }
  )
);
