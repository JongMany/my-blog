/**
 * 불릿 리스트 관련 상수들
 */

/** 최대 허용 중첩 레벨 */
export const MAX_NESTING_LEVEL = 5;

/** 기본 애니메이션 지연 시간 (ms) */
export const ANIMATION_DELAY = 100;

/** 툴팁 지연 시간 (ms) */
export const TOOLTIP_DELAY = 200;

/** 접근성을 위한 ARIA 라벨들 */
export const ARIA_LABELS = {
  BULLET_LIST: "불릿 포인트 목록",
  BULLET_ITEM: "불릿 포인트 아이템",
  TAG: "관련 태그",
  PORTFOLIO_LINKS: "포트폴리오 링크들",
} as const;

/** 레벨별 마커 타입 */
export const MARKER_TYPES = {
  0: "disc",
  1: "circle",
  2: "square",
} as const;
