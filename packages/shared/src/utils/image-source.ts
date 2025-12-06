import { DEV_HOST_URLS, PROD_HOST_URLS } from "../constants/host";

type AppPrefix = "home" | "blog" | "portfolio" | "resume";

type HostOptions = {
  isDevelopment?: boolean;
};

const getHostUrl = (app: AppPrefix, options?: HostOptions): string => {
  const { isDevelopment = true } = options ?? {};

  return isDevelopment ? DEV_HOST_URLS[app] : PROD_HOST_URLS[app];
};

/**
 * 이미지 소스 URL을 생성하는 커링 함수
 *
 * @param app - 앱 이름 (portfolio, blog, home, resume)
 * @param options - 호스트 옵션
 * @returns 이미지 경로를 받아서 전체 URL을 반환하는 함수
 *
 * @example
 * ```typescript
 * const blogImageSource = imageSource("blog", { isDevelopment: true });
 * const url = blogImageSource("/image.png"); // "http://localhost:3001/image.png"
 * ```
 */
export const imageSource =
  (app: "portfolio" | "blog" | "home" | "resume", options?: HostOptions) =>
  (src: string): string => {
    const hostUrl = getHostUrl(app, options);

    return `${hostUrl}${src}`;
  };

