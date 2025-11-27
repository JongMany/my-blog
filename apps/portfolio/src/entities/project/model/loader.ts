import type { ProjectDocument } from "./types";
import { createProjectDocument } from "./parser";

/**
 * 프로젝트 문서를 로드하고 캐싱하는 모듈
 */

let cachedDocuments: ProjectDocument[] | null = null;

/**
 * 프로젝트 문서 목록을 반환합니다 (캐싱됨)
 */
export function getDocuments(): ProjectDocument[] {
  return cachedDocuments ?? (cachedDocuments = loadProjectDocuments());
}

/**
 * MDX 파일들을 로드하여 프로젝트 문서로 변환합니다
 */
function loadProjectDocuments(): ProjectDocument[] {
  const modules = import.meta.glob<string>(
    "../../../contents/projects/**/*.{md,mdx}",
    {
      eager: true,
      query: "?raw",
      import: "default",
    },
  );

  return Object.entries(modules)
    .map(([filePath, content]) => {
      if (typeof content === "string") {
        return createProjectDocument(filePath, content);
      }
      return null;
    })
    .filter((doc): doc is ProjectDocument => doc !== null);
}
