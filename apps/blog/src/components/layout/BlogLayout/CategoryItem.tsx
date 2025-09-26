import { NavLink } from "react-router-dom";
import { cn } from "@srf/ui";

// 스타일 상수들
const CATEGORY_PILL_BASE_CLASSES =
  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm whitespace-nowrap transition border";
const CATEGORY_PILL_ACTIVE_CLASSES =
  "bg-[var(--primary)] text-[var(--primary-ink)] border-[var(--primary)]";
const CATEGORY_PILL_INACTIVE_CLASSES =
  "border-[var(--border)] bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]";
const COUNT_BADGE_CLASSES = "rounded-full bg-black/20 px-2 py-0.5 text-xs";

// Props 타입 정의
interface CategoryItemProps {
  category: string;
  count: number;
  to: string;
}

export function CategoryItem({ category, count, to }: CategoryItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          CATEGORY_PILL_BASE_CLASSES,
          isActive
            ? CATEGORY_PILL_ACTIVE_CLASSES
            : CATEGORY_PILL_INACTIVE_CLASSES,
        )
      }
    >
      {category}
      <span className={COUNT_BADGE_CLASSES}>{count}</span>
    </NavLink>
  );
}
