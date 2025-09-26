// Giscus 설정 상수
export const GISCUS_CONFIG = {
  repo: "JongMany/blog-comment",
  repoId: "R_kgDOPr6rEw",
  category: "Announcements",
  categoryId: "DIC_kwDOPr6rE84CvImW",
  mapping: "specific",
  strict: "1",
  reactionsEnabled: "0",
  inputPosition: "bottom",
  lang: "ko",
} as const;

// 테마 관련 상수
export const THEME_PATHS = {
  dark: "styles/giscus-dark.css",
  light: "styles/giscus-light.css",
} as const;

export const PRODUCTION_THEME_URLS = {
  dark: "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-dark.css",
  light:
    "https://cdn.jsdelivr.net/gh/JongMany/my-blog/apps/shell/public/styles/giscus-light.css",
} as const;
