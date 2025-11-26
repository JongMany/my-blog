import * as React from "react";
import {
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
  const [theme, setTheme] = React.useState(() =>
    isDarkMode() ? "dark" : "light",
  );

  // Giscus 스크립트 로드 및 설정
  React.useEffect(() => {
    if (!containerRef.current) return;

    // 기존 내용 제거
    containerRef.current.innerHTML = "";

    // 새 스크립트 생성 및 추가
    const script = createGiscusScript(term, theme);
    containerRef.current.appendChild(script);

    // 정리 함수
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [term, theme]);

  // 테마 변경 감지 및 동기화
  React.useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = isDarkMode() ? "dark" : "light";
      setTheme(newTheme);
      sendThemeUpdateMessage(newTheme);
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
  }, []);

  return (
    <section className={className || ""}>
      <div ref={containerRef} />
    </section>
  );
}
