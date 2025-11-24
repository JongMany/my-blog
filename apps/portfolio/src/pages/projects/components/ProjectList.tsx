import { ProjectGrid, ProjectCard } from "../../../components/common";
import type { ProjectMeta } from "../../../entities/project";
import { MESSAGE_CONSTANTS } from "../constants/messages";

interface ProjectListProps {
  projects: ProjectMeta[];
  emptyMessage?: string;
}

export function ProjectList({
  projects,
  emptyMessage = MESSAGE_CONSTANTS.EMPTY_MESSAGE,
}: ProjectListProps) {
  return (
    <ProjectGrid
      projects={projects}
      emptyMessage={emptyMessage}
      renderProject={(project) => <ProjectCard project={project} />}
    />
  );
}
