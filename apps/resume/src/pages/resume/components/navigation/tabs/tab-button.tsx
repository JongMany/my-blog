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
        "relative z-10 cursor-pointer transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
        isActive
          ? "text-[var(--fg)] font-semibold"
          : "text-[var(--muted-fg)]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );
}
