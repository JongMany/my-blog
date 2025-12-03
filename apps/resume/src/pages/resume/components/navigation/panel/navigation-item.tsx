import { cn } from "@srf/ui";

interface NavigationItemProps {
  id: string;
  label: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

/**
 * 네비게이션 패널 개별 아이템 컴포넌트
 */
export function NavigationItem({
  id,
  label,
  isActive,
  onClick,
}: NavigationItemProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={cn(
        "w-full rounded-full px-3 py-1.5 text-left text-sm transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border)]",
        isActive
          ? "bg-[rgba(8,24,48,0.08)] dark:bg-[rgba(255,255,255,0.12)] text-[var(--fg)] font-semibold"
          : "text-[var(--muted-fg)] hover:bg-[var(--hover-bg)]",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      {label}
    </button>
  );
}
