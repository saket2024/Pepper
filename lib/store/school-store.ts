import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SchoolProfile, uid } from "../model/school";

type SchoolStore = {
  schools: SchoolProfile[];
  selectedSchoolId: string | null;
  addSchool: (school: Omit<SchoolProfile, "id" | "createdAt">) => SchoolProfile;
  updateSchool: (id: string, updates: Partial<SchoolProfile>) => void;
  deleteSchool: (id: string) => void;
  selectSchool: (id: string | null) => void;
  getSchool: (id?: string | null) => SchoolProfile | undefined;
};

export const useSchoolStore = create<SchoolStore>()(
  persist(
    (set, get) => ({
      schools: [],
      selectedSchoolId: null,

      addSchool: (schoolData) => {
        const newSchool: SchoolProfile = {
          ...schoolData,
          id: uid(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          schools: [...state.schools, newSchool],
          selectedSchoolId: newSchool.id,
        }));
        return newSchool;
      },

      updateSchool: (id, updates) =>
        set((state) => ({
          schools: state.schools.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteSchool: (id) =>
        set((state) => {
          const next = state.schools.filter((s) => s.id !== id);
          return {
            schools: next,
            selectedSchoolId:
              state.selectedSchoolId === id
                ? next[0]?.id || null
                : state.selectedSchoolId,
          };
        }),

      selectSchool: (selectedSchoolId) => set({ selectedSchoolId }),

      getSchool: (id) => {
        const targetId = id || get().selectedSchoolId;
        return get().schools.find((s) => s.id === targetId);
      },
    }),
    {
      name: "paperly-saved-schools",
      version: 1,
      migrate: (persistedState: unknown) => {
        const state = persistedState as Partial<SchoolStore> | undefined;
        const schools = (state?.schools || []).filter(
          (school) =>
            school.id !== "school_st_xaviers" && school.id !== "school_govt_excellence"
        );
        const selectedSchoolId = schools.some((school) => school.id === state?.selectedSchoolId)
          ? state?.selectedSchoolId || null
          : null;
        return { schools, selectedSchoolId };
      },
    }
  )
);
