import { useMemo, useEffect } from "react";
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

const TAG_BUTTON_BASE =
  "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-all duration-300 ease-in-out";

const TAG_BUTTON_SELECTED =
  "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/30 font-semibold";

const TAG_BUTTON_UNSELECTED =
  "bg-transparent text-[var(--muted-fg)] border-[var(--border)] hover:bg-[var(--hover-bg)] hover:text-[var(--fg)] hover:border-[var(--primary)]/30";

function getTagsForSelectedProject(
  portfolioIndex: ProjectIndex | undefined,
  selectedProject: string,
): string[] {
  if (!portfolioIndex) return [];
  if (!selectedProject) return portfolioIndex.tags;

  const projects = portfolioIndex.byProject[selectedProject] ?? [];
  return ProjectExtractor.extractAllTags(projects);
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

interface TagButtonProps {
  tag: string;
  isSelected: boolean;
  onClick: () => void;
  showAnimation?: boolean;
  showPrefix?: boolean;
}

function TagButton({
  tag,
  isSelected,
  onClick,
  showAnimation = false,
  showPrefix = true,
}: TagButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        TAG_BUTTON_BASE,
        showAnimation && "animate-fade-in",
        isSelected ? TAG_BUTTON_SELECTED : TAG_BUTTON_UNSELECTED,
      )}
      aria-pressed={isSelected}
    >
      {showPrefix && UI_CONSTANTS.TAG_PREFIX}
      {tag}
    </button>
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
  const availableTags = useMemo(
    () => getTagsForSelectedProject(portfolioIndex, selectedProject),
    [portfolioIndex, selectedProject],
  );
  const tagsKey = useMemo(() => availableTags.join(","), [availableTags]);
  const hasActiveFilters = Boolean(
    selectedTag || selectedProject || searchQuery,
  );

  useEffect(() => {
    if (!selectedTag || !selectedProject || !portfolioIndex) return;
    const tagsInProject = getTagsForSelectedProject(
      portfolioIndex,
      selectedProject,
    );
    if (!tagsInProject.includes(selectedTag)) {
      clearTag();
    }
  }, [selectedProject, selectedTag, portfolioIndex, clearTag]);

  return (
    <div className="t-card flex flex-col gap-4 p-4">
      <SearchInput
        key={searchQuery}
        defaultValue={searchQuery}
        onChange={setSearchText}
        onSubmit={commitSearch}
        placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
      />

      <div className="flex flex-col gap-3">
        <SelectableChips
          items={allProjects}
          selectedValue={selectedProject}
          onSelect={setProject}
          onReset={clearProject}
          allLabel={UI_CONSTANTS.ALL_PROJECTS_LABEL}
        />

        <div className="flex flex-wrap gap-1.5">
          <TagButton
            tag={UI_CONSTANTS.ALL_TAGS_LABEL}
            isSelected={!selectedTag}
            onClick={clearTag}
            showPrefix={false}
          />
          <div key={tagsKey} className="contents">
            {availableTags.map((tag) => (
              <TagButton
                key={tag}
                tag={tag}
                isSelected={selectedTag === tag}
                onClick={() => setTag(tag)}
                showAnimation
              />
            ))}
          </div>
        </div>
      </div>

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
