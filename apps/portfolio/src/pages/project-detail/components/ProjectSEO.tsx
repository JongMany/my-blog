import { SEO } from "@srf/ui";
import { createProjectImageUrl, createProjectDetailUrl } from "../utils/urls";
import type { ProjectMeta } from "../../../entities/project";

interface ProjectSEOProps {
  project: ProjectMeta;
}

export function ProjectSEO({ project }: ProjectSEOProps) {
  const imageUrl = project.cover
    ? createProjectImageUrl(project.cover)
    : undefined;
  const detailUrl = createProjectDetailUrl(project.slug);

  return (
    <SEO
      title={project.title}
      description={project.summary}
      keywords={project.tags.join(", ")}
      url={detailUrl}
      type="article"
      image={imageUrl}
    />
  );
}
