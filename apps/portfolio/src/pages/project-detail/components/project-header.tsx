import type { ProjectMeta } from "@/entities/project";

interface ProjectHeaderProps {
  project: ProjectMeta;
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex flex-wrap items-start gap-3 mb-4">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        {project.project && (
          <span className="t-chip text-sm">{project.project}</span>
        )}
      </div>

      <p className="text-lg text-[var(--muted-fg)] mb-4">{project.summary}</p>

      {project.tags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="t-chip">
            #{tag}
          </span>
        ))}
      </div>
      )}
    </header>
  );
}
