import type { BookMeta, Item } from "@/types/contents/book";
import { parseContentModules, findContentById } from "@/utils/content-parser";

// ⚠️ Vite는 리터럴 문자열만 허용하므로, 경로를 직접 지정해야 합니다.
const modules = import.meta.glob<string>("../contents/books/**/*.{md,mdx}", {
  eager: true,
  query: "?raw",
  import: "default",
});

/**
 * 모든 책을 가져옵니다.
 */
export function getBooks(): Item<BookMeta>[] {
  return parseContentModules<BookMeta>(modules, { category: "books" });
}

/**
 * 특정 ID의 책을 가져옵니다.
 * published가 false인 책은 반환하지 않습니다.
 */
export function getBook(id: string): Item<BookMeta> | undefined {
  return findContentById(getBooks(), id);
}
