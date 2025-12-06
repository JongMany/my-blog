import { ProjectGrid, ProjectCard } from "@/components/common";
import { SectionHeader } from "./section-header";
import type { ProjectMeta } from "@/entities/project";

interface SelectedProjectsProps {
  projects: ProjectMeta[];
}

export function SelectedProjects({ projects }: SelectedProjectsProps) {
  return (
    <section className="space-y-3">
      <SectionHeader title="주요 프로젝트" />
      <ProjectGrid
        projects={projects}
        renderProject={(project) => <ProjectCard project={project} />}
      />
    </section>
  );
}
