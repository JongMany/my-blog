// // components/Giscus.tsx
// import * as React from "react";

// type GiscusProps = {
//   /** Discussion 매핑 키 (예: `blog/${category}/${slug}`) */
//   term: string;

//   /** giscus 설치된 저장소/카테고리 설정 (설정 페이지에서 복사해온 값으로 대체 가능) */
//   repo?: string; // "owner/repo"
//   repoId?: string; // ex) "R_kgDOPr6rEw"
//   category?: string; // ex) "Announcements"
//   categoryId?: string; // ex) "DIC_kwDOPr6rE84CvImW"

//   /** 매핑/옵션 */
//   strict?: boolean; // 제목 완전일치
//   mapping?: "specific"; // term 기반이므로 기본 'specific'
//   reactionsEnabled?: boolean; // 반응(👍 등)
//   emitMetadata?: boolean; // 메타데이터 이벤트
//   inputPosition?: "top" | "bottom"; // 입력창 위치
//   theme?: "light" | "dark" | "preferred_color_scheme";
//   lang?: string;

//   className?: string;
// };

// export default function Giscus({
//   term,
//   // ▼ 기본값: 질문에서 준 설정
//   repo = "JongMany/blog-comment",
//   repoId = "R_kgDOPr6rEw",
//   category = "Announcements",
//   categoryId = "DIC_kwDOPr6rE84CvImW",
//   // ▼ 동작 옵션
//   mapping = "specific",
//   strict = true,
//   reactionsEnabled = true,
//   emitMetadata = false,
//   inputPosition = "bottom",
//   theme = "preferred_color_scheme",
//   lang = "ko",
//   className,
// }: GiscusProps) {
//   const ref = React.useRef<HTMLDivElement>(null);

//   React.useEffect(() => {
//     if (typeof window === "undefined" || !ref.current) return;

//     // 리렌더/term 변경 시 중복 방지
//     ref.current.innerHTML = "";

//     const s = document.createElement("script");
//     s.src = "https://giscus.app/client.js";
//     s.async = true;
//     s.crossOrigin = "anonymous";

//     // 필수 설정
//     s.setAttribute("data-repo", repo);
//     s.setAttribute("data-repo-id", repoId);
//     s.setAttribute("data-category", category);
//     s.setAttribute("data-category-id", categoryId);

//     // 매핑/표시 옵션
//     s.setAttribute("data-mapping", mapping);
//     s.setAttribute("data-term", term);
//     s.setAttribute("data-strict", strict ? "1" : "0");
//     s.setAttribute("data-reactions-enabled", reactionsEnabled ? "1" : "0");
//     s.setAttribute("data-emit-metadata", emitMetadata ? "1" : "0");
//     s.setAttribute("data-input-position", inputPosition);
//     s.setAttribute("data-theme", theme);
//     s.setAttribute("data-lang", lang);

//     ref.current.appendChild(s);

//     // 언마운트 시 정리
//     return () => {
//       if (ref.current) ref.current.innerHTML = "";
//     };
//   }, [
//     term,
//     repo,
//     repoId,
//     category,
//     categoryId,
//     mapping,
//     strict,
//     reactionsEnabled,
//     emitMetadata,
//     inputPosition,
//     theme,
//     lang,
//   ]);

//   return <div ref={ref} className={className} />;
// }

// import * as React from "react";

// function isDarkNow() {
//   const html = document.documentElement;
//   const hasClass = html.classList.contains("dark");
//   const prefers =
//     typeof window !== "undefined" &&
//     window.matchMedia?.("(prefers-color-scheme: dark)").matches;
//   return hasClass || prefers;
// }

// type Props = {
//   term: string; // 예: `blog/${category}/${slug}`
//   className?: string;
// };

// export default function GiscusBox({ term, className }: Props) {
//   const ref = React.useRef<HTMLDivElement>(null);

//   const theme = React.useMemo(
//     () => (isDarkNow() ? "noborder_dark" : "noborder_light"),
//     [],
//   );

//   React.useEffect(() => {
//     if (!ref.current) return;
//     ref.current.innerHTML = "";

//     const s = document.createElement("script");
//     s.src = "https://giscus.app/client.js";
//     s.async = true;
//     s.crossOrigin = "anonymous";

//     // 👉 필요한 값만 넣음(나머진 기본값)
//     s.setAttribute("data-repo", "JongMany/blog-comment");
//     s.setAttribute("data-repo-id", "R_kgDOPr6rEw");
//     s.setAttribute("data-category", "Announcements");
//     s.setAttribute("data-category-id", "DIC_kwDOPr6rE84CvImW");

//     s.setAttribute("data-mapping", "specific");
//     s.setAttribute("data-term", term);
//     s.setAttribute("data-strict", "1");
//     s.setAttribute("data-reactions-enabled", "1");
//     s.setAttribute("data-input-position", "bottom");
//     s.setAttribute("data-lang", "ko");

//     // UI 포인트: 내부 보더 제거 -> 바깥 카드만 보이게
//     s.setAttribute("data-theme", theme);

//     ref.current.appendChild(s);

//     return () => {
//       if (ref.current) ref.current.innerHTML = "";
//     };
//   }, [term, theme]);

//   // 다크모드 전환 시 테마 스왑(선택)
//   React.useEffect(() => {
//     const update = () => {
//       const iframe = document.querySelector<HTMLIFrameElement>(
//         "iframe.giscus-frame",
//       );
//       iframe?.contentWindow?.postMessage(
//         {
//           giscus: {
//             setConfig: {
//               theme: isDarkNow() ? "noborder_dark" : "noborder_light",
//             },
//           },
//         },
//         "https://giscus.app",
//       );
//     };
//     const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
//     mql?.addEventListener?.("change", update);
//     const mo = new MutationObserver(update);
//     mo.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ["class"],
//     });
//     return () => {
//       mql?.removeEventListener?.("change", update);
//       mo.disconnect();
//     };
//   }, []);

//   return (
//     <section
//       className={[
//         "rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]/60 backdrop-blur-sm",
//         "overflow-hidden",
//         className || "",
//       ].join(" ")}
//     >
//       <header className="flex items-center justify-between border-b border-[var(--border)]/70 px-4 py-3">
//         <h2 className="text-sm font-medium">댓글</h2>
//         <a
//           href="https://github.com/apps/giscus"
//           target="_blank"
//           rel="noreferrer"
//           className="text-xs text-[var(--muted)] hover:underline"
//         >
//           Powered by giscus
//         </a>
//       </header>
//       <div ref={ref} className="p-2" />
//     </section>
//   );
// }

import { assetUrl } from "@mfe/shared";
import * as React from "react";

function getBaseHref() {
  const b = document.querySelector("base")?.getAttribute("href") ?? "/";
  return b.endsWith("/") ? b.slice(0, -1) : b; // "", "/my-blog"
}
function absUrl(path: string) {
  // path: "styles/giscus-light.css" or "/styles/…"
  const base = getBaseHref(); // "", "/my-blog"
  const root = new URL(base + "/", window.location.origin); // e.g. http://localhost:3000/my-blog/
  return new URL(path.replace(/^\//, ""), root).href; // full URL
}
function prefersDark() {
  return (
    document.documentElement.classList.contains("dark") ||
    window.matchMedia?.("(prefers-color-scheme: dark)").matches
  );
}

export default function GiscusBox({
  term,
  className,
}: {
  term: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const themeUrl = React.useMemo(() => {
    // https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-dark.css
    // https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-light.css

    const devUrl = prefersDark()
      ? absUrl("styles/giscus-dark.css")
      : absUrl("styles/giscus-light.css");
    const prodUrl = prefersDark()
      ? "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-dark.css"
      : "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-light.css";
    return import.meta.env.MODE === "development" ? devUrl : prodUrl;
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    ref.current.innerHTML = "";

    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";

    s.setAttribute("data-repo", "JongMany/blog-comment");
    s.setAttribute("data-repo-id", "R_kgDOPr6rEw");
    s.setAttribute("data-category", "Announcements");
    s.setAttribute("data-category-id", "DIC_kwDOPr6rE84CvImW");

    s.setAttribute("data-mapping", "specific");
    s.setAttribute("data-term", term);
    s.setAttribute("data-strict", "1");
    s.setAttribute("data-reactions-enabled", "0");
    s.setAttribute("data-input-position", "bottom");
    s.setAttribute("data-lang", "ko");

    // ✅ 절대 URL을 전달해야 함
    s.setAttribute("data-theme", themeUrl);

    ref.current.appendChild(s);
    return () => {
      ref.current && (ref.current.innerHTML = "");
    };
  }, [term, themeUrl]);

  // 다크/라이트 전환 시 iFrame 테마 동기화
  React.useEffect(() => {
    const apply = () => {
      const devUrl = prefersDark()
        ? absUrl("styles/giscus-dark.css")
        : absUrl("styles/giscus-light.css");
      const prodUrl = prefersDark()
        ? "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-dark.css"
        : "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-light.css";

      const url = import.meta.env.MODE === "development" ? devUrl : prodUrl;
      document
        .querySelector<HTMLIFrameElement>("iframe.giscus-frame")
        ?.contentWindow?.postMessage(
          { giscus: { setConfig: { theme: url } } },
          "https://giscus.app",
        );
    };
    const mm = window.matchMedia?.("(prefers-color-scheme: dark)");
    mm?.addEventListener?.("change", apply);
    const mo = new MutationObserver(apply);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => {
      mm?.removeEventListener?.("change", apply);
      mo.disconnect();
    };
  }, []);

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
      <div ref={ref} className="p-2" />
    </section>
  );
}
