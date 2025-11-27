import { cn } from "@srf/ui";

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
      <div className="flex rounded-full border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          onClick={onToggle}
          className={cn(
            buttonClasses,
            "rounded-full transition",
            isDetailed
              ? "bg-[var(--primary)] text-[var(--primary-ink)]"
              : "hover:bg-[var(--hover-bg)]",
          )}
        >
          {variant === "desktop" ? "자세한 버전" : "자세한"}
        </button>
        <button
          onClick={onToggle}
          className={cn(
            buttonClasses,
            "rounded-full transition",
            !isDetailed
              ? "bg-[var(--primary)] text-[var(--primary-ink)]"
              : "hover:bg-[var(--hover-bg)]",
          )}
        >
          {variant === "desktop" ? "간단한 버전" : "간단한"}
        </button>
      </div>
    </div>
  );
}

