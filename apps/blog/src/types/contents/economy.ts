import { BaseMeta, ContentItem } from "./common";

/**
 * 경제 섹션 메타데이터 타입
 * 필요시 경제 전용 필드를 여기에 추가하세요.
 */
export interface EconomyMeta extends BaseMeta {
  categories?: string[];
}

// 하위 호환성을 위한 re-export
export type Meta = EconomyMeta;
export type Item<T extends BaseMeta = EconomyMeta> = ContentItem<T>;
