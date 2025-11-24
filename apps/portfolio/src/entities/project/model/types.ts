/**
 * Project 엔티티 타입 정의
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

