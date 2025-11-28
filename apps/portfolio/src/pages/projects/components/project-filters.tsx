import {
  SearchFilter,
  ProjectFilter,
  TagFilter,
  ActiveFilters,
} from "./filters";
import type { useProjectFilters } from "../hooks/use-project-filters";

interface ProjectFiltersProps {
  filterState: ReturnType<typeof useProjectFilters>;
}

export function ProjectFilters({ filterState }: ProjectFiltersProps) {
  const {
    searchQuery,
    selectedTag,
    selectedProject,
    allProjects,
    availableTags,
    setSearchText,
    commitSearch,
    setTag,
    setProject,
    clearTag,
    clearProject,
    clearAllFilters,
  } = filterState;

  const handleClearSearch = () => {
    setSearchText("");
    commitSearch("");
  };

  return (
    <div className="t-card flex flex-col gap-4 p-4">
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={setSearchText}
        onSearchCommit={commitSearch}
      />

      <div className="flex flex-col gap-3">
        <ProjectFilter
          projects={allProjects}
          selectedProject={selectedProject}
          onSelect={setProject}
          onReset={clearProject}
        />

        <TagFilter
          availableTags={availableTags}
          selectedTag={selectedTag}
          onSelect={setTag}
          onReset={clearTag}
        />
      </div>

      <ActiveFilters
        searchQuery={searchQuery}
        selectedProject={selectedProject}
        selectedTag={selectedTag}
        onClearSearch={handleClearSearch}
        onClearProject={clearProject}
        onClearTag={clearTag}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
