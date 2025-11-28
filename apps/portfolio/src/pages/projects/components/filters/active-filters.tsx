import { cn } from "@srf/ui";
import { UI_CONSTANTS } from "@/pages/projects/constants/ui";

const BADGE_STYLE =
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20";

interface ActiveFilterBadgeProps {
  label: string;
  onClear: () => void;
  ariaLabel: string;
}

function ActiveFilterBadge({
  label,
  onClear,
  ariaLabel,
}: ActiveFilterBadgeProps) {
  return (
    <button
      type="button"
      onClick={onClear}
      className={cn(
        BADGE_STYLE,
        "cursor-pointer hover:opacity-80 transition-opacity",
      )}
      aria-label={ariaLabel}
    >
      {label}
      <span className="ml-1.5 hover:opacity-70 transition-opacity">×</span>
    </button>
  );
}

interface ActiveFiltersProps {
  searchQuery: string;
  selectedProject: string;
  selectedTag: string;
  onClearSearch: () => void;
  onClearProject: () => void;
  onClearTag: () => void;
  onClearAll: () => void;
}

export function ActiveFilters({
  searchQuery,
  selectedProject,
  selectedTag,
  onClearSearch,
  onClearProject,
  onClearTag,
  onClearAll,
}: ActiveFiltersProps) {
  const hasActiveFilters = Boolean(
    searchQuery || selectedProject || selectedTag,
  );

  if (!hasActiveFilters) return null;

  return (
    <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
      <div className="flex items-center gap-2 flex-wrap">
        {searchQuery && (
          <ActiveFilterBadge
            label={`검색: ${searchQuery}`}
            onClear={onClearSearch}
            ariaLabel="검색 초기화"
          />
        )}
        {selectedProject && (
          <ActiveFilterBadge
            label={selectedProject}
            onClear={onClearProject}
            ariaLabel="프로젝트 필터 초기화"
          />
        )}
        {selectedTag && (
          <ActiveFilterBadge
            label={`${UI_CONSTANTS.TAG_PREFIX}${selectedTag}`}
            onClear={onClearTag}
            ariaLabel="태그 필터 초기화"
          />
        )}
      </div>
      <button
        type="button"
        onClick={onClearAll}
        className="text-xs text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors whitespace-nowrap cursor-pointer"
        aria-label="모든 필터 초기화"
      >
        모두 지우기
      </button>
    </div>
  );
}

