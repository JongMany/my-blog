import * as React from "react";
import { cn } from "@srf/ui";
import { fixAssetSrc } from "./utils";
import { Pre } from "./Pre";
import {
  HEADING_BASE_CLASSES,
  TEXT_BASE_CLASSES,
  BORDER_BASE_CLASSES,
  SPACING_BASE_CLASSES,
} from "./constants";

// 타입 정의
type ComponentsProp = React.ComponentProps<
  typeof import("@mdx-js/react").MDXProvider
>["components"];
export type MDXMap = NonNullable<ComponentsProp>;

export const components: MDXMap = {
  // 헤딩 컴포넌트들
  h1: (props) => (
    <h1
      {...props}
      className={cn(
        HEADING_BASE_CLASSES,
        "mt-8 mb-4 text-3xl sm:text-4xl scroll-mt-24",
        props.className,
      )}
    />
  ),
  h2: (props) => (
    <h2
      {...props}
      className={cn(
        HEADING_BASE_CLASSES,
        "mt-10 mb-3 text-2xl sm:text-3xl scroll-mt-24",
        props.className,
      )}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className={cn(
        HEADING_BASE_CLASSES,
        "mt-8 mb-2 text-xl scroll-mt-20",
        props.className,
      )}
    />
  ),
  h4: (props) => (
    <h4
      {...props}
      className={cn(
        HEADING_BASE_CLASSES,
        "mt-6 mb-2 text-lg scroll-mt-20",
        props.className,
      )}
    />
  ),
  h5: (props) => (
    <h5
      {...props}
      className={cn(
        HEADING_BASE_CLASSES,
        "mt-5 mb-2 scroll-mt-16",
        props.className,
      )}
    />
  ),
  h6: (props) => (
    <h6
      {...props}
      className={cn(
        HEADING_BASE_CLASSES,
        "mt-5 mb-2 text-sm uppercase tracking-wide",
        props.className,
      )}
    />
  ),

  // 텍스트/인라인 컴포넌트들
  p: (props) => (
    <p
      {...props}
      className={cn(
        SPACING_BASE_CLASSES,
        "leading-relaxed",
        TEXT_BASE_CLASSES,
        props.className,
      )}
    />
  ),
  strong: (props) => (
    <strong
      {...props}
      className={cn("font-semibold text-white", props.className)}
    />
  ),
  em: (props) => <em {...props} className={cn("italic", props.className)} />,
  del: (props) => (
    <del {...props} className={cn("opacity-80", props.className)} />
  ),
  small: (props) => (
    <small
      {...props}
      className={cn("text-[0.9em] opacity-80", props.className)}
    />
  ),
  mark: (props) => (
    <mark
      {...props}
      className={cn("rounded bg-yellow-400/30 px-1", props.className)}
    />
  ),

  // 링크 컴포넌트
  a: ({ href = "", ...props }) => {
    const isExternal = /^https?:\/\//i.test(href);
    return (
      <a
        {...props}
        href={href}
        className={cn(
          "text-sky-400 underline decoration-sky-400/40 underline-offset-4 hover:decoration-2",
          "focus:outline-none focus:ring-2 focus:ring-sky-500/60 rounded-sm",
          props.className,
        )}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
      />
    );
  },

  // 리스트 컴포넌트들
  ul: (props) => (
    <ul
      {...props}
      className={cn(
        "my-3 list-disc pl-6 marker:text-white/60",
        props.className,
      )}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cn(
        "my-3 list-decimal pl-6 marker:text-white/60",
        props.className,
      )}
    />
  ),
  li: (props) => <li {...props} className={cn("my-1", props.className)} />,
  input: (props) => (
    <input
      {...props}
      className={cn("mr-2 align-middle accent-emerald-500", props.className)}
      type={props.type}
    />
  ),

  // 인용/구분선 컴포넌트들
  blockquote: (props) => (
    <blockquote
      {...props}
      className={cn(
        SPACING_BASE_CLASSES,
        "border-l-4 border-emerald-400/30 bg-white/[0.04] px-4 py-3 italic text-white/85 rounded-r-lg",
        props.className,
      )}
    />
  ),
  hr: (props) => (
    <hr
      {...props}
      className={cn("my-10", BORDER_BASE_CLASSES, props.className)}
    />
  ),

  // 코드 컴포넌트들
  code: (props) => (
    <code
      {...props}
      className={cn(
        "rounded bg-white/10 px-1.5 py-0.5 text-[0.92em] leading-none",
        props.className,
      )}
    />
  ),
  pre: (props) => <Pre {...props} />,

  // 표 컴포넌트들
  table: (props) => (
    <div className="my-5 overflow-x-auto">
      <table
        {...props}
        className={cn(
          "w-full border-collapse text-[0.95em]",
          "border border-white/10 [&_th]:border-white/10 [&_td]:border-white/10",
          props.className,
        )}
      />
    </div>
  ),
  thead: (props) => (
    <thead {...props} className={cn("bg-white/5", props.className)} />
  ),
  tr: (props) => (
    <tr
      {...props}
      className={cn("border-b border-white/10 last:border-0", props.className)}
    />
  ),
  th: (props) => (
    <th
      {...props}
      className={cn("px-3 py-2 text-left font-semibold", props.className)}
    />
  ),
  td: (props) => (
    <td {...props} className={cn("px-3 py-2 align-top", props.className)} />
  ),

  // 미디어 컴포넌트들
  img: ({ src, ...props }) => (
    <img
      {...props}
      src={fixAssetSrc(src)}
      className={cn(
        "mx-auto my-4 block max-w-full rounded-xl border border-white/10 shadow-lg",
        "transition hover:brightness-[1.05]",
        props.className,
      )}
      loading="lazy"
    />
  ),
  figure: (props) => (
    <figure {...props} className={cn("my-6 text-center", props.className)} />
  ),
  figcaption: (props) => (
    <figcaption
      {...props}
      className={cn("mt-2 text-sm text-white/70", props.className)}
    />
  ),
  video: ({ src, controls = true, ...props }) => (
    <video
      {...props}
      src={fixAssetSrc(src)}
      controls={controls}
      className={cn("mx-auto my-4 max-w-full rounded-lg", props.className)}
    />
  ),
  audio: ({ src, controls = true, ...props }) => (
    <audio
      {...props}
      src={fixAssetSrc(src)}
      controls={controls}
      className={cn("my-2 w-full", props.className)}
    />
  ),

  // 기타 컴포넌트들
  kbd: (props) => (
    <kbd
      {...props}
      className={cn(
        "rounded border border-white/20 bg-black/40 px-1.5 py-0.5 text-[0.85em] shadow-inner",
        props.className,
      )}
    />
  ),
  details: (props) => (
    <details
      {...props}
      className={cn(
        "my-3 rounded-lg border border-white/10 bg-white/5 p-3",
        props.className,
      )}
    />
  ),
  summary: (props) => (
    <summary
      {...props}
      className={cn(
        "cursor-pointer select-none font-medium text-white",
        props.className,
      )}
    />
  ),
};
