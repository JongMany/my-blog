/**
 * 파일 경로 및 패턴 관련 상수들
 */
export const FILE_PATHS = {
  PROJECTS_CONTENT_PATTERN: "../../../contents/projects/**/*.{md,mdx}",
  ERROR_ILLUSTRATION: "/404.svg",
  THUMBNAIL_BASE: "/projects/thumbnails",
  THUMBNAIL_GIFS: "/projects/thumbnails/gifs",
  THUMBNAIL_IMAGES: "/projects/thumbnails/images",
  THUMBNAIL_FALLBACKS: "/projects/thumbnails/fallbacks",
  FALLBACK_THUMBNAIL: "/projects/thumbnails/fallbacks/http_fallback_thumbnail.png",
} as const;

