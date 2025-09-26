import { motion } from "framer-motion";
import { stagger } from "../motion/Motion";
import type { ProjectMeta } from "../../service/portfolio";
import { ReactNode } from "react";

interface ProjectGridProps {
  projects: ProjectMeta[];
  emptyMessage?: string;
  className?: string;
  renderProject: (project: ProjectMeta) => ReactNode;
}

export function ProjectGrid({
  projects,
  emptyMessage = "프로젝트가 없습니다.",
  className = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
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
      className={className}
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
