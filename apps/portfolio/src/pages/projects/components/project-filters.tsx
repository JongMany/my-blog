import { useMemo, useEffect, useCallback, useState } from "react";
import { cn } from "@srf/ui";
import { SearchInput, SelectableChips } from "../../../components/common";
import type { ProjectIndex } from "../../../entities/project";
import { ProjectExtractor } from "../../../entities/project/utils";
import { UI_CONSTANTS } from "../constants/ui";
import type { useProjectFilters } from "../hooks/use-project-filters";

interface ProjectFiltersProps {
  portfolioIndex: ProjectIndex | undefined;
  filterState: ReturnType<typeof useProjectFilters>;
}

const BADGE_STYLE =
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20";

/**
 * 선택된 프로젝트에 속한 프로젝트 목록을 반환합니다.
 */
function getProjectsForSelectedProject(
  portfolioIndex: ProjectIndex | undefined,
  selectedProject: string,
) {
  if (!portfolioIndex || !selectedProject) return [];
  return portfolioIndex.byProject[selectedProject] ?? [];
}

/**
 * 선택된 프로젝트에 속한 태그 목록을 반환합니다.
 */
function getTagsForSelectedProject(
  portfolioIndex: ProjectIndex | undefined,
  selectedProject: string,
): string[] {
  if (!portfolioIndex) return [];

  if (selectedProject) {
    const projects = getProjectsForSelectedProject(
      portfolioIndex,
      selectedProject,
    );
    return ProjectExtractor.extractAllTags(projects);
  }

  return portfolioIndex.tags;
}

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
    <span className={`${BADGE_STYLE} cursor-default`}>
      {label}
      <button
        onClick={onClear}
        type="button"
        className="hover:opacity-70 transition-opacity cursor-pointer"
        aria-label={ariaLabel}
      >
        ×
      </button>
    </span>
  );
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
    clearAllFilters,
  } = filterState;

  const allProjects = portfolioIndex?.projects ?? [];

  // 태그 목록: 프로젝트가 선택되면 해당 프로젝트의 태그만, 아니면 전체 태그
  const availableTags = useMemo(
    () => getTagsForSelectedProject(portfolioIndex, selectedProject),
    [portfolioIndex, selectedProject],
  );

  // 태그 목록 변경 시 opacity transition을 위한 상태
  const [tagsOpacity, setTagsOpacity] = useState(1);
  const [displayedTags, setDisplayedTags] = useState<string[]>([]);

  // 프로젝트가 변경되면 태그 목록을 fade out/in으로 전환
  useEffect(() => {
    // 초기 로드 시 바로 표시
    if (displayedTags.length === 0) {
      setDisplayedTags(availableTags);
      setTagsOpacity(1);
      return;
    }

    // 태그 목록이 변경되었는지 확인 (배열 내용 비교)
    const tagsChanged =
      displayedTags.length !== availableTags.length ||
      displayedTags.some((tag, index) => tag !== availableTags[index]);

    if (tagsChanged) {
      // 태그 목록이 변경되면 fade out
      setTagsOpacity(0);

      // fade out 후 태그 목록 업데이트 및 fade in
      const timer = setTimeout(() => {
        setDisplayedTags(availableTags);
        setTagsOpacity(1);
      }, 150); // fade out 시간

      return () => clearTimeout(timer);
    }
  }, [availableTags, displayedTags]);

  // 프로젝트가 변경되면, 선택된 태그가 새로운 프로젝트에 없으면 태그 초기화
  useEffect(() => {
    if (!selectedTag || !selectedProject || !portfolioIndex) return;

    const tagsInSelectedProject = getTagsForSelectedProject(
      portfolioIndex,
      selectedProject,
    );

    if (!tagsInSelectedProject.includes(selectedTag)) {
      clearTag();
    }
  }, [selectedProject, selectedTag, portfolioIndex, clearTag]);

  const hasActiveFilters = Boolean(
    selectedTag || selectedProject || searchQuery,
  );

  return (
    <div className="t-card flex flex-col gap-4 p-4">
      {/* 검색 */}
      <SearchInput
        key={searchQuery}
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
        <div className="flex flex-wrap gap-1.5">
          {/* 전체 태그 버튼 - transition 없이 항상 표시 */}
          <button
            type="button"
            className={cn(
              "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer",
              "border transition-colors duration-300 ease-in-out",
              !selectedTag
                ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold"
                : "bg-[var(--surface)] text-[var(--muted-fg)] border-transparent hover:bg-[var(--hover-bg)] hover:text-[var(--fg)]",
            )}
            onClick={clearTag}
          >
            {UI_CONSTANTS.ALL_TAGS_LABEL}
          </button>
          {/* 나머지 태그 칩들 - opacity transition 적용 */}
          {displayedTags.map((item) => {
            const isSelected = selectedTag === item;
            return (
              <button
                key={item}
                type="button"
                style={{ opacity: tagsOpacity }}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer",
                  "border transition-all duration-300 ease-in-out",
                  isSelected
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold"
                    : "bg-transparent text-[var(--muted-fg)] border-[var(--border)] hover:bg-[var(--hover-bg)] hover:text-[var(--fg)] hover:border-[var(--primary)]/30",
                )}
                onClick={() => setTag(item)}
                aria-pressed={isSelected}
              >
                {UI_CONSTANTS.TAG_PREFIX}
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* 활성 필터 표시 및 초기화 */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--border)]">
          <div className="flex items-center gap-2 flex-wrap">
            {searchQuery && (
              <ActiveFilterBadge
                label={`검색: ${searchQuery}`}
                onClear={() => {
                  setSearchText("");
                  commitSearch("");
                }}
                ariaLabel="검색 초기화"
              />
            )}
            {selectedProject && (
              <ActiveFilterBadge
                label={selectedProject}
                onClear={clearProject}
                ariaLabel="프로젝트 필터 초기화"
              />
            )}
            {selectedTag && (
              <ActiveFilterBadge
                label={`${UI_CONSTANTS.TAG_PREFIX}${selectedTag}`}
                onClear={clearTag}
                ariaLabel="태그 필터 초기화"
              />
            )}
          </div>
          <button
            type="button"
            onClick={clearAllFilters}
            className="text-xs text-[var(--muted-fg)] hover:text-[var(--fg)] transition-colors whitespace-nowrap cursor-pointer"
            aria-label="모든 필터 초기화"
          >
            모두 지우기
          </button>
        </div>
      )}
    </div>
  );
}
