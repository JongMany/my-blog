/**
 * 썸네일 관련 유틸리티 함수들
 */

/**
 * 썸네일 이미지 경로를 생성합니다.
 * 절대 경로나 URL인 경우 그대로 반환하고,
 * 파일 확장자에 따라 적절한 경로를 생성합니다.
 */
export const getThumbnailPath = (cover?: string): string => {
  if (!cover) return "";

  const isAbsolutePath = cover.startsWith("/");
  const isUrl = cover.startsWith("http");
  if (isAbsolutePath || isUrl) {
    return cover;
  }

  const fileExtension = cover.split(".").pop()?.toLowerCase();
  if (!fileExtension) {
    return `/projects/thumbnails/${cover}`;
  }

  if (fileExtension === "gif") {
    return `/projects/thumbnails/gifs/${cover}`;
  }

  const imageExtensions = ["jpg", "jpeg", "png", "webp", "avif"];
  if (imageExtensions.includes(fileExtension)) {
    return `/projects/thumbnails/images/${cover}`;
  }

  return `/projects/thumbnails/${cover}`;
};

/**
 * 썸네일의 aspect ratio에 맞는 Tailwind CSS 클래스를 반환합니다.
 */
export const getThumbnailAspectRatio = (aspectRatio?: string): string => {
  switch (aspectRatio) {
    case "16:9":
      return "aspect-[16/9]";
    case "4:3":
      return "aspect-[4/3]";
    case "1:1":
      return "aspect-square";
    case "auto":
      return "aspect-auto";
    default:
      return "aspect-[16/9]";
  }
};

/**
 * 기본 썸네일 경로를 반환합니다.
 */
export const getFallbackThumbnail = (): string => {
  return "/projects/thumbnails/fallbacks/http_fallback_thumbnail.png";
};
