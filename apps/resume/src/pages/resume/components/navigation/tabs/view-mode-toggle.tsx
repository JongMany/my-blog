import { useRef } from "react";
import { cn } from "@srf/ui";
import ActivePill from "./active-pill";

interface ViewModeToggleProps {
  isDetailed: boolean;
  onToggle: () => void;
  variant?: "desktop" | "mobile";
}

/**
 * 이력서 보기 모드 토글 컴포넌트
 */
export function ViewModeToggle({
  isDetailed,
  onToggle,
  variant = "desktop",
}: ViewModeToggleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonClasses =
    variant === "desktop"
      ? "px-3 py-1 text-xs"
      : "px-2.5 py-1 text-xs";

  return (
    <div
      className={
        variant === "desktop"
          ? "flex items-center gap-2"
          : "flex items-center justify-center"
      }
    >
      {variant === "desktop" && (
        <span className="text-xs text-gray-500">보기 모드:</span>
      )}
      <div
        ref={containerRef}
        className="relative z-0 flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
      >
        <ActivePill containerRef={containerRef} />
        <button
          onClick={onToggle}
          className={cn(
            buttonClasses,
            "relative z-10 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
            isDetailed
              ? "text-[var(--fg)] font-semibold"
              : "text-[var(--muted-fg)]",
          )}
          aria-current={isDetailed ? "page" : undefined}
        >
          {variant === "desktop" ? "자세한 버전" : "자세한"}
        </button>
        <button
          onClick={onToggle}
          className={cn(
            buttonClasses,
            "relative z-10 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
            !isDetailed
              ? "text-[var(--fg)] font-semibold"
              : "text-[var(--muted-fg)]",
          )}
          aria-current={!isDetailed ? "page" : undefined}
        >
          {variant === "desktop" ? "간단한 버전" : "간단한"}
        </button>
      </div>
    </div>
  );
}

