import type { ProjectMeta } from "../../../service/portfolio";

/**
 * 문자열이 포함되어 있는지 대소문자 구분 없이 확인하는 순수함수
 */
export function includesIgnoreCase(
  text: string | undefined | null,
  query: string,
): boolean {
  return (text ?? "").toLowerCase().includes(query.toLowerCase());
}

/**
 * 프로젝트를 필터링하는 순수함수
 */
export function filterProjects(
  projects: ProjectMeta[],
  searchQuery: string,
  selectedTag: string,
  selectedProject: string,
): ProjectMeta[] {
  const trimmedQuery = searchQuery.trim();

  return projects.filter((project) => {
    // 검색어 필터링
    const matchesSearch =
      !trimmedQuery ||
      includesIgnoreCase(project.title, trimmedQuery) ||
      includesIgnoreCase(project.summary, trimmedQuery) ||
      includesIgnoreCase(project.project ?? "", trimmedQuery);

    // 태그 필터링
    const matchesTag =
      !selectedTag || (project.tags ?? []).includes(selectedTag);

    // 프로젝트 필터링
    const matchesProject =
      !selectedProject || project.project === selectedProject;

    return matchesSearch && matchesTag && matchesProject;
  });
}
