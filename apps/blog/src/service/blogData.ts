import { assetUrl } from "@mfe/shared";
import { useQuery } from "@tanstack/react-query";

export type BlogIndex = {
  all: Array<{
    title: string;
    summary: string;
    category: string;
    slug: string;
    date: string;
    updatedAt: string;
    cover: string | null;
    path: string; // MDX 파일 경로 등
  }>;
  byCategory: Record<string, BlogIndex["all"]>;
  categories: string[];
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
