import { ProjectGrid } from "../../../components/common";
import { ProjectCard } from "../../../components/project-card";
import type { ProjectMeta } from "../../../service/portfolio";
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
      renderProject={(project) => <ProjectCard p={project} />}
    />
  );
}
