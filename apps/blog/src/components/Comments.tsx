// components/Giscus.tsx
import * as React from "react";

type GiscusProps = {
  /** Discussion 매핑 키 (예: `blog/${category}/${slug}`) */
  term: string;

  /** giscus 설치된 저장소/카테고리 설정 (설정 페이지에서 복사해온 값으로 대체 가능) */
  repo?: string; // "owner/repo"
  repoId?: string; // ex) "R_kgDOPr6rEw"
  category?: string; // ex) "Announcements"
  categoryId?: string; // ex) "DIC_kwDOPr6rE84CvImW"

  /** 매핑/옵션 */
  strict?: boolean; // 제목 완전일치
  mapping?: "specific"; // term 기반이므로 기본 'specific'
  reactionsEnabled?: boolean; // 반응(👍 등)
  emitMetadata?: boolean; // 메타데이터 이벤트
  inputPosition?: "top" | "bottom"; // 입력창 위치
  theme?: "light" | "dark" | "preferred_color_scheme";
  lang?: string;

  className?: string;
};

export default function Giscus({
  term,
  // ▼ 기본값: 질문에서 준 설정
  repo = "JongMany/blog-comment",
  repoId = "R_kgDOPr6rEw",
  category = "Announcements",
  categoryId = "DIC_kwDOPr6rE84CvImW",
  // ▼ 동작 옵션
  mapping = "specific",
  strict = true,
  reactionsEnabled = true,
  emitMetadata = false,
  inputPosition = "bottom",
  theme = "preferred_color_scheme",
  lang = "ko",
  className,
}: GiscusProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !ref.current) return;

    // 리렌더/term 변경 시 중복 방지
    ref.current.innerHTML = "";

    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";

    // 필수 설정
    s.setAttribute("data-repo", repo);
    s.setAttribute("data-repo-id", repoId);
    s.setAttribute("data-category", category);
    s.setAttribute("data-category-id", categoryId);

    // 매핑/표시 옵션
    s.setAttribute("data-mapping", mapping);
    s.setAttribute("data-term", term);
    s.setAttribute("data-strict", strict ? "1" : "0");
    s.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0");
    s.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0");
    s.setAttribute("data-input-position", inputPosition);
    s.setAttribute("data-theme", theme);
    s.setAttribute("data-lang", lang);

    ref.current.appendChild(s);

    // 언마운트 시 정리
    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [
    term,
    repo,
    repoId,
    category,
    categoryId,
    mapping,
    strict,
    reactionsEnabled,
    emitMetadata,
    inputPosition,
    theme,
    lang,
  ]);

  return <div ref={ref} className={className} />;
}
