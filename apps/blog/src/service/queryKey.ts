export const qk = {
  posts: () => ["posts"] as const,
  post: (id: string) => ["post", id] as const,
  categories: () => ["categories"] as const,
  postsByCategory: (slug: string) => ["postsByCategory", slug] as const,
};
