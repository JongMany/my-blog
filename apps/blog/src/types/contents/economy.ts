/**
 * 경제 섹션 메타데이터 타입
 */
export interface EconomyMeta {
  title: string;
  id: string; // 파일명에서 확장자 제거한 값 (예: "inflation-analysis")
  summary?: string;
  categories?: string[];
  tags?: string[];
  date?: string;
  slug: string;
  path: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  [key: string]: unknown; // frontmatter의 추가 필드를 허용
}

/**
 * 메타데이터 타입 (제네릭)
 */
export type Meta = EconomyMeta;

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

