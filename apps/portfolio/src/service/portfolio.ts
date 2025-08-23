// apps/portfolio/src/data/portfolio.ts
export type LinkItem = { label: string; href: string };
export type ImageItem = {
  src: string; // public 기준 절대 경로 (예: "/projects/slug/1.jpg")
  alt?: string;
  caption?: string; // 한 줄 설명
  note?: string; // 길게 쓰는 설명 (옵션)
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  project?: string;
  tags: string[];
  highlights?: string[];
  links?: LinkItem[];
  thumb?: string;
  images?: ImageItem[]; // string[] → ImageItem[] 로 확장
};
export type Experience = {
  company: string;
  role: string;
  period: string;
  points: string[];
};
export type Skill = {
  name: string;
  lvl: number;
};

// ▼ PDF(노션)에서 요약한 항목을 구조화 (필요 시 더 추가/수정)
export const projects: Project[] = [
  {
    slug: "tradingview-tpsl-drag",
    title: "TradingView 차트 TP/SL 드래그 UX 확장",
    summary:
      "TradingView 라이브러리를 리버스 엔지니어링을 통해 TP/SL(익절/손절) 라인을 차트에서 직접 드래그해 설정하는 내부 인터페이스를 설계·구현. 렌더·히트테스트·이벤트 파이프라인 확장",
    project: "Coinness",
    tags: ["Coinness", "기획", "리버스 엔지니어링"],
    highlights: [
      "callOnMove/onTpSl/setPnlFormula 등 내부 메서드 추가",
      "가시성 판정 → 드래그 가이드 → 주문 패널 연동 표준화",
      "드래그 종료 시 가격 규약 확립, Amending 피드백/성공·실패 핸들링",
    ],
    thumb: "/projects/tpsl.gif",
  },
  {
    slug: "market-limit-order-ui",
    title: "시장/지정가 주문을 위한 차트 내 UI",
    summary:
      "가격축 지정가·인-차트 시장가 주문 UX. iframe 내부에 Web Components(Lit) 삽입, 번들 URL 동적 로딩 아키텍처 설계.",
    project: "Coinness",
    tags: ["Web Components", "Lit", "iframe", "Vite"],
    highlights: [
      "초기 Vanilla → Lit 마이그레이션으로 캡슐화/재사용성 확보",
      "환경별 vite-manifest URL 문제를 동적 로딩 아키텍처로 해결",
    ],
    thumb: "/projects/order.gif",
  },
  {
    slug: "stability-refactor",
    title: "데이터 안정성/구독 라이프사이클 리팩토링",
    project: "Coinness",
    summary:
      "소켓 불안정 시 HTTP Polling 폴백, 주문/체결 오버레이 추가, iframe 구독 라이프사이클 누수 해결(useLayoutEffect).",
    tags: ["Resilience", "WebSocket", "Polling", "React"],
  },
  {
    slug: "vite-plugin-lit-hmr",
    title: "Lit 컴포넌트 HMR 개선용 Vite 플러그인",
    project: "Coinness",
    summary:
      "iframe 내부 Lit 컴포넌트 수정 시 HMR 미동작 문제를 플러그인으로 해결.",
    tags: ["Vite", "HMR", "Plugin", "Lit"],
  },
  {
    slug: "chart-migration",
    title: "자체 차트 → TradingView 마이그레이션",
    project: "Coinness",
    summary: "WebView 임베딩 계층을 설계해 Vanilla → React 기반으로 점진 이관.",
    tags: ["Migration", "TradingView", "WebView", "React"],
  },
  {
    slug: "sse-llm-streaming",
    title: "SSE 기반 LLM 스트리밍 UX",
    summary:
      "패턴 분석기·스케줄러로 배치 크기/렌더 간격 동적 조절, RAF 버퍼링, 자동 스크롤 등 지터 최소화.",
    project: "Bubblechat",
    tags: ["SSE", "Streaming", "UX", "Perf"],
    highlights: [
      "StreamPatternAnalyzer/StreamScheduler 설계",
      "MSW 모킹으로 지연/에러 시나리오 테스트 생산성↑",
    ],
  },
  {
    slug: "multi-image-purchase",
    title: "멀티 이미지 업로드/구매",
    project: "Bubblechat",
    summary:
      "flushSync로 클릭 직후 로딩 동기 반영 → 중복 호출/결제 방지. 구매 후 배경 자동 갱신(캐시 무효화).",
    tags: ["Concurrent UI", "Cache", "UX"],
  },
  {
    slug: "keywordbook-dnd",
    title: "키워드북 + DnD",
    project: "Bubblechat",
    summary:
      "react-beautiful-dnd → @atlaskit/pragmatic-dnd 전환, 모바일 터치/스크롤 연동 개선.",
    tags: ["DnD", "State", "A11y"],
  },
  {
    slug: "chat-history-edit",
    title: "대화 히스토리 수정/삭제 & 무한 스크롤",
    summary:
      "커서 기반 페이지네이션, 상단 프리펜드, 스크롤 앵커 복원, 선택 상태 일관성 유지.",
    tags: ["Pagination", "Virtualization", "React"],
  },
  {
    slug: "tiptap-chip",
    title: "TipTap 칩 변환 알고리즘",
    project: "Bubblechat",
    summary:
      "{{assistant}}/{{user}} 토큰을 칩 노드로 자동 변환, NodeView 렌더링, 복붙 호환 직렬화 규칙.",
    tags: ["TipTap", "Editor", "InputRule"],
  },
  {
    slug: "reward-service",
    title: "리워드(에셋 수익 공유) 서비스",
    project: "Bubblechat",
    summary: "서브도메인 SSO, 출금 플로우 테스트 강화, 플로우 중복 호출 방지.",
    tags: ["SSO", "Payments", "QA"],
  },
  {
    slug: "likes-favorites",
    title: "좋아요/즐겨찾기",
    project: "Bubblechat",
    summary: "Optimistic Update + 실패 롤백, 다중 뷰 캐시 키 일관성 유지.",
    tags: ["Optimistic", "Caching"],
  },
  {
    slug: "logging-adapter",
    title: "통합 로그 어댑터",
    project: "Bubblechat",
    summary:
      "공통 이벤트 스키마 + Adapter 패턴으로 GA4/X Pixel/Airbridge/네이버 프리미엄 로그 통합.",
    tags: ["Analytics", "Adapter", "TypeSafe"],
  },
  {
    slug: "eslint-i18n",
    title: "ESLint i18n 규칙",
    project: "Bubblechat",
    summary:
      "번역 키 누락/오타를 규칙화해 에디터 단계에서 검출, 리뷰 비용 절감.",
    tags: ["ESLint", "i18n", "DX"],
  },
];

export const experiences: Experience[] = [
  {
    company: "Coinness",
    role: "Frontend Engineer",
    period: "2025.07 - Now",
    points: [
      "TradingView 확장(TP/SL 드래그, 주문 UX) 및 안정성 리팩토링",
      "차트/주문/체결 가시화, iframe 기반 Web Components 인프라",
    ],
  },
  {
    company: "Bubblechat",
    role: "Frontend Engineer",
    period: "2024.10 - 2025.06",
    points: [
      "SSE 스트리밍 UX 최적화, 멀티 이미지/구매 플로우",
      "키워드북·DnD·채팅 히스토리/칩 변환, 로깅/QA/ESLint",
    ],
  },
];

export const skills: Skill[] = [
  { name: "TypeScript", lvl: 80 },
  { name: "React", lvl: 80 },
  { name: "Zustand", lvl: 75 },
  { name: "Tanstack Query", lvl: 70 },
  { name: "TailwindCSS", lvl: 60 },
  { name: "Styled Components", lvl: 75 },
  { name: "TradingView", lvl: 60 },
  { name: "Nest.js", lvl: 60 },
  { name: "TypeORM", lvl: 60 },
  { name: "PostgreSQL", lvl: 50 },
];
