import { BaseMeta, ContentItem } from "./common";

/**
 * 회고 메타데이터 타입
 * 필요시 회고 전용 필드를 여기에 추가하세요.
 */
export interface RetrospectMeta extends BaseMeta {
  // 회고 전용 필드가 필요하면 여기에 추가
}

// 하위 호환성을 위한 re-export
export type Meta = RetrospectMeta;
export type Item<T extends BaseMeta = RetrospectMeta> = ContentItem<T>;
