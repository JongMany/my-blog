import { parseFrontmatter } from "./frontmatter";
import type { BaseMeta, ContentItem, ContentCategoryConfig } from "@/types/contents/common";

/**
 * Vite의 import.meta.glob 결과를 ContentItem 배열로 변환합니다.
 *
 * @template T - 메타데이터 타입 (BaseMeta를 확장)
 * @param modules - import.meta.glob의 결과
 * @param config - 카테고리 설정
 * @returns ContentItem 배열
 *
 * @example
 * ```typescript
 * const modules = import.meta.glob("../contents/posts/*.mdx", { eager: true, query: "?raw", import: "default" });
 * const posts = parseContentModules<PostMeta>(modules, { category: "posts" });
 * ```
 */
export function parseContentModules<T extends BaseMeta>(
  modules: Record<string, unknown>,
  config: ContentCategoryConfig
): ContentItem<T>[] {
  const { category, urlPrefix = "blog" } = config;
  const items: ContentItem<T>[] = [];

  for (const [filePath, module] of Object.entries(modules)) {
    const rawContent = module as string;
    const { data: frontmatter, content } = parseFrontmatter(rawContent);

    // 파일 경로에서 정보 추출
    const pathParts = filePath.split("/");
    const fileName = pathParts[pathParts.length - 1];
    const fileNameWithoutExt = fileName.replace(/\.(md|mdx)$/, "");

    // slug 생성
    const defaultSlug = `${urlPrefix}/${category}/${fileNameWithoutExt}`;
    const slug = (frontmatter.slug as string) || defaultSlug;

    // 상대 경로 생성
    const relativePath = filePath
      .replace(/^\.\.\/contents\//, "/contents/")
      .replace(/\\/g, "/");

    const meta = {
      title: (frontmatter.title as string) || fileNameWithoutExt,
      id: fileNameWithoutExt,
      ...frontmatter,
      slug,
      path: relativePath,
    } as T;

    items.push({ slug, content, meta });
  }

  return items;
}

/**
 * ID로 특정 아이템을 찾습니다. published가 false인 아이템은 제외합니다.
 *
 * @template T - 메타데이터 타입
 * @param items - 전체 아이템 목록
 * @param id - 찾을 아이템의 ID
 * @returns 찾은 아이템 또는 undefined
 */
export function findContentById<T extends BaseMeta>(
  items: ContentItem<T>[],
  id: string
): ContentItem<T> | undefined {
  const item = items.find((item) => item.meta.id === id);

  // published가 false인 아이템은 반환하지 않음
  if (item && item.meta.published === false) {
    return undefined;
  }

  return item;
}

