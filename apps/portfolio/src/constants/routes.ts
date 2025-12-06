/**
 * 라우트 경로 관련 상수들
 */
export const ROUTE_PATHS = {
  HOME: "/portfolio",
  PROJECTS: "/portfolio/projects",
  PROJECT_DETAIL: (slug: string) => `/portfolio/projects/${slug}`,
} as const;

/**
 * 라우트 경로 세그먼트
 */
export const ROUTE_SEGMENTS = {
  PROJECTS: "projects",
  SLUG_PARAM: ":slug",
} as const;

