import { SearchInput, SelectableChips } from "../../../components/common";
import type { ProjectIndex } from "../../../entities/project";
import { UI_CONSTANTS } from "../constants/ui";
import type { useProjectFilters } from "../hooks/use-project-filters";

interface ProjectFiltersProps {
  portfolioIndex: ProjectIndex | undefined;
  filterState: ReturnType<typeof useProjectFilters>;
}

export function ProjectFilters({
  portfolioIndex,
  filterState,
}: ProjectFiltersProps) {
  const {
    searchQuery,
    selectedTag,
    selectedProject,
    setSearchText,
    commitSearch,
    setTag,
    setProject,
    clearTag,
    clearProject,
  } = filterState;

  // 태그/프로젝트 목록 (portfolioIndex에서 직접 사용)
  const allTags = portfolioIndex?.tags ?? [];
  const allProjects = portfolioIndex?.projects ?? [];

  const hasActiveFilters = selectedTag || selectedProject || searchQuery;

  return (
    <div className="t-card flex flex-col gap-4 p-4">
      {/* 검색 */}
      <SearchInput
        defaultValue={searchQuery}
        onChange={setSearchText}
        onSubmit={commitSearch}
        placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
      />

      {/* 필터 그룹 */}
      <div className="flex flex-col gap-3">
        {/* 프로젝트 필터 */}
        <SelectableChips
          items={allProjects}
          selectedValue={selectedProject}
          onSelect={setProject}
          onReset={clearProject}
          allLabel={UI_CONSTANTS.ALL_PROJECTS_LABEL}
        />

        {/* 태그 필터 */}
        <SelectableChips
          items={allTags}
          selectedValue={selectedTag}
          onSelect={setTag}
          onReset={clearTag}
          allLabel={UI_CONSTANTS.ALL_TAGS_LABEL}
          prefix={UI_CONSTANTS.TAG_PREFIX}
        />
      </div>

      {/* 활성 필터 표시 및 초기화 */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                검색: {searchQuery}
                <button
                  onClick={() => {
                    setSearchText("");
                    commitSearch("");
                  }}
                  className="hover:opacity-70 transition-opacity"
                  aria-label="검색 초기화"
                >
                  ×
                </button>
              </span>
            )}
            {selectedProject && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                {selectedProject}
                <button
                  onClick={clearProject}
                  className="hover:opacity-70 transition-opacity"
                  aria-label="프로젝트 필터 초기화"
                >
                  ×
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20">
                {UI_CONSTANTS.TAG_PREFIX}
                {selectedTag}
                <button
                  onClick={clearTag}
                  className="hover:opacity-70 transition-opacity"
                  aria-label="태그 필터 초기화"
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <button
            onClick={() => {
              clearProject();
              clearTag();
              setSearchText("");
              commitSearch("");
            }}
            className="text-xs text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors whitespace-nowrap"
            aria-label="모든 필터 초기화"
          >
            모두 지우기
          </button>
        </div>
      )}
    </div>
  );
}
