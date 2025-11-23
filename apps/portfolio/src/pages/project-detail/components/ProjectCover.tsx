import { imageSource } from "@mfe/shared";
import type { ProjectMeta } from "../../../entities/project";

interface ProjectCoverProps {
  project: ProjectMeta;
}

export function ProjectCover({ project }: ProjectCoverProps) {
  if (!project.cover) {
    return null;
  }

  return (
    <div className="mb-8">
      <img
        src={imageSource(project.cover, "portfolio", {
          isDevelopment: import.meta.env.MODE === "development",
        })}
        alt={project.coverAlt || project.title}
        className="w-full h-auto rounded-lg"
      />
      {project.coverCaption && (
        <p className="text-sm text-[var(--muted-fg)] mt-2 text-center">
          {project.coverCaption}
        </p>
      )}
    </div>
  );
}
