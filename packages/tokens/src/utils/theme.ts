/**
 * Theme Utility Functions
 * Helper functions for managing theme state
 */

export type Theme = "light" | "dark";

/**
 * Theme management utilities
 */
export const theme = {
  /**
   * Apply light theme
   */
  setLight: () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  },

  /**
   * Apply dark theme
   */
  setDark: () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  },

  /**
   * Toggle between light/dark
   */
  toggle: () => {
    if (typeof document !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      if (isDark) {
        theme.setLight();
      } else {
        theme.setDark();
      }
    }
  },

  /**
   * Get current theme
   */
  getCurrent: (): Theme | null => {
    if (typeof document === "undefined") return null;

    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    } else if (document.documentElement.classList.contains("light")) {
      return "light";
    }
    return null;
  },

  /**
   * Set theme by name
   */
  set: (themeName: Theme) => {
    if (themeName === "dark") {
      theme.setDark();
    } else {
      theme.setLight();
    }
  },

  /**
   * Check if current theme is dark
   */
  isDark: (): boolean => {
    return theme.getCurrent() === "dark";
  },

  /**
   * Check if current theme is light
   */
  isLight: (): boolean => {
    return theme.getCurrent() === "light";
  },
};
