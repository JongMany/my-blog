import { getThumbnailPath } from "@/utils/thumbnail";
import { URL_CONSTANTS } from "@/pages/project-detail/constants/urls";
import { ROUTE_SEGMENTS } from "@/constants/routes";

/**
 * 프로젝트 SEO 이미지 URL을 생성하는 순수함수
 */
export function createProjectImageUrl(cover: string): string {
  return `${URL_CONSTANTS.BASE_URL}${getThumbnailPath(cover)}`;
}

/**
 * 프로젝트 상세 페이지 URL을 생성하는 순수함수
 */
export function createProjectDetailUrl(slug: string): string {
  return `${URL_CONSTANTS.BASE_URL}/${ROUTE_SEGMENTS.PROJECTS}/${slug}`;
}
