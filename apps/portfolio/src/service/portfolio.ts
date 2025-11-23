import { parseFrontmatter } from "../utils/frontmatter";

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
  id: string; // 파일명에서 확장자 제거한 값
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

/**
 * 콘텐츠 아이템 타입
 */
export type Item<T extends ProjectMeta> = {
  slug: string;
  content: string;
  meta: T;
};

/**
 * 모든 프로젝트를 Item 형태로 가져오는 함수 (내부 함수)
 */
function getAllProjects(): Item<ProjectMeta>[] {
  // ⚠️ Vite는 리터럴 문자열만 허용하므로, 이 파일 위치 기준 상대 경로를 직접 사용
  const modules = import.meta.glob<string>(
    "../contents/projects/**/*.{md,mdx}",
    {
      eager: true,
      query: "?raw",
      import: "default",
    },
  );

  const projects: Item<ProjectMeta>[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    // raw content를 가져옴
    const rawContent = module as unknown as string;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    // 파일 경로에서 정보 추출
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");
    const projectsIndex = pathParts.findIndex((part) => part === "projects");
    const folderAfterProjects =
      projectsIndex >= 0 && projectsIndex < pathParts.length - 2
        ? pathParts[projectsIndex + 1]
        : undefined;

    // slug 생성: 파일명 기반
    const defaultSlug = fileNameWithoutExt;
    const slug = (frontmatter.slug as string) || defaultSlug;

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    // createdAtMs 계산 (date가 있으면 사용, 없으면 현재 시간)
    const dateStr = (frontmatter.date as string) || new Date().toISOString();
    const createdAtMs = new Date(dateStr).getTime();

    const publishedValue =
      normalizeBoolean(frontmatter.publish) ??
      normalizeBoolean(frontmatter.published);
    const published = publishedValue ?? true;

    if (!published) {
      continue;
    }

    const tags = normalizeTags(frontmatter.tags);
    const order = normalizeNumber(frontmatter.order);
    const bannerValue = normalizeBoolean(frontmatter.banner);
    const banner = bannerValue ?? false;

    const inferredProject =
      frontmatter.project && String(frontmatter.project).trim().length > 0
        ? String(frontmatter.project)
        : folderAfterProjects &&
            !folderAfterProjects.includes(".") &&
            folderAfterProjects !== fileName
          ? folderAfterProjects
          : undefined;

    const meta: ProjectMeta = {
      title: (frontmatter.title as string) || fileNameWithoutExt,
      summary: (frontmatter.summary as string) || "",
      project: inferredProject,
      tags,
      date: String(frontmatter.date || dateStr),
      slug,
      path: relativePath,
      createdAtMs,
      id: fileNameWithoutExt,
      published,
      order,
      banner,
      cover: frontmatter.cover ? String(frontmatter.cover) : undefined,
      coverAlt: frontmatter.coverAlt ? String(frontmatter.coverAlt) : undefined,
      coverCaption: frontmatter.coverCaption
        ? String(frontmatter.coverCaption)
        : undefined,
      coverType: frontmatter.coverType as ProjectThumbnail["coverType"],
      coverAspectRatio: frontmatter.coverAspectRatio as
        | ProjectThumbnail["coverAspectRatio"]
        | undefined,
    };

    projects.push({
      slug,
      content,
      meta,
    });
  }

  return projects;
}

/**
 * 모든 프로젝트 목록을 가져오는 함수 (Item 형태)
 *
 * Vite의 import.meta.glob을 사용하여 빌드 타임에 모든 파일을 번들에 포함시킵니다.
 * CSR 환경에서도 동작합니다.
 */
export function getProjects(): Item<ProjectMeta>[] {
  return getAllProjects();
}

/**
 * 프로젝트 인덱스를 생성하는 함수
 */
export function getPortfolioIndex(): ProjectIndex {
  const projects = getAllProjects();
  const all = projects
    .map((p) => p.meta)
    .sort((a, b) => {
      const orderA =
        typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
      const orderB =
        typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;

      if (orderA !== orderB) {
        return orderA - orderB; // 낮은 order가 우선
      }

      return (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0); // 최신순
    });

  // byProject 그룹화
  const byProject: Record<string, ProjectMeta[]> = {};
  for (const project of all) {
    const projectName = project.project || "기타";
    if (!byProject[projectName]) {
      byProject[projectName] = [];
    }
    byProject[projectName].push(project);
  }

  // projects 목록 (프로젝트명 목록)
  const projectsList = Object.keys(byProject).sort();

  return {
    all,
    byProject,
    projects: projectsList,
  };
}

/**
 * 특정 slug의 프로젝트를 가져오는 함수
 *
 * @param slug 프로젝트의 slug
 * @returns 프로젝트 정보 (Item 형태), 없으면 undefined
 */
export function getProject(slug: string): Item<ProjectMeta> | undefined {
  const projects = getAllProjects();
  return projects.find((project) => project.meta.slug === slug);
}

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw
      .map((value) => String(value).trim())
      .filter((value) => value.length > 0);
  }

  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    const parts = trimmed.includes(",")
      ? trimmed.split(",")
      : trimmed.split(" ");

    return parts.map((part) => part.trim()).filter((part) => part.length > 0);
  }

  return [];
}

function normalizeBoolean(raw: unknown): boolean | undefined {
  if (typeof raw === "boolean") {
    return raw;
  }

  if (typeof raw === "string") {
    const normalized = raw.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return undefined;
}

function normalizeNumber(raw: unknown): number | undefined {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }

  if (typeof raw === "string" && raw.trim().length > 0) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
}
