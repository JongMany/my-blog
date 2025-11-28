import { useEffect, useState } from "react";
import { isDarkMode } from "@/utils/is-dark-mode";
import { Theme } from "@/types/theme";

export const useThemeChange = (onThemeChange?: (theme: Theme) => void) => {
  const [theme, setTheme] = useState<Theme>(isDarkMode() ? "dark" : "light");

  useEffect(() => {
    const updateTheme = () => {
      const newTheme = isDarkMode() ? "dark" : "light";
      setTheme(newTheme);
      onThemeChange?.(newTheme);
    };

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [onThemeChange]);

  return theme;
};
