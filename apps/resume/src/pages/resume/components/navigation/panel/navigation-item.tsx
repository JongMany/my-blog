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
        "w-full rounded-full px-3 py-1.5 text-left text-sm transition cursor-pointer",
        isActive
          ? "bg-[var(--primary)] text-[var(--primary-ink)]"
          : "bg-[var(--surface)] hover:bg-[var(--hover-bg)]",
      )}
      aria-current={isActive ? "true" : undefined}
    >
      {label}
    </button>
  );
}
