import { ProjectGrid } from "../../../components/common";
import { ProjectCard } from "../../../components/project-card";
import type { ProjectMeta } from "../../../service/portfolio";

interface ProjectListProps {
  projects: ProjectMeta[];
  emptyMessage?: string;
}

export function ProjectList({
  projects,
  emptyMessage = "조건에 맞는 프로젝트가 없습니다.",
}: ProjectListProps) {
  return (
    <ProjectGrid
      projects={projects}
      emptyMessage={emptyMessage}
      renderProject={(project) => <ProjectCard p={project} />}
    />
  );
}
