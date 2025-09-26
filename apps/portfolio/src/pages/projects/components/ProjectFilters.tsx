import React from "react";
import { SearchBox, FilterChips } from "../../../components/common";
import type { ProjectMeta } from "../../../service/portfolio";

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
    () =>
      Array.from(
        new Set(portfolioIndex?.all.flatMap((p) => p.tags) ?? []),
      ).sort(),
    [portfolioIndex],
  );

  const allProjects = React.useMemo(
    () =>
      Array.from(
        new Set(
          (portfolioIndex?.all
            .map((p) => p.project)
            .filter(Boolean) as string[]) ?? [],
        ),
      ).sort(),
    [portfolioIndex],
  );

  return (
    <div className="t-card flex flex-col gap-3 p-3">
      {/* 검색 인풋 */}
      <SearchBox
        initial={searchQuery}
        onChangeText={onSearchChange}
        onCommit={onSearchCommit}
      />

      {/* 프로젝트 칩 필터 */}
      <FilterChips
        items={allProjects}
        activeItem={selectedProject}
        onItemClick={onProjectChange}
        onClearClick={onProjectClear}
        clearLabel="모든 프로젝트"
      />

      {/* 태그 칩 필터 */}
      <FilterChips
        items={allTags}
        activeItem={selectedTag}
        onItemClick={onTagChange}
        onClearClick={onTagClear}
        clearLabel="전체 태그"
        itemPrefix="#"
      />
    </div>
  );
}
