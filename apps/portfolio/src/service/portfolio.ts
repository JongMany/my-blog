import { assetUrl } from "@mfe/shared";
import { useQuery } from "@tanstack/react-query";

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

export async function fetchPortfolioIndexFromHost() {
  // host 기준: /_portfolio/index.json
  const url = assetUrl("_portfolio/index.json", "portfolio");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load portfolio index: ${res.status}`);
  return (await res.json()) as ProjectIndex;
}

export async function fetchProjectMdxFromHost(path: string) {
  // path 예: "_portfolio/projects/foo.mdx"
  const url = assetUrl(path, "portfolio");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load mdx: ${res.status}`);
  return await res.text();
}

export async function fetchPortfolioIndex() {
  // host 기준: /_portfolio/index.json
  const url = assetUrl("_portfolio/index.json", "portfolio");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load portfolio index: ${res.status}`);
  const raw = (await res.json()) as Partial<ProjectIndex> & {
    byProject?: ProjectIndex["byProject"];
    all?: ProjectIndex["all"];
  };

  const projects =
    raw.projects ?? (raw.byProject ? Object.keys(raw.byProject).sort() : []);

  return {
    all: raw.all ?? [],
    byProject: raw.byProject ?? {},
    projects,
  };
}

export function usePortfolioIndex() {
  return useQuery({
    queryKey: ["portfolio-index"],
    queryFn: fetchPortfolioIndex,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}

export const experiences: Experience[] = [
  {
    company: "Coinness",
    role: "Frontend Engineer",
    period: "2025.07 - Now",
    points: [
      "TradingView 확장(TP/SL 드래그, 주문 UX) 및 안정성 리팩토링",
      "차트/주문/체결 가시화, iframe 기반 Web Components 인프라",
    ],
  },
  {
    company: "Bubblechat",
    role: "Frontend Engineer",
    period: "2024.10 - 2025.06",
    points: [
      "SSE 스트리밍 UX 최적화, 멀티 이미지/구매 플로우",
      "키워드북·DnD·채팅 히스토리/칩 변환, 로깅/QA/ESLint",
    ],
  },
];

export const skills: Skill[] = [
  { name: "TypeScript", lvl: 80 },
  { name: "React", lvl: 80 },
  { name: "Zustand", lvl: 75 },
  { name: "Tanstack Query", lvl: 70 },
  { name: "TailwindCSS", lvl: 60 },
  { name: "Styled Components", lvl: 75 },
  { name: "TradingView", lvl: 60 },
  { name: "Nest.js", lvl: 60 },
  { name: "TypeORM", lvl: 60 },
  { name: "PostgreSQL", lvl: 50 },
];
