import type { ProjectDocument, ProjectIndex, ProjectMeta } from "./types";
import { ProjectExtractor } from "@/entities/project/utils/extractors";

/**
 * 프로젝트 메타데이터를 우선순위에 따라 정렬합니다.
 * order 값이 낮을수록 우선순위가 높고, 같으면 최신순으로 정렬합니다.
 */
const orderByPriority = (metaList: ProjectMeta[]): ProjectMeta[] => {
  return [...metaList].sort((a, b) => {
    const priorityA =
      typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
    const priorityB =
      typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const createdAtA = a.createdAtMs ?? 0;
    const createdAtB = b.createdAtMs ?? 0;
    return createdAtB - createdAtA;
  });
};

/**
 * 프로젝트 메타데이터를 프로젝트 이름별로 그룹화합니다.
 */
const groupByProject = (
  metaList: ProjectMeta[],
): Record<string, ProjectMeta[]> => {
  return metaList.reduce<Record<string, ProjectMeta[]>>((grouped, meta) => {
    const projectName = meta.project || "기타";
    grouped[projectName] = [...(grouped[projectName] || []), meta];
    return grouped;
  }, {});
};

/**
 * 프로젝트 문서 목록에서 slug로 문서를 찾습니다.
 */
export const findProjectBySlug = (
  documents: ProjectDocument[],
  slug: string,
): ProjectDocument | undefined => {
  return documents.find((doc) => doc.slug === slug);
};

/**
 * 프로젝트 인덱스를 생성합니다.
 * 정렬된 메타데이터와 프로젝트별 그룹화된 데이터를 포함합니다.
 */
export const buildProjectIndex = (
  documents: ProjectDocument[],
): ProjectIndex => {
  const ordered = orderByPriority(documents.map((doc) => doc.meta));
  const byProject = groupByProject(ordered);

  return {
    all: ordered,
    byProject,
    projects: Object.keys(byProject).sort(),
    tags: ProjectExtractor.extractAllTags(ordered),
  };
};
