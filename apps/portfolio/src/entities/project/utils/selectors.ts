import type { ProjectIndex } from "../model/types";

const TOP_PROJECTS_COUNT = 6;

/**
 * 포트폴리오 인덱스에서 상위 프로젝트를 선택하는 순수함수
 *
 * 배너가 있는 프로젝트를 우선 선택하고, 배너가 있는 프로젝트가 없으면
 * 최신 프로젝트를 반환합니다.
 *
 * @param portfolioIndex - 포트폴리오 인덱스 (선택적)
 * @returns 선택된 프로젝트 목록 (최대 TOP_PROJECTS_COUNT개)
 */
export function selectTopProjects(
  portfolioIndex?: ProjectIndex,
): ProjectIndex["all"] {
  if (!portfolioIndex) return [];

  const projectsWithBanner = portfolioIndex.all.filter(
    (project) => project.banner,
  );

  if (projectsWithBanner.length > 0) {
    return projectsWithBanner.slice(0, TOP_PROJECTS_COUNT);
  }

  return portfolioIndex.all.slice(0, TOP_PROJECTS_COUNT);
}
