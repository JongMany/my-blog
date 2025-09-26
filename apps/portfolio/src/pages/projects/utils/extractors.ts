import type { ProjectMeta } from "../../../service/portfolio";

/**
 * 프로젝트 목록에서 모든 태그를 추출하는 순수함수
 */
export function extractAllTags(projects: ProjectMeta[]): string[] {
  return Array.from(new Set(projects.flatMap((p) => p.tags ?? []))).sort();
}

/**
 * 프로젝트 목록에서 모든 프로젝트명을 추출하는 순수함수
 */
export function extractAllProjects(projects: ProjectMeta[]): string[] {
  return Array.from(
    new Set(projects.map((p) => p.project).filter(Boolean) as string[]),
  ).sort();
}
