# 🏗️ Turbo 설정 가이드

이 문서는 `turbo.json` 설정에 대한 상세한 설명을 제공합니다.

## 📋 태스크 설정

### `build` - 프로덕션 빌드

```json
{
  "dependsOn": ["^build"], // 의존성 패키지들을 먼저 빌드
  "inputs": ["$TURBO_DEFAULT$", ".env*"], // 입력 파일 패턴 (캐시 무효화 조건)
  "outputs": ["dist/**"], // 출력 디렉토리 (캐시 대상)
  "env": [
    // 빌드에 영향을 주는 환경 변수들
    "VITE_BUILD_ID", // Git 커밋 해시 (배포 추적)
    "VITE_BUILD_TIME", // 빌드 실행 시간 (버전 정보)
    "VITE_BRANCH_NAME" // Git 브랜치 이름 (환경 구분)
  ]
}
```

### `build:blog-content` - 블로그 콘텐츠 빌드

```json
{
  "inputs": [
    "apps/blog/content/**", // MDX 파일들
    "scripts/build-blog.mjs" // 빌드 스크립트
  ],
  "outputs": ["apps/blog/public/_blog/**"] // 변환된 JSON 파일들
}
```

### `lint` - 코드 린팅

```json
{
  "dependsOn": ["^lint"] // 의존성 패키지 린트 완료 후 실행
}
```

### `check-types` - 타입 체크

```json
{
  "dependsOn": ["^check-types"] // 의존성 패키지 타입 체크 완료 후 실행
}
```

### `dev` - 개발 서버

```json
{
  "cache": false, // 개발 모드는 캐시하지 않음
  "persistent": true // 서버가 계속 실행되도록 유지
}
```

## 🚀 사용법

```bash
# 모든 앱/패키지 빌드
pnpm turbo run build

# 특정 앱만 빌드
pnpm turbo run build --filter=blog

# 변경된 부분만 빌드 (캐시 활용)
pnpm turbo run build --filter="...[HEAD^]"

# 개발 서버 실행
pnpm turbo run dev
```

## 📝 환경 변수 설명

| 변수명             | 설명                 | 예시                   |
| ------------------ | -------------------- | ---------------------- |
| `VITE_BUILD_ID`    | Git 커밋 해시        | `a1b2c3d4...`          |
| `VITE_BUILD_TIME`  | 빌드 시간 (ISO 8601) | `2024-01-15T10:30:00Z` |
| `VITE_BRANCH_NAME` | Git 브랜치 이름      | `main`, `develop`      |

이 환경 변수들은 GitHub Actions에서 자동으로 주입되며, 앱에서 `import.meta.env`로 접근할 수 있습니다.
