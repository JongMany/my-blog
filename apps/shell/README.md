# Shell - 마이크로프론트엔드 셸 앱

React + TypeScript + Vite 기반의 마이크로프론트엔드 셸 애플리케이션입니다. 모든 마이크로프론트엔드 앱들을 통합하고 관리하는 중앙 허브 역할을 합니다.

## 🚀 주요 기능

- **마이크로프론트엔드 통합**: Module Federation을 통한 여러 앱 통합
- **동적 로딩**: 필요에 따라 마이크로프론트엔드 앱들을 동적으로 로드
- **HMR 동기화**: 모든 마이크로프론트엔드의 변경사항을 실시간으로 감지
- **성능 최적화**: preload/prefetch를 통한 리소스 최적화
- **CORS 처리**: 마이크로프론트엔드 간 통신을 위한 CORS 설정
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **TypeScript**: 타입 안전성 보장

## ⚙️ Vite 설정

### 플러그인 구성

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(), // React 지원
    {
      // giscus 스타일 cors에러 처리
      name: "giscus-cors",
      apply: "serve",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith("/styles/")) {
            res.setHeader("Access-Control-Allow-Origin", "*");
          }
          next();
        });
      },
    },
    tailwindcss(), // Tailwind CSS
    federation({
      // Module Federation
      name: "shell",
      remotes: remotes,
      shared: {
        react: { version: pkg.dependencies.react },
        "react-dom": { version: pkg.dependencies["react-dom"] },
        "react-router-dom": { version: pkg.dependencies["react-router-dom"] },
        "@tanstack/react-query": {
          version: pkg.dependencies["@tanstack/react-query"],
        },
        "@tanstack/react-form": {
          version: pkg.dependencies["@tanstack/react-form"],
        },
        zustand: { version: pkg.dependencies.zustand },
        "@mfe/shared": { version: "0.0.0" },
      },
    }),
    injectRemoteHints(), // 성능 최적화
    listenForRemoteRebuilds({
      // HMR 동기화
      allowedApps: ["blog", "portfolio", "resume"],
      endpoint: "/__remote_rebuilt__",
      hotPayload: { type: "full-reload", path: "*" },
    }),
  ],
});
```

### 개발 서버 설정

- **포트**: 3000 (메인 셸 앱)
- **HMR**: 실시간 핫 리로드 지원
- **CORS**: 마이크로프론트엔드 통신을 위한 CORS 헤더 설정

### 빌드 설정

- **타겟**: ESNext
- **압축**: 비활성화 (개발용)
- **모듈 프리로드**: 비활성화 (Module Federation과 충돌 방지)
- **CSS 분할**: 활성화 (성능 최적화)

## 🏗️ 마이크로프론트엔드 아키텍처

```
Shell App (포트 3000) ← 현재 앱
├── Blog App (포트 3001)
├── Portfolio App (포트 3002)
└── Resume App (포트 3003)
```

### Module Federation 설정

- **앱 이름**: `shell`
- **원격 앱들**: blog, portfolio, resume
- **공유 의존성**: React, React Router, TanStack Query, TanStack Form, Zustand

### 원격 앱 설정

**개발 환경:**

```typescript
const remotes = {
  blog: "http://localhost:3001/assets/remoteEntry.js",
  portfolio: "http://localhost:3002/assets/remoteEntry.js",
  resume: "http://localhost:3003/assets/remoteEntry.js",
};
```

**프로덕션 환경:**

```typescript
const remotes = {
  blog: `/my-blog/blog/assets/remoteEntry.js${q}`,
  portfolio: `/my-blog/portfolio/assets/remoteEntry.js${q}`,
  resume: `/my-blog/resume/assets/remoteEntry.js${q}`,
};
```

### 성능 최적화

**injectRemoteHints 플러그인:**

- **preload**: 첫 화면에 필요한 blog 앱을 즉시 로드
- **prefetch**: 나머지 앱들(portfolio, resume)을 백그라운드에서 미리 로드

### HMR 동기화

`@antdevx/vite-plugin-hmr-sync`를 사용하여:

- 각 마이크로프론트엔드의 변경사항을 실시간으로 감지
- 변경된 앱이 재빌드되면 셸 앱도 자동으로 새로고침
- 개발 중 통합된 개발 환경 유지

## 📦 사용된 주요 패키지

- **React 19.1.1**: UI 라이브러리
- **React Router 7.8.1**: 클라이언트 사이드 라우팅
- **TanStack Query 5.85.3**: 서버 상태 관리
- **TanStack Form 1.19.2**: 폼 상태 관리
- **Zustand 5.0.7**: 클라이언트 상태 관리
- **Framer Motion 12.23.12**: 애니메이션 라이브러리
- **React Helmet Async 2.0.5**: SEO 메타 태그 관리
- **Radix UI Themes 3.2.1**: UI 컴포넌트 라이브러리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작
pnpm dev

# 마이크로프론트엔드 개발 모드
pnpm dev:mfe

# 빌드 (토큰 패키지도 함께 빌드)
pnpm build

# GitHub Pages용 빌드
pnpm build:ghp

# 미리보기
pnpm preview
```

## 🔧 특별한 기능

### CORS 처리

- giscus 댓글 시스템을 위한 CORS 헤더 자동 설정
- `/styles/` 경로에 대한 CORS 허용

### 동적 빌드 ID

- GitHub Actions에서 주입되는 빌드 ID를 통한 캐시 무효화
- 프로덕션 환경에서 자동으로 쿼리 파라미터 추가

### 에러 바운더리

- 마이크로프론트엔드 로딩 실패 시 graceful fallback
- 재시도 메커니즘을 통한 안정성 확보

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
