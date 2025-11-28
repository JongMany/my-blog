import { SelectableChips } from "@/components/common";
import { UI_CONSTANTS } from "@/pages/projects/constants/ui";

interface ProjectFilterProps {
  projects: string[];
  selectedProject: string;
  onSelect: (project: string) => void;
  onReset: () => void;
}

export function ProjectFilter({
  projects,
  selectedProject,
  onSelect,
  onReset,
}: ProjectFilterProps) {
  return (
    <SelectableChips
      items={projects}
      selectedValue={selectedProject}
      onSelect={onSelect}
      onReset={onReset}
      allLabel={UI_CONSTANTS.ALL_PROJECTS_LABEL}
    />
  );
}

