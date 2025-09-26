import * as React from "react";
import { cn } from "@srf/ui";

// 코드블럭 컴포넌트
type PreProps = React.ComponentPropsWithoutRef<"pre">;

export function Pre(props: PreProps) {
  const { className, ...rest } = props;

  // children 중 첫 번째 유효한 엘리먼트 찾기
  const firstChild = React.Children.toArray(props.children).find(
    React.isValidElement,
  ) as
    | React.ReactElement<{ children?: React.ReactNode; className?: string }>
    | undefined;

  // 코드 내용과 언어 추출
  const raw = firstChild?.props?.children;
  const code =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw.join("") : "";
  const lang = String(firstChild?.props?.className ?? "").match(
    /language-([\w-]+)/,
  )?.[1];

  // 클립보드 복사 함수
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // 복사 실패 시 무시
    }
  };

  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-white/10 bg-black/40">
      {/* 언어 뱃지 */}
      {lang && (
        <span className="pointer-events-none absolute right-2 top-2 rounded bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80">
          {lang}
        </span>
      )}

      {/* 복사 버튼 */}
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 bottom-2 rounded border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-white/90 opacity-0 transition group-hover:opacity-100"
        aria-label="Copy code"
      >
        Copy
      </button>

      {/* 코드 블럭 */}
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
