// ProjectDetail 관련 모든 상수들을 export
export { URL_CONSTANTS } from "./urls";
export { MESSAGE_CONSTANTS } from "./messages";

// 기존 호환성을 위한 통합 상수
import { URL_CONSTANTS } from "./urls";
import { MESSAGE_CONSTANTS } from "./messages";

export const PROJECT_DETAIL_CONSTANTS = {
  ...URL_CONSTANTS,
  ...MESSAGE_CONSTANTS,
} as const;
