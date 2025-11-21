import { assetUrl } from "@mfe/shared";

// 썸네일 관련 유틸리티 함수들
export const getThumbnailPath = (cover?: string): string => {
  if (!cover) return "";

  // 이미 절대 경로인 경우
  if (cover.startsWith("/") || cover.startsWith("http")) {
    return cover;
  }

  // 상대 경로인 경우 thumbnails 디렉토리 기준으로 변환
  if (cover.includes(".")) {
    const ext = cover.split(".").pop()?.toLowerCase();
    if (ext === "gif") {
      return `/projects/thumbnails/gifs/${cover}`;
    } else if (["jpg", "jpeg", "png", "webp", "avif"].includes(ext || "")) {
      return `/projects/thumbnails/images/${cover}`;
    }
  }

  return `/projects/thumbnails/${cover}`;
};

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

export const getFallbackThumbnail = (): string => {
  return "/projects/thumbnails/fallbacks/http_fallback_thumbnail.png";
};

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

// 순수한 데이터 페칭 함수들
export async function fetchPortfolioIndex(): Promise<ProjectIndex> {
  const url = assetUrl("_portfolio/index.json", "portfolio", {
    isDevelopment: import.meta.env.MODE === "development",
  });
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load portfolio index: ${res.status}`);
  }

  const raw = await res.json();
  return normalizeProjectIndex(raw);
}

export async function fetchProjectMdx(path: string): Promise<string> {
  const url = assetUrl(path, "portfolio", {
    isDevelopment: import.meta.env.MODE === "development",
  });
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to load MDX: ${res.status}`);
  }

  return await res.text();
}

// 순수한 유틸리티 함수들
export const normalizeProjectIndex = (raw: any): ProjectIndex => {
  const projects =
    raw.projects ?? (raw.byProject ? Object.keys(raw.byProject).sort() : []);

  return {
    all: raw.all ?? [],
    byProject: raw.byProject ?? {},
    projects,
  };
};

export const validateProjectMeta = (project: any): ProjectMeta | null => {
  if (!project || typeof project !== "object") return null;

  const required = [
    "title",
    "summary",
    "tags",
    "date",
    "slug",
    "path",
    "createdAtMs",
  ];
  const hasRequired = required.every((field) => project[field] !== undefined);

  if (!hasRequired) return null;

  return {
    title: String(project.title),
    summary: String(project.summary),
    project: project.project ? String(project.project) : undefined,
    tags: Array.isArray(project.tags) ? project.tags.map(String) : [],
    date: String(project.date),
    slug: String(project.slug),
    path: String(project.path),
    createdAtMs: Number(project.createdAtMs),
    cover: project.cover ? String(project.cover) : undefined,
    coverAlt: project.coverAlt ? String(project.coverAlt) : undefined,
    coverCaption: project.coverCaption
      ? String(project.coverCaption)
      : undefined,
    coverType: project.coverType,
    coverAspectRatio: project.coverAspectRatio,
  };
};
