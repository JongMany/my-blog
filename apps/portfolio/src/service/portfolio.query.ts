import { useQuery } from "@tanstack/react-query";
import { fetchPortfolioIndex, fetchProjectMdx } from "./portfolio";

export function usePortfolioIndex() {
  return useQuery({
    queryKey: ["portfolio-index"],
    queryFn: fetchPortfolioIndex,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export function useProjectMdx(path: string | null) {
  return useQuery({
    queryKey: ["portfolio", "mdx", path],
    queryFn: () =>
      path
        ? fetchProjectMdx(path)
        : Promise.reject(new Error("No path provided")),
    enabled: !!path,
  });
}
