/**
 * 파일 확장자 관련 상수들
 */
export const FILE_EXTENSIONS = {
  GIF: "gif",
  JPG: "jpg",
  JPEG: "jpeg",
  PNG: "png",
  WEBP: "webp",
  AVIF: "avif",
  MD: "md",
  MDX: "mdx",
} as const;

/**
 * 이미지 확장자 목록
 */
export const IMAGE_EXTENSIONS = [
  FILE_EXTENSIONS.JPG,
  FILE_EXTENSIONS.JPEG,
  FILE_EXTENSIONS.PNG,
  FILE_EXTENSIONS.WEBP,
  FILE_EXTENSIONS.AVIF,
] as const;

