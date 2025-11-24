import { usePortfolioIndex } from "../../entities/project";
import { LoadingSpinner } from "../../components/common";
import { ProjectFilters, ProjectList, useProjectFilters } from "./components";

export default function Projects() {
  const portfolioIndex = usePortfolioIndex();

  const {
    searchQuery,
    selectedTag,
    selectedProject,
    filteredProjects,
    setSearchText,
    setSearchCommit,
    setTag,
    setProject,
    clearTag,
    clearProject,
  } = useProjectFilters(portfolioIndex);

  if (!portfolioIndex) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <ProjectFilters
        portfolioIndex={portfolioIndex}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
        selectedProject={selectedProject}
        onSearchChange={setSearchText}
        onSearchCommit={setSearchCommit}
        onTagChange={setTag}
        onProjectChange={setProject}
        onTagClear={clearTag}
        onProjectClear={clearProject}
      />

      <ProjectList projects={filteredProjects} />
    </div>
  );
}
