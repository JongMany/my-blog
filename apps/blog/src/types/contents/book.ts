/**
 * 책 메타데이터 타입
 */
export interface BookMeta {
  title: string;
  author?: string;
  summary?: string;
  tags?: string[];
  date?: string;
  slug: string;
  path: string;
  createdAtMs?: number;
  [key: string]: unknown; // frontmatter의 추가 필드를 허용
}

/**
 * 메타데이터 타입 (제네릭)
 */
export type Meta = BookMeta;

/**
 * 콘텐츠 아이템 타입
 *
 * @template T - 메타데이터 타입
 */
export type Item<T extends Meta> = {
  slug: string;
  content: string;
  meta: T;
};
