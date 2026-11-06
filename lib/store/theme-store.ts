import { create } from "zustand";

type ThemeMode = "dark" | "light";

type ThemeStore = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  (set, get) => ({
    theme: "light",
    setTheme: (theme) => {
      set({ theme });
      if (typeof document !== "undefined") {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    toggleTheme: () => {
      const next = get().theme === "dark" ? "light" : "dark";
      get().setTheme(next);
    },
  })
);
