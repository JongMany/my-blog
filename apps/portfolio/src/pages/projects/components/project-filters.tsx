import { useMemo } from "react";
import { SearchInput, SelectableChips } from "../../../components/common";
import type { ProjectMeta } from "../../../entities/project";
import {
  extractAllTags,
  extractAllProjects,
} from "../../../entities/project/utils";
import { UI_CONSTANTS } from "../constants/ui";
import type { useProjectFilters } from "../hooks/use-project-filters";

interface ProjectFiltersProps {
  portfolioIndex: { all: ProjectMeta[] } | undefined;
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

  // 태그/프로젝트 목록
  const allTags = useMemo(
    () => extractAllTags(portfolioIndex?.all ?? []),
    [portfolioIndex],
  );

  const allProjects = useMemo(
    () => extractAllProjects(portfolioIndex?.all ?? []),
    [portfolioIndex],
  );

  return (
    <div className="t-card flex flex-col gap-3 p-3">
      {/* 검색 인풋 */}
      <SearchInput
        defaultValue={searchQuery}
        onChange={setSearchText}
        onSubmit={commitSearch}
        placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
      />

      {/* 프로젝트 칩 필터 */}
      <SelectableChips
        items={allProjects}
        selectedValue={selectedProject}
        onSelect={setProject}
        onReset={clearProject}
        allLabel={UI_CONSTANTS.ALL_PROJECTS_LABEL}
      />

      {/* 태그 칩 필터 */}
      <SelectableChips
        items={allTags}
        selectedValue={selectedTag}
        onSelect={setTag}
        onReset={clearTag}
        allLabel={UI_CONSTANTS.ALL_TAGS_LABEL}
        prefix={UI_CONSTANTS.TAG_PREFIX}
      />
    </div>
  );
}
