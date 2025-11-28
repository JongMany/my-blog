import type { ProjectMeta } from "../model/types";
import { contains } from "../../../utils/string";

interface FilterOptions {
  searchQuery?: string;
  selectedTag?: string;
  selectedProject?: string;
}

/**
 * 프로젝트를 필터링하는 순수함수
 *
 * @param projects - 필터링할 프로젝트 목록
 * @param options - 필터 옵션
 * @param options.searchQuery - 검색어 (제목, 요약, 프로젝트명에서 검색)
 * @param options.selectedTag - 선택된 태그
 * @param options.selectedProject - 선택된 프로젝트명
 * @returns 필터링된 프로젝트 목록
 */
export function filterProjects(
  projects: ProjectMeta[],
  options: FilterOptions,
): ProjectMeta[] {
  const { searchQuery = "", selectedTag = "", selectedProject = "" } = options;

  let result = projects;

  // 검색어 필터링
  if (searchQuery.trim()) {
    const query = searchQuery.trim();
    result = result.filter((project) => {
      const target = [
        project.title,
        project.summary,
        project.project ?? "",
      ].join(" ");
      return contains(target, query, { ignoreCase: true });
    });
  }

  // 태그 필터링
  if (selectedTag) {
    result = result.filter((project) => project.tags.includes(selectedTag));
  }

  // 프로젝트 필터링
  if (selectedProject) {
    result = result.filter((project) => project.project === selectedProject);
  }

  return result;
}
