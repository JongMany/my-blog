# Portfolio - 마이크로프론트엔드 포트폴리오 앱

React + TypeScript + Vite 기반의 마이크로프론트엔드 포트폴리오 애플리케이션입니다.

## 🚀 주요 기능

- **마이크로프론트엔드**: Module Federation을 통한 독립적인 배포
- **MDX 지원**: 마크다운과 React 컴포넌트를 함께 사용
- **프로젝트 상세**: 각 프로젝트의 상세 정보와 기술 스택 표시
- **실시간 HMR**: 개발 중 실시간 핫 리로드
- **Tailwind CSS**: 유틸리티 퍼스트 CSS 프레임워크
- **TypeScript**: 타입 안전성 보장
- **폼 관리**: TanStack Form과 Zod를 활용한 폼 검증
- **다이어그램**: Mermaid를 활용한 다이어그램 렌더링

## ⚙️ Vite 설정

### 플러그인 구성

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    react(), // React 지원
    tailwindcss(), // Tailwind CSS
    federation({
      // Module Federation
      name: "portfolio",
      filename: "remoteEntry.js",
      exposes: { "./routes": "./src/routes.tsx", "./App": "./src/App.tsx" },
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
    notifyOnRebuild({
      // HMR 동기화
      appName: "portfolio",
      hostUrl: "http://localhost:3000",
      endpoint: "/__remote_rebuilt__",
      notifyOnSuccessOnly: true,
    }),
  ],
});
```

### 개발 서버 설정

- **포트**: 3002
- **HMR**: 실시간 핫 리로드 지원
- **CORS**: 마이크로프론트엔드 통신을 위한 CORS 헤더 설정

### 빌드 설정

- **타겟**: ESNext
- **압축**: 비활성화 (개발용)
- **CSS 분할**: 비활성화 (단일 번들)

## 🏗️ 마이크로프론트엔드 아키텍처

```
Shell App (포트 3000)
├── Blog App (포트 3001)
├── Portfolio App (포트 3002) ← 현재 앱
└── Resume App (포트 3003)
```

### Module Federation 설정

- **앱 이름**: `portfolio`
- **노출 모듈**: `routes`, `App`
- **공유 의존성**: React, React Router, TanStack Query, TanStack Form, Zustand

### HMR 동기화

`@antdevx/vite-plugin-hmr-sync`를 사용하여:

- 각 마이크로프론트엔드의 변경사항을 Shell 앱에 실시간 알림
- 개발 중 통합된 개발 환경 유지
- 성공적인 빌드 시에만 알림 전송

## 📦 사용된 주요 패키지

- **React 19.1.1**: UI 라이브러리
- **React Router 7.8.1**: 클라이언트 사이드 라우팅
- **TanStack Query 5.85.3**: 서버 상태 관리
- **TanStack Form 1.19.2**: 폼 상태 관리
- **Zustand 5.0.7**: 클라이언트 상태 관리
- **MDX**: 마크다운 + React 컴포넌트
- **Framer Motion 12.23.12**: 애니메이션 라이브러리
- **Mermaid 11.11.0**: 다이어그램 라이브러리
- **Zod 4.0.17**: 스키마 검증 라이브러리
- **Tailwind CSS**: 유틸리티 퍼스트 CSS

## 🛠️ 개발 명령어

```bash
# 개발 서버 시작
pnpm dev

# 마이크로프론트엔드 개발 모드
pnpm dev:mfe

# 빌드
pnpm build

# GitHub Pages용 빌드
pnpm build:ghp

# 미리보기
pnpm preview
```

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
