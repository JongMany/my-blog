/**
 * Project 엔티티 타입 정의
 */

/**
 * 프로젝트 썸네일 정보
 */
export type ProjectThumbnail = {
  cover?: string;
  coverAlt?: string;
  coverCaption?: string;
  coverType?: "gif" | "image" | "video";
  coverAspectRatio?: "16:9" | "4:3" | "1:1" | "auto";
};

export type ProjectMeta = {
  title: string;
  summary: string;
  project?: string;
  tags: string[];
  date: string;
  slug: string;
  path: string;
  createdAtMs: number;
  id: string;
  published?: boolean;
  order?: number;
  banner?: boolean;
} & ProjectThumbnail;

export type ProjectIndex = {
  all: ProjectMeta[];
  byProject: Record<string, ProjectMeta[]>;
  projects: string[];
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export type Skill = {
  name: string;
  lvl: number;
};

export type ProjectDocument = {
  slug: string;
  content: string;
  meta: ProjectMeta;
};

/**
 * 프로젝트 문서 생성 시 사용하는 경로 정보
 */
export interface PathInfo {
  fileName: string;
  fileNameWithoutExt: string;
  folderAfterProjects?: string;
}

/**
 * 프로젝트 문서 생성 시 사용하는 날짜 정보
 */
export interface DateInfo {
  dateStr: string;
  createdAtMs: number;
}

import type { FrontmatterData } from "../../../components/mdx";

/**
 * 프로젝트 메타데이터 빌드 파라미터
 */
export interface BuildMetaParams {
  frontmatter: FrontmatterData;
  pathInfo: PathInfo;
  slug: string;
  relativePath: string;
  dateInfo: DateInfo;
}

