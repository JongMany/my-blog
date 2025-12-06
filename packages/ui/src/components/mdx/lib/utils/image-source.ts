import { imageSource } from "@mfe/shared";
import { isExternalLink } from "./utils";
import type { AppName } from "../../types";

/**
 * 이미지 소스 처리 함수를 생성하는 팩토리 함수
 *
 * @param appName - 앱 이름 (blog, portfolio, home, resume)
 * @param options - 옵션 객체
 * @param options.isDevelopment - 개발 환경 여부 (기본값: false)
 * @returns 이미지 소스를 처리하는 함수
 */
export function createProcessImageSource(
  appName: AppName,
  options?: { isDevelopment?: boolean },
): (src: string, appName: AppName) => string {
  const isDevelopment = options?.isDevelopment ?? false;

  return (src: string, _appName: AppName): string => {
    if (isExternalLink(src)) return src;

    return imageSource(src, appName, { isDevelopment });
  };
}

