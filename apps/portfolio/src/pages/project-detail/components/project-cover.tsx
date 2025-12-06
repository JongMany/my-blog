import { useState } from "react";
import { getImageSource } from "@/utils/get-image-source";
import type { ProjectMeta } from "@/entities/project";
import { getFallbackThumbnail } from "@/utils/thumbnail";

interface ProjectCoverProps {
  project: ProjectMeta;
}

export function ProjectCover({ project }: ProjectCoverProps) {
  const [useFallback, setUseFallback] = useState(false);
  const thumbnailSrc = useFallback
    ? getFallbackThumbnail()
    : project.cover ?? getFallbackThumbnail();

  if (!thumbnailSrc) {
    return null;
  }

  const handleImageError = () => {
    if (!useFallback) {
      setUseFallback(true);
    }
  };

  return (
    <div className="mb-8 flex flex-col items-center">
      <img
        src={getImageSource(thumbnailSrc)}
        alt={project.coverAlt || project.title}
        className="h-auto rounded-lg"
        style={{ width: "min(600px, 100%)" }}
        onError={handleImageError}
      />
      {project.coverCaption && (
        <p className="text-sm text-[var(--muted-fg)] mt-2 text-center">
          {project.coverCaption}
        </p>
      )}
    </div>
  );
}
