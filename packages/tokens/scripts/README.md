# 📦 Token Build Scripts

이 디렉토리는 TypeScript 소스에서 CSS 파일을 생성하는 빌드 스크립트들을 포함합니다.

## 🏗️ 아키텍처

오픈소스 모범 사례를 참고한 개선된 빌드 시스템:

- **Vite 스타일**: 병렬 실행, 의존성 해결, 구조화된 로깅
- **Tailwind CSS 스타일**: 모듈화된 생성기, 플러그인 아키텍처
- **Style Dictionary 스타일**: 토큰 변환 파이프라인, Single Source of Truth

## 📋 스크립트 구조

### 핵심 스크립트

1. **`color-tokens.js`** - Primitive 색상 토큰 CSS 생성
   - 모든 색상 스케일(gray, blue, green 등)의 CSS 변수 생성
   - sRGB 및 Display P3 색상 공간 지원

2. **`color-roles-css.js`** - 색상 역할 CSS 생성
   - 각 색상 스케일의 역할(surface, indicator, track) 정의
   - Light/Dark 테마 지원

3. **`color-css.js`** - 색상 인덱스 CSS 생성
   - 모든 색상 CSS 파일을 통합하는 인덱스 파일

4. **`generate-tokens.mjs`** - Semantic & Tailwind 토큰 생성
   - Semantic 토큰 CSS 자동 생성 (TypeScript 소스에서)
   - Tailwind CSS v4 @theme 블록 생성
   - **Single Source of Truth**: TypeScript 소스만 수정하면 자동 업데이트
   - 구조화된 로깅 및 에러 핸들링

5. **`build-css.mjs`** - 통합 CSS 빌드 스크립트
   - Spacing, Radius, Typography, Scaling, Cursor, Shadow CSS 생성
   - Base.css 및 Index.css 생성
   - **병렬 실행**: 독립적인 작업들을 동시에 실행
   - **의존성 해결**: 작업 간 의존성 자동 관리
   - **성능 측정**: 각 작업의 실행 시간 추적

### 유틸리티

- **`utils/build-utils.mjs`** - 공통 빌드 유틸리티
  - 설정 관리 (`loadConfig`)
  - 파일 시스템 유틸리티 (`ensureDir`, `writeFile`, `loadModule`)
  - 로깅 시스템 (`Logger`)
  - 작업 실행 엔진 (`executeTasks`)

## 🔄 빌드 순서

빌드 프로세스는 다음 순서로 실행됩니다:

```bash
1. color-tokens.js      # Primitive 색상 토큰
2. color-roles-css.js   # 색상 역할
3. color-css.js         # 색상 인덱스
4. generate-tokens.mjs  # Semantic & Tailwind 토큰
5. build-css.mjs        # 나머지 primitive 토큰 + 집계 파일 (병렬 실행)
```

## ✨ 개선 사항

### ✅ 성능 최적화

- **병렬 실행**: 독립적인 작업들을 `Promise.all`로 동시 실행
- **의존성 해결**: 작업 간 의존성 자동 관리
- **성능 측정**: 각 작업의 실행 시간 추적

### ✅ 개발자 경험

- **구조화된 로깅**: 작업별 성공/실패, 실행 시간 표시
- **빌드 요약**: 전체 빌드 통계 제공
- **에러 핸들링**: 명확한 에러 메시지와 스택 트레이스

### ✅ 코드 품질

- **모듈화**: 공통 유틸리티 분리
- **타입 안전성**: JSDoc 타입 주석
- **설정 분리**: 설정을 별도 함수로 관리

### ✅ 유지보수성

- **Single Source of Truth**: TypeScript 소스만 수정
- **명확한 구조**: 각 스크립트의 역할이 명확
- **확장 가능**: 새로운 토큰 타입 추가가 쉬움

## 📊 빌드 출력 예시

```
ℹ️  Starting CSS build process...

✅ shadow (2ms)
✅ spacing (3ms)
✅ radius (2ms)
✅ cursor (3ms)
✅ typography (3ms)
✅ scaling (3ms)
✅ base (0ms)
✅ index (1ms)

==================================================
📊 Build Summary
   Total tasks: 8
   ✅ Successful: 8
   ⏱️  Total time: 6ms
==================================================

🎉 All CSS files built successfully!
```

## 🎯 스크립트 추가 가이드

새로운 primitive 토큰 CSS를 추가하려면:

1. `build-css.mjs`에 새로운 생성 함수 추가
2. `buildAllCSS()`의 `tasks` 배열에 작업 추가
3. 의존성이 있다면 `deps` 배열에 추가

예시:

```javascript
async function generateNewTokenCSS() {
  const module = await loadModule("dist/new-token.js");
  const outputDir = path.join(config.cssOutputDir, "new-token");
  await ensureDir(outputDir);

  const css = `:root { /* ... */ }`;
  writeFile(path.join(outputDir, "index.css"), css);
}

// tasks 배열에 추가
{
  name: "new-token",
  fn: generateNewTokenCSS,
  parallel: true, // 또는 false
  deps: [], // 필요한 의존성
}
```

## ⚠️ 주의사항

- **순서 중요**: 색상 관련 스크립트는 반드시 먼저 실행되어야 함
- **TypeScript 빌드 필수**: `generate-tokens.mjs`는 컴파일된 TypeScript를 필요로 함
- **병렬 실행**: 독립적인 작업만 병렬로 실행 가능

## 🔗 참고 자료

- [Vite Build System](https://vitejs.dev/)
- [Tailwind CSS Plugin Architecture](https://tailwindcss.com/docs/plugins)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)
