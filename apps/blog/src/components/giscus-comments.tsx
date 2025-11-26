import { useEffect, useRef, useState } from "react";
import { GISCUS_CONFIG } from "../consts/giscus.config";
import { isDarkMode } from "../utils/is-dark-mode";
import { Theme } from "../types/theme";

type GiscusCommentsProps = {
  term: string;
  className?: string;
};

export const GiscusComments = ({ term, className }: GiscusCommentsProps) => {
  const giscusTheme = isDarkMode() ? "dark" : "light";

  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<Theme>(giscusTheme);

  useEffect(() => {
    const updateTheme = () => {
      const newTheme = isDarkMode() ? "dark" : "light";
      setTheme(newTheme);
      sendThemeUpdateMessage(newTheme);
    };

    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    mediaQuery?.addEventListener?.("change", updateTheme);

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      mediaQuery?.removeEventListener?.("change", updateTheme);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(createGiscusScript(term, theme));

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [term, theme]);

  return (
    <section className={className}>
      <div ref={containerRef} />
    </section>
  );
};

function sendThemeUpdateMessage(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );

  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    "https://giscus.app",
  );
}

function createGiscusScript(term: string, theme: string): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";

  // Giscus 설정 적용
  // giscus는 kebab-case 속성명을 사용 (repo-id, category-id 등)
  script.setAttribute("data-repo", GISCUS_CONFIG.repo);
  script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
  script.setAttribute("data-category", GISCUS_CONFIG.category);
  script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
  script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
  script.setAttribute("data-strict", GISCUS_CONFIG.strict);
  script.setAttribute("data-reactions-enabled", GISCUS_CONFIG.reactionsEnabled);
  script.setAttribute("data-input-position", GISCUS_CONFIG.inputPosition);
  script.setAttribute("data-lang", GISCUS_CONFIG.lang);

  script.setAttribute("data-term", term);
  script.setAttribute("data-theme", theme);

  return script;
}
