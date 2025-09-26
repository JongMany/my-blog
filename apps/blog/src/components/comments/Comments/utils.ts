import { assetUrl } from "@mfe/shared";
import { THEME_PATHS, PRODUCTION_THEME_URLS } from "./GiscusConfig";

// 유틸리티 함수들
export function getBaseHref(): string {
  const baseHref = document.querySelector("base")?.getAttribute("href") ?? "/";
  return baseHref.endsWith("/") ? baseHref.slice(0, -1) : baseHref;
}

export function createAbsoluteUrl(path: string): string {
  const base = getBaseHref();
  const root = new URL(base + "/", window.location.origin);
  return new URL(path.replace(/^\//, ""), root).href;
}

export function isDarkMode(): boolean {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

export function getThemeUrl(isDark: boolean, isDevelopment: boolean): string {
  const themeType = isDark ? "dark" : "light";

  if (isDevelopment) {
    return createAbsoluteUrl(THEME_PATHS[themeType]);
  }

  return PRODUCTION_THEME_URLS[themeType];
}

// Giscus 스크립트 생성 함수
export function createGiscusScript(
  term: string,
  themeUrl: string,
): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";

  // Giscus 설정 적용
  Object.entries({
    repo: "JongMany/blog-comment",
    repoId: "R_kgDOPr6rEw",
    category: "Announcements",
    categoryId: "DIC_kwDOPr6rE84CvImW",
    mapping: "specific",
    strict: "1",
    reactionsEnabled: "0",
    inputPosition: "bottom",
    lang: "ko",
  }).forEach(([key, value]) => {
    script.setAttribute(`data-${key}`, value);
  });

  script.setAttribute("data-term", term);
  script.setAttribute("data-theme", themeUrl);

  return script;
}

// 테마 변경 메시지 전송 함수
export function sendThemeUpdateMessage(themeUrl: string): void {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: themeUrl } } },
    "https://giscus.app",
  );
}
