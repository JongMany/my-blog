import { ProjectGrid } from "../../../components/common";
import { SectionHeader } from "./SectionHeader";
import type { ProjectMeta } from "../../../entities/project";
import { ProjectCard } from "../../../components/project-card";

interface SelectedProjectsProps {
  projects: ProjectMeta[];
}

export function SelectedProjects({ projects }: SelectedProjectsProps) {
  return (
    <section className="space-y-3">
      <SectionHeader
        title="Selected Projects"
        linkTo="/portfolio/projects"
        linkText="전체 보기"
      />
      <ProjectGrid
        projects={projects}
        renderProject={(project) => <ProjectCard p={project} />}
      />
    </section>
  );
}
