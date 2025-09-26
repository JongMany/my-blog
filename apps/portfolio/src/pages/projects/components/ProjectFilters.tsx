import React from "react";
import { SearchBox, FilterChips } from "../../../components/common";
import type { ProjectMeta } from "../../../service/portfolio";
import { extractAllTags, extractAllProjects } from "../utils/extractors";
import { UI_CONSTANTS } from "../constants/ui";

interface ProjectFiltersProps {
  portfolioIndex: { all: ProjectMeta[] } | undefined;
  searchQuery: string;
  selectedTag: string;
  selectedProject: string;
  onSearchChange: (value: string) => void;
  onSearchCommit: (value: string) => void;
  onTagChange: (tag: string) => void;
  onProjectChange: (project: string) => void;
  onTagClear: () => void;
  onProjectClear: () => void;
}

export function ProjectFilters({
  portfolioIndex,
  searchQuery,
  selectedTag,
  selectedProject,
  onSearchChange,
  onSearchCommit,
  onTagChange,
  onProjectChange,
  onTagClear,
  onProjectClear,
}: ProjectFiltersProps) {
  // 태그/프로젝트 목록
  const allTags = React.useMemo(
    () => extractAllTags(portfolioIndex?.all ?? []),
    [portfolioIndex],
  );

  const allProjects = React.useMemo(
    () => extractAllProjects(portfolioIndex?.all ?? []),
    [portfolioIndex],
  );

  return (
    <div className="t-card flex flex-col gap-3 p-3">
      {/* 검색 인풋 */}
      <SearchBox
        initial={searchQuery}
        onChangeText={onSearchChange}
        onCommit={onSearchCommit}
        placeholder={UI_CONSTANTS.SEARCH_PLACEHOLDER}
      />

      {/* 프로젝트 칩 필터 */}
      <FilterChips
        items={allProjects}
        activeItem={selectedProject}
        onItemClick={onProjectChange}
        onClearClick={onProjectClear}
        clearLabel={UI_CONSTANTS.ALL_PROJECTS_LABEL}
      />

      {/* 태그 칩 필터 */}
      <FilterChips
        items={allTags}
        activeItem={selectedTag}
        onItemClick={onTagChange}
        onClearClick={onTagClear}
        clearLabel={UI_CONSTANTS.ALL_TAGS_LABEL}
        itemPrefix={UI_CONSTANTS.TAG_PREFIX}
      />
    </div>
  );
}
