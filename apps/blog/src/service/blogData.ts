import { assetUrl } from "@mfe/shared";

// apps/blog/src/service/blogData.ts
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
  // host 기준: /blog/_blog/index.json 또는 /my-blog/blog/_blog/index.json
  const url = assetUrl("_blog/index.json", "blog");

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load blog index: ${res.status}`);
  return (await res.json()) as BlogIndex;
}

export async function fetchPostMdxFromHost(path: string) {
  // path 예: "_blog/posts/frontend/foo.mdx"
  const url = assetUrl(`blog/${path.replace(/^\/+/, "")}`);
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`failed to load mdx: ${res.status}`);
  return await res.text();
}
