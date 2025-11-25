import type { ProjectIndex } from "../model/types";

const TOP_PROJECTS_COUNT = 6;

/**
 * 포트폴리오 인덱스에서 상위 프로젝트를 선택하는 순수함수
 * 배너가 있는 프로젝트를 우선 선택하고, 없으면 최신 프로젝트를 반환합니다.
 */
export function selectTopProjects(
  portfolioIndex?: ProjectIndex,
): ProjectIndex["all"] {
  if (!portfolioIndex) return [];

  const banners = portfolioIndex.all
    .filter((project) => project.banner)
    .slice(0, TOP_PROJECTS_COUNT);

  if (banners.length) {
    return banners;
  }

  return portfolioIndex.all.slice(0, TOP_PROJECTS_COUNT);
}

