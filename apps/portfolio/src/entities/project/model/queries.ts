import { useMemo } from "react";
import { getPortfolioIndex, getProject } from "./repository";
import type { ProjectIndex } from "./domain";

export function usePortfolioIndex(): ProjectIndex | undefined {
  const data = useMemo(() => getPortfolioIndex(), []);
  return data;
}

export function useProjectMdx(slug: string | null): string | null {
  return useMemo(() => {
    if (!slug) return null;
    const project = getProject(slug);
    return project?.content ?? null;
  }, [slug]);
}
