import { isString } from "@mfe/shared";
import type { ProjectMeta } from "@/entities/project/model/types";

/**
 * 프로젝트 메타데이터에서 정보를 추출하는 유틸리티 클래스
 */
export class ProjectExtractor {
  /**
   * 프로젝트 목록에서 모든 태그를 추출합니다.
   */
  static extractAllTags(projects: ProjectMeta[]): string[] {
    return Array.from(new Set(projects.flatMap((p) => p.tags ?? []))).sort();
  }

  /**
   * 프로젝트 목록에서 모든 프로젝트명을 추출합니다.
   */
  static extractAllProjects(projects: ProjectMeta[]): string[] {
    return Array.from(
      new Set(
        projects
          .map((p) => p.project)
          .filter(
            (project): project is string => isString(project) && project !== "",
          ),
      ),
    ).sort();
  }
}
