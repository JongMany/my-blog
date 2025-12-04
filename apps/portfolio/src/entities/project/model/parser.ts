import { isString, parseFrontmatter } from "@mfe/shared";
import { normalizeBoolean } from "@/utils/normalize";
import { normalizeFilePath } from "@/utils/path";
import type { FrontmatterData } from "@/components/mdx";
import type { DateInfo, PathInfo, ProjectDocument } from "./types";
import { buildProjectMeta } from "./meta-builder";

/**
 * 프로젝트 문서 파싱 관련 모듈
 */

/**
 * 파일 경로에서 프로젝트 문서를 생성합니다
 */
export function createProjectDocument(
  filePath: string,
  rawContent: string,
): ProjectDocument | null {
  const { data: frontmatter, content } = parseFrontmatter(rawContent);
  const pathInfo = extractPathInfo(filePath);
  const dateInfo = extractDateInfo(frontmatter);

  // published가 false면 null 반환
  if (!extractPublished(frontmatter)) {
    return null;
  }

  const slug =
    isString(frontmatter.slug) ? frontmatter.slug : pathInfo.fileNameWithoutExt;

  const meta = buildProjectMeta({
    frontmatter,
    pathInfo,
    slug,
    relativePath: normalizeFilePath(filePath),
    dateInfo,
  });

  return { slug, content, meta };
}

/**
 * 파일 경로에서 경로 정보를 추출합니다
 */
function extractPathInfo(filePath: string): PathInfo {
  const pathParts = filePath.split("/");
  const fileName = pathParts.at(-1) ?? "";
  const projectsIndex = pathParts.findIndex((part) => part === "projects");

  return {
    fileName,
    fileNameWithoutExt: fileName.replace(/\.(md|mdx)$/, ""),
    folderAfterProjects:
      projectsIndex >= 0 && projectsIndex < pathParts.length - 2
        ? pathParts[projectsIndex + 1]
        : undefined,
  };
}

/**
 * Frontmatter에서 날짜 정보를 추출합니다
 */
function extractDateInfo(frontmatter: FrontmatterData): DateInfo {
  const dateValue = frontmatter.date;
  const dateStr = isString(dateValue) ? dateValue : new Date().toISOString();

  return {
    dateStr,
    createdAtMs: new Date(dateStr).getTime(),
  };
}

/**
 * Frontmatter에서 published 여부를 추출합니다
 */
function extractPublished(frontmatter: FrontmatterData): boolean {
  return (
    normalizeBoolean(frontmatter.publish) ??
    normalizeBoolean(frontmatter.published) ??
    true
  );
}

