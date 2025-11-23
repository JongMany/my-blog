import { useMemo } from "react";
import { getPortfolioIndex, getProject } from "./repository";
import type { ProjectIndex } from "./domain";

export function usePortfolioIndex(): {
  data: ProjectIndex | undefined;
  isLoading: false;
  isError: false;
  error: null;
} {
  const data = useMemo(() => getPortfolioIndex(), []);

  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
  };
}

export function useProjectMdx(slug: string | null): {
  data: string | null;
  isLoading: false;
  isError: false;
  error: null;
} {
  const data = useMemo(() => {
    if (!slug) return null;
    const project = getProject(slug);
    return project?.content ?? null;
  }, [slug]);

  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
  };
}

