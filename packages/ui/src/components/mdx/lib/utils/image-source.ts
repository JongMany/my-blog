import { imageSource } from "@mfe/shared";
import { isExternalLink } from "./utils";
import type { AppName } from "../../types";

/**
 * 이미지 소스 처리 함수를 생성하는 팩토리 함수
 *
 * @param appName - 앱 이름 (blog, portfolio, home, resume)
 * @returns 이미지 소스를 처리하는 함수
 */
export function createProcessImageSource(
  appName: AppName,
): (src: string, appName: AppName) => string {
  return (src: string, _appName: AppName): string => {
    if (isExternalLink(src)) return src;

    const isDevelopment = import.meta.env.MODE === "development";
    return imageSource(src, appName, { isDevelopment });
  };
}

