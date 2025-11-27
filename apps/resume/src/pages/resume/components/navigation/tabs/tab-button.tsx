import { cn } from "@srf/ui";

interface TabButtonProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  variant?: "desktop" | "mobile";
}

/**
 * 섹션 탭 버튼 컴포넌트
 */
export function TabButton({
  id,
  label,
  isActive,
  onClick,
  variant = "desktop",
}: TabButtonProps) {
  const baseClasses = "rounded-full transition";
  const variantClasses =
    variant === "desktop"
      ? "px-3.5 py-1.5 text-sm"
      : "px-2.5 py-1 text-xs flex-1";

  return (
    <button
      onClick={onClick}
      className={cn(
        baseClasses,
        variantClasses,
        "cursor-pointer",
        isActive
          ? "bg-[var(--primary)] text-[var(--primary-ink)]"
          : "hover:bg-[var(--hover-bg)]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );
}
