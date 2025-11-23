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

export class ProjectCatalog {
  private readonly documents: ProjectDocument[];

  private constructor(documents: ProjectDocument[]) {
    this.documents = [...documents];
  }

  static create(documents: ProjectDocument[]): ProjectCatalog {
    return new ProjectCatalog(documents);
  }

  list(): ProjectDocument[] {
    return this.documents;
  }

  findBySlug(slug: string): ProjectDocument | undefined {
    return this.documents.find((doc) => doc.slug === slug);
  }

  buildIndex(): ProjectIndex {
    const ordered = this.orderByPriority(this.documents.map((doc) => doc.meta));
    const byProject = this.groupByProject(ordered);

    return {
      all: ordered,
      byProject,
      projects: Object.keys(byProject).sort(),
    };
  }

  private orderByPriority(metas: ProjectMeta[]) {
    return [...metas].sort((a, b) => {
      const orderA =
        typeof a.order === "number" ? a.order : Number.POSITIVE_INFINITY;
      const orderB =
        typeof b.order === "number" ? b.order : Number.POSITIVE_INFINITY;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      return (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0);
    });
  }

  private groupByProject(metas: ProjectMeta[]): Record<string, ProjectMeta[]> {
    return metas.reduce<Record<string, ProjectMeta[]>>((acc, project) => {
      const projectName = project.project || "기타";
      if (!acc[projectName]) {
        acc[projectName] = [];
      }
      acc[projectName].push(project);
      return acc;
    }, {});
  }
}

export const getThumbnailPath = (cover?: string): string => {
  if (!cover) return "";

  if (cover.startsWith("/") || cover.startsWith("http")) {
    return cover;
  }

  if (cover.includes(".")) {
    const ext = cover.split(".").pop()?.toLowerCase();
    if (ext === "gif") {
      return `/projects/thumbnails/gifs/${cover}`;
    }
    if (["jpg", "jpeg", "png", "webp", "avif"].includes(ext || "")) {
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

export function normalizeTags(raw: unknown): string[] {
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

export function normalizeBoolean(raw: unknown): boolean | undefined {
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

export function normalizeNumber(raw: unknown): number | undefined {
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

export function formatProjectName(
  value: string | undefined,
): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  if (/[^a-zA-Z0-9\s_-]/.test(trimmed)) {
    return trimmed;
  }

  const parts = trimmed
    .split(/[\s_-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase());

  if (parts.length === 0) {
    return trimmed[0].toUpperCase() + trimmed.slice(1);
  }

  return parts.join("");
}
