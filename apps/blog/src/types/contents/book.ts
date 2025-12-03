import { BaseMeta, ContentItem } from "./common";

/**
 * 책 메타데이터 타입
 * 책 전용 필드가 포함됩니다.
 */
export interface BookMeta extends BaseMeta {
  /** 저자 */
  author?: string;
  /** 생성 시간 (ms) - 레거시 지원 */
  createdAtMs?: number;
}

// 하위 호환성을 위한 re-export
export type Meta = BookMeta;
export type Item<T extends BaseMeta = BookMeta> = ContentItem<T>;
