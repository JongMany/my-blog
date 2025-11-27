import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { imageSource } from "@mfe/shared";
import {
  getFallbackThumbnail,
  getThumbnailAspectRatio,
  ProjectMeta,
} from "../../entities/project";

const HOVER_ANIMATION = {
  whileHover: { y: -4, scale: 1.01 },
  transition: { type: "spring", stiffness: 260, damping: 18 },
} as const;

interface ProjectCardProps {
  project: ProjectMeta;
  maxTags?: number;
  showImage?: boolean;
}

export function ProjectCard({
  project,
  maxTags = 3,
  showImage = true,
}: ProjectCardProps) {
  const tags = project.tags ?? [];
  const visibleTags = tags.slice(0, maxTags);
  const remainingTagCount = tags.length - visibleTags.length;

  const [useFallback, setUseFallback] = useState(false);
  const imageSrc = useFallback
    ? getFallbackThumbnail()
    : (project.cover ?? getFallbackThumbnail());

  const handleImageError = () => {
    if (!useFallback) {
      setUseFallback(true);
    }
  };

  return (
    <li className="h-full">
      <Link
        to={`/portfolio/projects/${project.slug}`}
        className="group block h-full no-underline hover:no-underline focus-visible:outline-none focus-visible:[box-shadow:var(--ring)] [&_*]:no-underline [&_*]:hover:no-underline"
        aria-label={`${project.title} 상세 보기`}
      >
        <motion.article
          {...HOVER_ANIMATION}
          className="t-card h-full overflow-hidden"
        >
          {showImage && imageSrc && (
            <div
              className={`relative ${getThumbnailAspectRatio(project.coverAspectRatio)} overflow-hidden`}
            >
              <img
                src={imageSource(imageSrc, "portfolio", {
                  isDevelopment: import.meta.env.MODE === "development",
                })}
                alt={project.coverAlt || project.title}
                loading="lazy"
                decoding="async"
                onError={handleImageError}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {project.project && (
                <span className="absolute right-2 top-2 t-chip text-[10px]">
                  {project.project}
                </span>
              )}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,.06) 40%, rgba(0,0,0,.12))",
                }}
              />
            </div>
          )}

          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-medium leading-tight">
                {project.title}
              </h3>
              {!project.cover && project.project && (
                <div className="text-xs text-[var(--muted-fg)]">
                  {project.project}
                </div>
              )}
            </div>

            {project.summary && (
              <p className="mt-2 text-sm leading-5 line-clamp-2 min-h-[2.5rem]">
                {project.summary}
              </p>
            )}

            {!!tags.length && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {visibleTags.map((tag) => (
                  <span key={tag} className="t-chip">
                    #{tag}
                  </span>
                ))}
                {remainingTagCount > 0 && (
                  <span className="t-chip text-xs">+{remainingTagCount}</span>
                )}
              </div>
            )}
          </div>
        </motion.article>
      </Link>
    </li>
  );
}
