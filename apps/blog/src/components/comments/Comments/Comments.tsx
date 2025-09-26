import * as React from "react";
import {
  getThemeUrl,
  createGiscusScript,
  sendThemeUpdateMessage,
  isDarkMode,
} from "./utils";

// Props 타입 정의
interface CommentsProps {
  term: string;
  className?: string;
}

export function Comments({ term, className }: CommentsProps) {
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
