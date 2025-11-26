import { GISCUS_CONFIG } from "./giscus-config";

export function isDarkMode(): boolean {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

// Giscus 스크립트 생성 함수
export function createGiscusScript(
  term: string,
  theme: string,
): HTMLScriptElement {
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

// 테마 변경 메시지 전송 함수
export function sendThemeUpdateMessage(theme: string): void {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme } } },
    "https://giscus.app",
  );
}
