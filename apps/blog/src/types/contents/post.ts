import { BaseMeta, ContentItem } from "./common";

/**
 * 포스트 메타데이터 타입
 * 필요시 포스트 전용 필드를 여기에 추가하세요.
 */
export interface PostMeta extends BaseMeta {
  categories?: string[];
}

// 하위 호환성을 위한 re-export
export type Meta = PostMeta;
export type Item<T extends BaseMeta = PostMeta> = ContentItem<T>;
