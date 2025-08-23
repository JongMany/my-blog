import type { Post, Category } from "./types";

const LS_POSTS = "mfe_blog_posts";
const LS_CATS = "mfe_blog_categories";

const sleep = (ms = 200) => new Promise((r) => setTimeout(r, ms));
const read = <T>(k: string, def: T): T => {
  const raw = localStorage.getItem(k);
  return raw ? (JSON.parse(raw) as T) : def;
};
const write = (k: string, v: unknown) =>
  localStorage.setItem(k, JSON.stringify(v));

export const slugify = (s: string) =>
  encodeURIComponent(s.trim().toLowerCase().replace(/\s+/g, "-"));

export async function listCategories(): Promise<Category[]> {
  await sleep();
  return read<Category[]>(LS_CATS, [
    { name: "General", slug: "general" },
    { name: "DevLog", slug: "devlog" },
  ]);
}

export async function createCategory(name: string): Promise<Category> {
  await sleep();
  const list = read<Category[]>(LS_CATS, []);
  const slug = slugify(name);
  if (!list.some((c) => c.slug === slug)) {
    list.push({ name, slug });
    write(LS_CATS, list);
  }
  return { name, slug };
}

export async function listPosts(): Promise<Post[]> {
  await sleep();
  return read<Post[]>(LS_POSTS, []);
}

export async function listPostsByCategory(slug: string): Promise<Post[]> {
  await sleep();
  const all = read<Post[]>(LS_POSTS, []);
  return all.filter((p) => p.categories.includes(slug));
}

export async function getPost(id: string): Promise<Post | null> {
  await sleep();
  const all = read<Post[]>(LS_POSTS, []);
  return all.find((p) => p.id === id) ?? null;
}

export async function createPost(
  input: Omit<Post, "id" | "createdAt">
): Promise<Post> {
  await sleep();
  const all = read<Post[]>(LS_POSTS, []);
  const post: Post = {
    ...input,
    id: String(Date.now()),
    createdAt: Date.now(),
  };
  all.unshift(post);
  write(LS_POSTS, all);

  // 카테고리 자동 생성
  const cats = read<Category[]>(LS_CATS, []);
  input.categories.forEach((slug) => {
    if (!cats.some((c) => c.slug === slug))
      cats.push({ name: decodeURIComponent(slug), slug });
  });
  write(LS_CATS, cats);

  return post;
}
