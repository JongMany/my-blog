import { BaseMeta, ContentItem } from "./common";

/**
 * 로그 메타데이터 타입
 * 필요시 로그 전용 필드를 여기에 추가하세요.
 */
export interface LogMeta extends BaseMeta {
  // 로그 전용 필드가 필요하면 여기에 추가
}

// 서비스 레이어에서 사용하는 Item 타입
export type Item<T extends BaseMeta = LogMeta> = ContentItem<T>;
