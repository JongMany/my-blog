import { DEV_HOST_URLS, PROD_HOST_URLS } from "../constants/host";

type AppPrefix = "home" | "blog" | "portfolio" | "resume";

type HostOptions = {
  isDevelopment?: boolean;
};

const mainHost = (app: AppPrefix, options?: HostOptions) => {
  const { isDevelopment = true } = options ?? {};

  return isDevelopment ? DEV_HOST_URLS[app] : PROD_HOST_URLS[app];
};

export const imageSource = (
  src: string,
  prefix: "portfolio" | "blog" | "home" | "resume",
  // devUrl: string,
  options?: HostOptions,
) => {
  const hostUrl = mainHost(prefix, options);

  return `${hostUrl}${src}`;
};

export function assetUrl(
  path: string,
  app: AppPrefix = "home",
  options?: HostOptions,
) {
  const host = mainHost(app, options);

  const clean = path.replace(/^\/+/, ""); // path 맨 앞의 / 제거
  // console.log(host, clean);
  // 중복 슬래시 정리
  return `${host}/${clean}`;
}
