import { assetUrl } from "@mfe/shared";
import * as React from "react";

// Giscus 설정 상수
const GISCUS_CONFIG = {
  repo: "JongMany/blog-comment",
  repoId: "R_kgDOPr6rEw",
  category: "Announcements",
  categoryId: "DIC_kwDOPr6rE84CvImW",
  mapping: "specific",
  strict: "1",
  reactionsEnabled: "0",
  inputPosition: "bottom",
  lang: "ko",
} as const;

// 테마 관련 상수
const THEME_PATHS = {
  dark: "styles/giscus-dark.css",
  light: "styles/giscus-light.css",
} as const;

const PRODUCTION_THEME_URLS = {
  dark: "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-dark.css",
  light:
    "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-light.css",
} as const;

// 유틸리티 함수들
function getBaseHref(): string {
  const baseHref = document.querySelector("base")?.getAttribute("href") ?? "/";
  return baseHref.endsWith("/") ? baseHref.slice(0, -1) : baseHref;
}

function createAbsoluteUrl(path: string): string {
  const base = getBaseHref();
  const root = new URL(base + "/", window.location.origin);
  return new URL(path.replace(/^\//, ""), root).href;
}

function isDarkMode(): boolean {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

function getThemeUrl(isDark: boolean, isDevelopment: boolean): string {
  const themeType = isDark ? "dark" : "light";

  if (isDevelopment) {
    return createAbsoluteUrl(THEME_PATHS[themeType]);
  }

  return PRODUCTION_THEME_URLS[themeType];
}

// Giscus 스크립트 생성 함수
function createGiscusScript(term: string, themeUrl: string): HTMLScriptElement {
  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";

  // Giscus 설정 적용
  Object.entries(GISCUS_CONFIG).forEach(([key, value]) => {
    script.setAttribute(`data-${key}`, value);
  });

  script.setAttribute("data-term", term);
  script.setAttribute("data-theme", themeUrl);

  return script;
}

// 테마 변경 메시지 전송 함수
function sendThemeUpdateMessage(themeUrl: string): void {
  const iframe = document.querySelector<HTMLIFrameElement>(
    "iframe.giscus-frame",
  );
  iframe?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: themeUrl } } },
    "https://giscus.app",
  );
}

// Props 타입 정의
interface CommentsProps {
  term: string;
  className?: string;
}

function Comments({ term, className }: CommentsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDevelopment = import.meta.env.MODE === "development";

  // 현재 테마 URL 계산
  const themeUrl = React.useMemo(() => {
    return getThemeUrl(isDarkMode(), isDevelopment);
  }, [isDevelopment]);

  // Giscus 스크립트 로드 및 설정
  React.useEffect(() => {
    if (!containerRef.current) return;

    // 기존 내용 제거
    containerRef.current.innerHTML = "";

    // 새 스크립트 생성 및 추가
    const script = createGiscusScript(term, themeUrl);
    containerRef.current.appendChild(script);

    // 정리 함수
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [term, themeUrl]);

  // 테마 변경 감지 및 동기화
  React.useEffect(() => {
    const handleThemeChange = () => {
      const newThemeUrl = getThemeUrl(isDarkMode(), isDevelopment);
      sendThemeUpdateMessage(newThemeUrl);
    };

    // 미디어 쿼리 변경 감지
    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");
    mediaQuery?.addEventListener?.("change", handleThemeChange);

    // DOM 클래스 변경 감지
    const mutationObserver = new MutationObserver(handleThemeChange);
    mutationObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // 정리 함수
    return () => {
      mediaQuery?.removeEventListener?.("change", handleThemeChange);
      mutationObserver.disconnect();
    };
  }, [isDevelopment]);

  return (
    <section
      className={[
        "rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/60 backdrop-blur-sm",
        className || "",
      ].join(" ")}
    >
      <header className="flex items-center justify-between border-b border-[var(--border)]/70 px-4 py-3">
        <h2 className="text-sm font-medium">댓글</h2>
        <span className="text-xs text-[var(--muted)]">Powered by giscus</span>
      </header>
      <div ref={containerRef} className="p-2" />
    </section>
  );
}

// 기존 호환성을 위한 export
export default Comments;
export { Comments as Giscus };
