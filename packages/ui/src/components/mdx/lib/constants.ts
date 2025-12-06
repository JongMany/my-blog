import type { AppName } from "../../types";

/**
 * 앱 이름 상수
 */
export const APP_NAMES = {
  BLOG: "blog",
  PORTFOLIO: "portfolio",
  HOME: "home",
  RESUME: "resume",
} as const satisfies Record<string, AppName>;

/**
 * 기본 앱 이름 (fallback용)
 */
export const DEFAULT_APP_NAME: AppName = APP_NAMES.PORTFOLIO;

