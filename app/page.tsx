"use client";

import React, { useEffect } from "react";
import { BottomNavHub } from "@/components/navigation/bottom-nav-hub";
import { StepSchoolSelect } from "@/components/editor/step-school-select";
import { StepExamInfo } from "@/components/editor/step-exam-info";
import { StepSectionsSetup } from "@/components/editor/step-sections-setup";
import { StepSectionQuestionsPage } from "@/components/editor/step-section-questions-page";
import { StepPreview } from "@/components/editor/step-preview";
import { usePaperStore } from "@/lib/store/paper-store";

export default function PaperlyPage() {
  const { step } = usePaperStore();

  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f4f0] dark:bg-[#0c0c0e] text-black dark:text-white font-sans selection:bg-yellow-400 selection:text-black relative transition-colors duration-200">
      {/* Main Content Workspace Container */}
      <main className="relative z-10 pt-8 pb-36 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[calc(100vh-140px)] flex flex-col justify-center">
        {step === 0 && <StepSchoolSelect />}
        {step === 1 && <StepExamInfo />}
        {step === 2 && <StepSectionQuestionsPage />}
        {step === 3 && <StepPreview />}
      </main>

      {/* Main Control Hub Navigation Bar */}
      <BottomNavHub />
    </div>
  );
}
