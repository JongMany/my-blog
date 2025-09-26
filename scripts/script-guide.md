# Scripts 가이드

이 문서는 `/scripts` 폴더에 있는 각 스크립트의 역할과 사용법을 설명합니다.

## 📁 스크립트 목록

### 1. `build-blog.js`

**역할**: 블로그 콘텐츠 빌드 및 처리

**주요 기능**:

- `apps/blog/content/blog/` 폴더의 MDX 파일들을 처리
- 프론트매터 파싱 및 메타데이터 추출
- 이미지 자산 처리 및 경로 변환
- Git 커밋 정보를 활용한 날짜/버전 관리
- UTF-8 인코딩 자동 감지 및 변환
- `apps/blog/public/_blog/` 폴더에 빌드 결과물 생성

**처리 과정**:

1. **콘텐츠 스캔**: 카테고리별 MDX 파일 탐색
2. **메타데이터 추출**: 프론트매터에서 제목, 날짜, 태그 등 추출
3. **날짜 처리**: Git 커밋 정보 또는 파일 수정 시간 활용
4. **자산 처리**: 이미지 파일을 `/_blog/assets/` 경로로 복사 및 경로 변환
5. **콘텐츠 정리**: BOM 제거, 개행 정규화, 템플릿 문자 이스케이프
6. **인덱스 생성**: `index.json` 파일로 메타데이터 집계

**출력**:

- `apps/blog/public/_blog/posts/`: 처리된 MDX 파일들
- `apps/blog/public/_blog/assets/`: 이미지 등 자산 파일들
- `apps/blog/public/_blog/index.json`: 포스트 메타데이터 인덱스

---

### 2. `build-portfolio.js`

**역할**: 포트폴리오 프로젝트 빌드 및 처리

**주요 기능**:

- `apps/portfolio/content/projects/` 폴더의 MDX 파일들을 처리
- 프로젝트별 그룹핑 및 정렬
- 썸네일 이미지 특별 처리
- 커버 이미지 자동 감지 및 처리
- `apps/portfolio/public/_portfolio/` 폴더에 빌드 결과물 생성

**처리 과정**:

1. **프로젝트 스캔**: 프로젝트 MDX 파일들 탐색
2. **메타데이터 추출**: 제목, 요약, 프로젝트명, 태그 등 추출
3. **정렬 처리**: `order` 필드 우선, 날짜 순으로 정렬
4. **자산 처리**: 이미지 파일을 `/_portfolio/assets/` 경로로 복사
5. **썸네일 처리**: `/projects/thumbnails/` 경로 특별 처리
6. **인덱스 생성**: 프로젝트별 그룹핑된 인덱스 생성

**출력**:

- `apps/portfolio/public/_portfolio/projects/`: 처리된 MDX 파일들
- `apps/portfolio/public/_portfolio/assets/`: 이미지 등 자산 파일들
- `apps/portfolio/public/_portfolio/index.json`: 프로젝트 메타데이터 인덱스

---

### 3. `collect-ghp.js`

**역할**: GitHub Pages 배포용 파일 수집 및 구성

**주요 기능**:

- 각 앱의 빌드 결과물을 `dist_ghp/` 폴더로 수집
- Shell 앱을 루트로, 다른 앱들을 하위 경로로 배치
- 404 페이지 자동 생성
- Jekyll 비활성화 설정

**처리 과정**:

1. **Shell 배치**: `apps/shell/dist/` → `dist_ghp/` (루트)
2. **Remote 앱 배치**:
   - `apps/blog/dist/` → `dist_ghp/blog/`
   - `apps/portfolio/dist/` → `dist_ghp/portfolio/`
   - `apps/resume/dist/` → `dist_ghp/resume/`
3. **404 페이지 생성**: 모든 경로를 Shell로 리다이렉트
4. **Jekyll 비활성화**: `.nojekyll` 파일 생성

**출력**:

- `dist_ghp/`: GitHub Pages 배포용 최종 파일들
- `dist_ghp/404.html`: 404 리다이렉트 페이지
- `dist_ghp/.nojekyll`: Jekyll 비활성화 파일

---

### 4. `convert-mdx-to-utf8.js`

**역할**: MDX 파일 인코딩을 UTF-8로 변환

**주요 기능**:

- Git staged 파일 중 MDX 파일들만 대상
- 인코딩 자동 감지 (EUC-KR, CP949 등)
- UTF-8로 자동 변환
- 깨진 문자 감지 및 처리

**처리 과정**:

1. **Staged 파일 스캔**: Git staged 상태의 MDX 파일들 확인
2. **인코딩 감지**: `chardet` 라이브러리로 인코딩 자동 감지
3. **변환 시도**: 감지된 인코딩에서 UTF-8로 변환
4. **검증**: 깨진 문자(U+FFFD) 확인
5. **저장**: 성공 시 UTF-8로 파일 저장

**대상 파일**:

- `apps/blog/content/blog/` 하위의 `.md`, `.mdx` 파일
- Git staged 상태인 파일들만 처리

---

## 🔄 빌드 워크플로우

### 일반적인 빌드 순서:

1. **콘텐츠 준비**: MDX 파일 작성 및 커밋
2. **인코딩 변환**: `convert-mdx-to-utf8.js` (필요시)
3. **콘텐츠 빌드**: `build-blog.js`, `build-portfolio.js`
4. **앱 빌드**: 각 앱의 Vite 빌드
5. **배포 수집**: `collect-ghp.js`
6. **GitHub Pages 배포**: `dist_ghp/` 폴더 배포

### 자동화된 부분:

- **Git 정보 활용**: 커밋 날짜, 해시를 자동으로 메타데이터에 포함
- **자산 관리**: 이미지 파일 자동 복사 및 경로 변환
- **중복 방지**: 동일한 자산 파일의 중복 복사 방지
- **인코딩 처리**: 다양한 인코딩을 UTF-8로 자동 변환

## 🛠️ 사용법

### 개별 실행:

```bash
# 블로그 콘텐츠 빌드
node scripts/build-blog.js

# 포트폴리오 콘텐츠 빌드
node scripts/build-portfolio.js

# GitHub Pages 배포 파일 수집
node scripts/collect-ghp.js

# MDX 파일 UTF-8 변환
node scripts/convert-mdx-to-utf8.js
```

### 통합 빌드:

```bash
# 전체 빌드 프로세스
pnpm build:all
```

## 📝 주의사항

1. **의존성**: 각 스크립트는 Node.js 환경에서 실행되며, 특정 npm 패키지들이 필요합니다.
2. **경로**: 모든 스크립트는 프로젝트 루트에서 실행되어야 합니다.
3. **Git**: 일부 스크립트는 Git 정보에 의존하므로 Git 저장소 내에서 실행해야 합니다.
4. **파일 권한**: 파일 시스템 접근 권한이 필요합니다.
