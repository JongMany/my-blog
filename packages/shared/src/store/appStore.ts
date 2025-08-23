import { create } from "zustand";

type AppState = {
  theme: "light" | "dark";
  setTheme: (t: AppState["theme"]) => void;
};

export const useAppStore = create<AppState>((set) => ({
  theme: "light",
  setTheme: (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
    set({ theme });
  },
}));
