import { useState } from "react";
import { imageSource } from "@mfe/shared";
import { getFallbackThumbnail, type ProjectMeta } from "../../../entities/project";

interface ProjectCoverProps {
  project: ProjectMeta;
}

export function ProjectCover({ project }: ProjectCoverProps) {
  const [useFallback, setUseFallback] = useState(false);
  const imageSrc = useFallback
    ? getFallbackThumbnail()
    : (project.cover ?? getFallbackThumbnail());

  if (!imageSrc) {
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
        src={imageSource(imageSrc, "portfolio", {
          isDevelopment: import.meta.env.MODE === "development",
        })}
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
