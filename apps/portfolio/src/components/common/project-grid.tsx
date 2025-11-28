import { motion } from "framer-motion";
import type { ProjectMeta } from "@/entities/project";
import { ReactNode } from "react";
import { stagger } from "@/utils/motion";
import { cn } from "@srf/ui";

interface ProjectGridProps {
  projects: ProjectMeta[];
  emptyMessage?: string;
  className?: string;
  renderProject: (project: ProjectMeta) => ReactNode;
}

export function ProjectGrid({
  projects,
  emptyMessage = "프로젝트가 없습니다.",
  className,
  renderProject,
}: ProjectGridProps) {
  if (projects.length === 0) {
    return <div className="text-sm text-[var(--muted-fg)]">{emptyMessage}</div>;
  }

  return (
    <motion.ul
      variants={stagger}
      initial="hidden"
      animate="show"
      className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}
    >
      {projects.map((project) => (
        <motion.div
          key={project.slug}
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 },
          }}
        >
          {renderProject(project)}
        </motion.div>
      ))}
    </motion.ul>
  );
}
