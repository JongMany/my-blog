import { usePortfolioIndex } from "../../entities/project";
import { LoadingSpinner } from "../../components/common";
import { ProjectFilters, ProjectList } from "./components";
import { useProjectFilters } from "./hooks/use-project-filters";

export default function Projects() {
  const portfolioIndex = usePortfolioIndex();
  const filterState = useProjectFilters(portfolioIndex);

  if (!portfolioIndex) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <ProjectFilters filterState={filterState} />
      <ProjectList projects={filterState.filteredProjects} />
    </div>
  );
}
