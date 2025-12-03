import { BaseMeta, ContentItem } from "./common";

/**
 * 경제 섹션 메타데이터 타입
 * 필요시 경제 전용 필드를 여기에 추가하세요.
 */
export interface EconomyMeta extends BaseMeta {
  categories?: string[];
}

// 서비스 레이어에서 사용하는 Item 타입
export type Item<T extends BaseMeta = EconomyMeta> = ContentItem<T>;
