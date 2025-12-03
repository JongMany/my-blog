/**
 * Theme Utility Functions
 * Helper functions for managing theme state
 */

export type Theme = "light" | "dark";

/**
 * Check if code is running in browser environment
 */
function isBrowser(): boolean {
  return typeof document !== "undefined";
}

/**
 * Get document element safely (returns null in SSR)
 */
function getDocumentElement(): HTMLElement | null {
  if (!isBrowser()) {
    return null;
  }
  return document.documentElement;
}

/**
 * Theme management utilities
 */
export const theme = {
  /**
   * Apply light theme
   */
  setLight: () => {
    const root = getDocumentElement();
    if (root) {
      root.classList.remove("dark");
      root.classList.add("light");
    }
  },

  /**
   * Apply dark theme
   */
  setDark: () => {
    const root = getDocumentElement();
    if (root) {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  },

  /**
   * Toggle between light/dark
   */
  toggle: () => {
    const root = getDocumentElement();
    if (!root) return;

    const isDark = root.classList.contains("dark");
    if (isDark) {
      theme.setLight();
    } else {
      theme.setDark();
    }
  },

  /**
   * Get current theme
   */
  getCurrent: (): Theme | null => {
    const root = getDocumentElement();
    if (!root) return null;

    if (root.classList.contains("dark")) {
      return "dark";
    } else if (root.classList.contains("light")) {
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
