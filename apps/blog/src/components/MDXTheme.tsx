// apps/blog/src/mdx/mdxComponents.tsx
import * as React from "react";
import { MDXProvider } from "@mdx-js/react";
import type { ComponentProps } from "react";
import { assetUrl } from "@mfe/shared";
import { cn } from "@srf/ui";

type ComponentsProp = ComponentProps<typeof MDXProvider>["components"];
type MDXMap = NonNullable<ComponentsProp>;

function fixAssetSrc(src?: string) {
  if (!src) return src;
  if (src.startsWith("/_blog/") || src.startsWith("_blog/")) {
    return assetUrl(src.replace(/^\//, ""), "blog"); // /my-blog/blog/_blog/...
  }
  if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) {
    return assetUrl(`_blog/${src}`, "blog"); // 상대경로 보정
  }
  return src;
}

/** 코드블럭: 언어 뱃지 + 복사버튼 + 스크롤 */
type PreProps = React.ComponentPropsWithoutRef<"pre">;

function Pre(props: PreProps) {
  // children 중 "엘리먼트" 하나를 안전하게 뽑음
  const firstChild = React.Children.toArray(props.children).find(
    React.isValidElement,
  ) as
    | React.ReactElement<{ children?: React.ReactNode; className?: string }>
    | undefined;

  // 코드/언어 추출 (없으면 빈 문자열)
  const raw = firstChild?.props?.children;
  const code =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw.join("") : "";

  const lang = String(firstChild?.props?.className ?? "").match(
    /language-([\w-]+)/,
  )?.[1];

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  }

  const { className, ...rest } = props;

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-white/10 bg-black/40">
      {lang && (
        <span className="pointer-events-none absolute right-2 top-2 rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
          {lang}
        </span>
      )}

      <button
        type="button"
        onClick={copy}
        className="absolute right-2 bottom-2 rounded border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 opacity-0 transition group-hover:opacity-100"
        aria-label="Copy code"
      >
        Copy
      </button>

      {/* 원본 children을 그대로 렌더 */}
      <pre
        {...rest}
        className={cn(
          "m-0 overflow-auto p-4 text-[0.95em] leading-6",
          className,
        )}
      >
        {props.children}
      </pre>
    </div>
  );
}

export const components: MDXMap = {
  /* === Headings: 큰 제목은 확실히, 섹션은 촘촘히, 앵커 자동링크 없음 === */
  h1: (p) => (
    <h1
      {...p}
      className={cn(
        "mt-8 mb-4 text-3xl font-semibold tracking-tight sm:text-4xl scroll-mt-24",
        p.className,
      )}
    />
  ),
  h2: (p) => (
    <h2
      {...p}
      className={cn(
        "mt-10 mb-3 text-2xl font-semibold tracking-tight sm:text-3xl scroll-mt-24",
        p.className,
      )}
    />
  ),
  h3: (p) => (
    <h3
      {...p}
      className={cn(
        "mt-8 mb-2 text-xl font-semibold tracking-tight scroll-mt-20",
        p.className,
      )}
    />
  ),
  h4: (p) => (
    <h4
      {...p}
      className={cn(
        "mt-6 mb-2 text-lg font-semibold scroll-mt-20",
        p.className,
      )}
    />
  ),
  h5: (p) => (
    <h5
      {...p}
      className={cn("mt-5 mb-2 font-semibold scroll-mt-16", p.className)}
    />
  ),
  h6: (p) => (
    <h6
      {...p}
      className={cn(
        "mt-5 mb-2 text-sm font-semibold uppercase tracking-wide",
        p.className,
      )}
    />
  ),

  /* === 텍스트/인라인 === */
  p: (p) => (
    <p
      {...p}
      className={cn("my-4 leading-relaxed text-white/95", p.className)}
    />
  ),
  strong: (p) => (
    <strong {...p} className={cn("font-semibold text-white", p.className)} />
  ),
  em: (p) => <em {...p} className={cn("italic", p.className)} />,
  del: (p) => <del {...p} className={cn("opacity-80", p.className)} />,
  small: (p) => (
    <small {...p} className={cn("text-[0.9em] opacity-80", p.className)} />
  ),
  mark: (p) => (
    <mark {...p} className={cn("rounded bg-yellow-400/30 px-1", p.className)} />
  ),

  a: ({ href = "", ...p }) => {
    const external = /^https?:\/\//i.test(href);
    return (
      <a
        {...p}
        href={href}
        className={cn(
          "text-sky-400 underline decoration-sky-400/40 underline-offset-4 hover:decoration-2",
          "focus:outline-none focus:ring-2 focus:ring-sky-500/60 rounded-sm",
          p.className,
        )}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      />
    );
  },

  /* === 리스트 === */
  ul: (p) => (
    <ul
      {...p}
      className={cn("my-3 list-disc pl-6 marker:text-white/60", p.className)}
    />
  ),
  ol: (p) => (
    <ol
      {...p}
      className={cn("my-3 list-decimal pl-6 marker:text-white/60", p.className)}
    />
  ),
  li: (p) => <li {...p} className={cn("my-1", p.className)} />,
  input: (p) => (
    <input
      {...p}
      className={cn(
        "mr-2 align-middle accent-emerald-500",
        // 체크리스트만 스타일: 다른 곳엔 영향 X
        p.className,
      )}
      type={p.type}
    />
  ),

  /* === 인용/구분선 === */
  blockquote: (p) => (
    <blockquote
      {...p}
      className={cn(
        "my-4 border-l-4 border-emerald-400/30 bg-white/[0.04] px-4 py-3 italic text-white/85",
        "rounded-r-lg",
        p.className,
      )}
    />
  ),
  hr: (p) => <hr {...p} className={cn("my-10 border-white/10", p.className)} />,

  /* === 코드 === */
  code: (p) => (
    <code
      {...p}
      className={cn(
        "rounded bg-white/10 px-1.5 py-0.5 text-[0.92em] leading-none",
        p.className,
      )}
    />
  ),
  pre: (p) => <Pre {...p} />,

  /* === 표 === */
  table: (p) => (
    <div className="my-5 overflow-x-auto">
      <table
        {...p}
        className={cn(
          "w-full border-collapse text-[0.95em]",
          "border border-white/10 [&_th]:border-white/10 [&_td]:border-white/10",
          p.className,
        )}
      />
    </div>
  ),
  thead: (p) => <thead {...p} className={cn("bg-white/5", p.className)} />,
  tr: (p) => (
    <tr
      {...p}
      className={cn("border-b border-white/10 last:border-0", p.className)}
    />
  ),
  th: (p) => (
    <th
      {...p}
      className={cn("px-3 py-2 text-left font-semibold", p.className)}
    />
  ),
  td: (p) => <td {...p} className={cn("px-3 py-2 align-top", p.className)} />,

  /* === 미디어 === */
  img: ({ src, ...p }) => (
    <img
      {...p}
      src={fixAssetSrc(src)}
      className={cn(
        "mx-auto my-4 block max-w-full rounded-xl border border-white/10 shadow-lg",
        "transition hover:brightness-[1.05]",
        p.className,
      )}
      loading="lazy"
    />
  ),
  figure: (p) => (
    <figure {...p} className={cn("my-6 text-center", p.className)} />
  ),
  figcaption: (p) => (
    <figcaption
      {...p}
      className={cn("mt-2 text-sm text-white/70", p.className)}
    />
  ),
  video: ({ src, controls = true, ...p }) => (
    <video
      {...p}
      src={fixAssetSrc(src)}
      controls={controls}
      className={cn("mx-auto my-4 max-w-full rounded-lg", p.className)}
    />
  ),
  audio: ({ src, controls = true, ...p }) => (
    <audio
      {...p}
      src={fixAssetSrc(src)}
      controls={controls}
      className={cn("my-2 w-full", p.className)}
    />
  ),

  /* === 기타 === */
  kbd: (p) => (
    <kbd
      {...p}
      className={cn(
        "rounded border border-white/20 bg-black/40 px-1.5 py-0.5 text-[0.85em] shadow-inner",
        p.className,
      )}
    />
  ),
  details: (p) => (
    <details
      {...p}
      className={cn(
        "my-3 rounded-lg border border-white/10 bg-white/5 p-3",
        p.className,
      )}
    />
  ),
  summary: (p) => (
    <summary
      {...p}
      className={cn(
        "cursor-pointer select-none font-medium text-white",
        p.className,
      )}
    />
  ),
};

export function MDXTheme({ children }: { children: React.ReactNode }) {
  return <MDXProvider components={components}>{children}</MDXProvider>;
}
