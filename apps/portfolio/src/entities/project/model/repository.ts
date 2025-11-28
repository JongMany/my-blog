import { getDocuments } from "./loader";
import { findProjectBySlug, buildProjectIndex } from "./catalog";
import type { ProjectDocument, ProjectIndex } from "./types";

/**
 * 프로젝트 데이터 접근을 위한 리포지토리
 */

/**
 * 모든 프로젝트 문서를 반환합니다
 */
export function getProjects(): ProjectDocument[] {
  return getDocuments();
}

/**
 * slug로 프로젝트 문서를 찾습니다
 */
export function getProject(slug: string): ProjectDocument | undefined {
  return findProjectBySlug(getDocuments(), slug);
}

/**
 * 프로젝트 인덱스를 반환합니다
 */
export function getPortfolioIndex(): ProjectIndex {
  return buildProjectIndex(getDocuments());
}

