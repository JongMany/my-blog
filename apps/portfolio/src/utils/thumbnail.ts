import { FILE_PATHS } from "@/constants/file-paths";
import { FILE_EXTENSIONS, IMAGE_EXTENSIONS } from "@/constants/file-extensions";

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
    return `${FILE_PATHS.THUMBNAIL_BASE}/${cover}`;
  }

  if (fileExtension === FILE_EXTENSIONS.GIF) {
    return `${FILE_PATHS.THUMBNAIL_GIFS}/${cover}`;
  }

  if (IMAGE_EXTENSIONS.includes(fileExtension as typeof IMAGE_EXTENSIONS[number])) {
    return `${FILE_PATHS.THUMBNAIL_IMAGES}/${cover}`;
  }

  return `${FILE_PATHS.THUMBNAIL_BASE}/${cover}`;
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
  return FILE_PATHS.FALLBACK_THUMBNAIL;
};
