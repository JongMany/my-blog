type AppPrefix = "" | "blog" | "portfolio" | "resume";

const mainHost = (app: AppPrefix) => {
  const devUrl = {
    "": "http://localhost:3000",
    blog: "http://localhost:3001",
    portfolio: "http://localhost:3002",
    resume: "http://localhost:3003",
  };
  const isDev = import.meta.env.MODE === "development";
  return isDev ? `${devUrl[app]}/` : `/my-blog/${app}/`;
};

export const imageSource = (
  src: string,
  prefix: "portfolio" | "blog" | "" | "resume",
  devUrl: string
) => {
  return import.meta.env.MODE === "development"
    ? `${devUrl}/${src}`
    : `/my-blog/${prefix}${src}`;
};

export function assetUrl(path: string, app: AppPrefix = "") {
  const host = mainHost(app);

  const clean = path.replace(/^\/+/, ""); // path 맨 앞의 / 제거
  // 중복 슬래시 정리
  return `${host}${clean}`;
}
