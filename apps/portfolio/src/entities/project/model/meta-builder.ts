import { getString, getOptionalString } from "@mfe/shared";
import {
  formatProjectName,
  normalizeBoolean,
  normalizeNumber,
  normalizeTags,
} from "@/utils/normalize";
import type { FrontmatterData } from "@/components/mdx";
import type { BuildMetaParams, PathInfo, ProjectMeta } from "./types";

/**
 * 프로젝트 메타데이터 빌드 관련 모듈
 */

/**
 * 프로젝트 메타데이터를 빌드합니다
 */
export function buildProjectMeta({
  frontmatter,
  pathInfo,
  slug,
  relativePath,
  dateInfo,
}: BuildMetaParams): ProjectMeta {
  return {
    title: getString(frontmatter, "title", pathInfo.fileNameWithoutExt),
    summary: getString(frontmatter, "summary"),
    project: inferProjectName(frontmatter, pathInfo),
    tags: normalizeTags(frontmatter.tags),
    date: getString(frontmatter, "date", dateInfo.dateStr),
    slug,
    path: relativePath,
    createdAtMs: dateInfo.createdAtMs,
    id: pathInfo.fileNameWithoutExt,
    published: true,
    order: normalizeNumber(frontmatter.order),
    banner: normalizeBoolean(frontmatter.banner) ?? false,
    cover: getOptionalString(frontmatter, "cover"),
    coverAlt: getOptionalString(frontmatter, "coverAlt"),
    coverCaption: getOptionalString(frontmatter, "coverCaption"),
    coverType: getValidCoverType(frontmatter.coverType),
    coverAspectRatio: getValidCoverAspectRatio(frontmatter.coverAspectRatio),
  };
}

/**
 * Frontmatter와 경로 정보로부터 프로젝트명을 추론합니다
 */
function inferProjectName(
  frontmatter: FrontmatterData,
  pathInfo: PathInfo,
): string | undefined {
  // Frontmatter에 project가 있으면 우선 사용
  const projectFromFrontmatter = String(frontmatter.project || "").trim();
  if (projectFromFrontmatter) {
    return formatProjectName(projectFromFrontmatter);
  }

  // 폴더명에서 추론
  const { folderAfterProjects, fileName } = pathInfo;
  const isValidFolderName =
    folderAfterProjects &&
    !folderAfterProjects.includes(".") &&
    folderAfterProjects !== fileName;

  return isValidFolderName ? formatProjectName(folderAfterProjects) : undefined;
}

const VALID_COVER_TYPES = ["gif", "image", "video"] as const;
const VALID_ASPECT_RATIOS = ["16:9", "4:3", "1:1", "auto"] as const;

/**
 * 유효한 coverType을 반환합니다
 */
function getValidCoverType(
  value: unknown,
): ProjectMeta["coverType"] | undefined {
  if (typeof value === "string" && VALID_COVER_TYPES.includes(value as typeof VALID_COVER_TYPES[number])) {
    return value as ProjectMeta["coverType"];
  }
  return undefined;
}

/**
 * 유효한 coverAspectRatio를 반환합니다
 */
function getValidCoverAspectRatio(
  value: unknown,
): ProjectMeta["coverAspectRatio"] | undefined {
  if (typeof value === "string" && VALID_ASPECT_RATIOS.includes(value as typeof VALID_ASPECT_RATIOS[number])) {
    return value as ProjectMeta["coverAspectRatio"];
  }
  return undefined;
}

