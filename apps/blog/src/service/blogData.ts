import { assetUrl } from "@mfe/shared";
import { useQuery } from "@tanstack/react-query";

export type BlogPostMeta = {
  category: string;
  title: string;
  slug: string;

  date: string; // 원본 ISO(초 포함)
  updatedAt: string; // 원본 ISO(초 포함)
  dateMinute: string; // 분 단위 ISO(초 제거)
  updatedMinute: string;
  dateParts: {
    y: number;
    m: number;
    d: number;
    hh: number;
    mm: number;
    tz: string;
  } | null;
  updatedParts: {
    y: number;
    m: number;
    d: number;
    hh: number;
    mm: number;
    tz: string;
  } | null;
  createdAtMs: number; // 정렬/필터 편의
  updatedAtMs: number;

  tags: string[];
  summary: string;
  cover: string | null;
  path: string;
};

export type BlogIndex = {
  categories: string[];
  byCategory: Record<string, BlogPostMeta[]>;
  all: BlogPostMeta[];
};

export async function fetchBlogIndexFromHost() {
  // host 기준: /_blog/index.json 또는 /my-blog/blog/_blog/index.json
  const url = assetUrl("_blog/index.json", "blog");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load blog index: ${res.status}`);
  return (await res.json()) as BlogIndex;
}

export async function fetchPostMdxFromHost(path: string) {
  // path 예: "_blog/posts/frontend/foo.mdx"
  const url = assetUrl(path, "blog");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load mdx: ${res.status}`);
  return await res.text();
}

export async function fetchBlogIndex() {
  // host 기준: /_blog/index.json 또는 /my-blog/blog/_blog/index.json
  const url = assetUrl("_blog/index.json", "blog");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load blog index: ${res.status}`);
  const raw = (await res.json()) as Partial<BlogIndex> & {
    byCategory?: BlogIndex["byCategory"];
    all?: BlogIndex["all"];
  };

  const categories =
    raw.categories ??
    (raw.byCategory ? Object.keys(raw.byCategory).sort() : []);

  return {
    all: raw.all ?? [],
    byCategory: raw.byCategory ?? {},
    categories,
  };
}

export function useBlogIndex() {
  return useQuery({
    queryKey: ["blog-index"],
    queryFn: fetchBlogIndex,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
