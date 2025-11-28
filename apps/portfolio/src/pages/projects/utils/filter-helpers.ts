import type { ProjectIndex } from "@/entities/project";
import { ProjectExtractor } from "@/entities/project/utils";

/**
 * 선택된 프로젝트에 속한 태그 목록을 반환합니다.
 */
export function getTagsForSelectedProject(
  portfolioIndex: ProjectIndex | undefined,
  selectedProject: string,
): string[] {
  if (!portfolioIndex) return [];
  if (!selectedProject) return portfolioIndex.tags;

  const projects = portfolioIndex.byProject[selectedProject] ?? [];
  return ProjectExtractor.extractAllTags(projects);
}

/**
 * 선택된 태그가 현재 프로젝트에 유효한지 검증합니다.
 */
export function isValidTagForProject(
  portfolioIndex: ProjectIndex | undefined,
  selectedProject: string,
  selectedTag: string,
): boolean {
  if (!selectedTag || !selectedProject || !portfolioIndex) return true;
  
  const tagsInProject = getTagsForSelectedProject(
    portfolioIndex,
    selectedProject,
  );
  return tagsInProject.includes(selectedTag);
}

