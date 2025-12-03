/**
 * 콘텐츠 메타데이터의 기본 인터페이스
 * 모든 카테고리의 메타데이터는 이 인터페이스를 확장합니다.
 */
export interface BaseMeta {
  title: string;
  id: string;
  slug: string;
  path: string;
  summary?: string;
  tags?: string[];
  date?: string;
  createdAt?: string;
  updatedAt?: string;
  published?: boolean;
  [key: string]: unknown;
}

/**
 * 콘텐츠 아이템 타입
 * 모든 카테고리에서 공통으로 사용됩니다.
 *
 * @template T - 메타데이터 타입 (BaseMeta를 확장)
 *
 * @example
 * ```typescript
 * // PostMeta가 BaseMeta를 확장하는 경우
 * type Post = ContentItem<PostMeta>;
 * ```
 */
export type ContentItem<T extends BaseMeta = BaseMeta> = {
  slug: string;
  content: string;
  meta: T;
};

/**
 * 콘텐츠 카테고리 설정 타입
 * 각 카테고리별 서비스에서 사용됩니다.
 */
export interface ContentCategoryConfig {
  /** 카테고리 디렉토리명 (예: "posts", "economy") */
  category: string;
  /** URL prefix (예: "blog") */
  urlPrefix?: string;
}

