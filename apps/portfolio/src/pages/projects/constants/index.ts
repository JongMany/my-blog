// Projects 관련 모든 상수들을 export
import { MESSAGE_CONSTANTS } from "./messages";
import { UI_CONSTANTS } from "./ui";

export { MESSAGE_CONSTANTS } from "./messages";
export { UI_CONSTANTS } from "./ui";

// 기존 호환성을 위한 통합 상수
export const PROJECTS_CONSTANTS = {
  ...MESSAGE_CONSTANTS,
  ...UI_CONSTANTS,
} as const;
