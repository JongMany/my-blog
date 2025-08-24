export type Bullet = {
  text: string;
  tags?: string[];
  children?: Bullet[]; // ← 하위 불릿(들여쓰기) 지원
};

export type Experience = {
  company: string;
  role: string;
  period: string;
  summary?: string; // ← 경력 요약(문단)
  stacks?: string[]; // 칩으로 표시
  bullets: Bullet[]; // 중첩 불릿
};
export type Education = {
  school: string;
  degree?: string;
  period: string;
  gpaMajor?: string;
  gpaOverall?: string;
  note?: string;
};
export type Activity = { title: string; period?: string; bullets: string[] };
export type ResumeData = {
  profile: {
    name: string;
    tagline: string;
    intro: string[];
    email: string;
    github?: string;
    blog?: string;
    portfolio?: string;
    photoUrl?: string;
  };
  experiences: Experience[];
  education: Education[];
  activities: Activity[];
  skills?: string[];
};

export const resume: ResumeData = {
  profile: {
    name: "이종민",
    tagline: "Frontend Developer",
    intro: [
      "코드 리뷰를 통해 코드에 대한 견해를 맞춰나가는 행위를 통해 성장하는 것을 즐깁니다.",
      "누구나 이해할 수 있고 책임이 분명한 코드를 위해 끊임없이 고민합니다.",
      "UX를 최우선으로 기획자와 적극 소통하여 실험·제안을 주도합니다.",
    ],
    email: "blackberry1114@naver.com",
    github: "https://github.com/JongMany",
    blog: "https://homebody-coder.tistory.com/",
    portfolio:
      "https://assorted-raft-812.notion.site/2440c6f9362d803b99f6eaa3cf0e85af",
    photoUrl: "/img/profile.jpeg",
  },
  experiences: [
    {
      company: "아데나 소프트웨어 (코인니스)",
      role: "Frontend Developer",
      period: "2025.07 - now",
      summary:
        "코인니스 서비스 내 암호화폐 선물 거래소 출시 기여. 차트 내 거래 기능을 기획/개발하여 거래 사용성 개선.",
      stacks: [
        "Yarn",
        "React",
        "TypeScript",
        "Tanstack Query",
        "Zustand",
        "Tailwindcss",
      ],
      bullets: [
        {
          text: "TradingView Platform 라이브러리를 활용한 거래소 내 차트 서비스 구현",
          children: [
            {
              text: "소켓 연결 불안정 시 HTTP 폴링으로 자동 폴백하여, 네트워크 품질이 낮은 환경에서도 차트 데이터가 안정적으로 갱신되도록 개선",
            },
            {
              text: "TradingView widget 이벤트 구독 라이프사이클을 useLayoutEffect로 동기화하여, 리렌더·리마운트 시 중복 구독 또는 메모리 누수 없이 안전하게 이벤트 해제, 위젯의 장시간 사용 안정성 확보",
            },
            {
              text: "거래 Panel UI를 Vanilla JS에서 Lit 기반 Web Component로 리팩토링하여 유지보수성 및 재사용성 강화",
            },
            {
              text: "Vite manifest 기반 엔트리 해석기와 iframe 모듈 로더를 TypeScript로 설계·구현하여, 배포 환경별 커스텀 엘리먼트 로딩 실패율을 0%로 감소",
            },
          ],
        },
        {
          text: "차트 내 거래 UX 기획, 구현",
          children: [
            {
              text: "TradingView 차트에 사용자 현재 포지션·주문 라인 표시 기능을 추가하여, 차트 화면만으로도 실시간 보유 포지션과 주문 상태를 직관적으로 파악, 주문·포지션 확인 과정의 전환 필요성을 제거",
            },
            {
              text: "TP/SL 라인 드로잉 기능 구현을 위해 TradingView 라이브러리 내부 소스를 분석·수정하여, 사용자가 손익 목표를 직접 차트 상에서 시각적으로 설정·조정 가능, 목표가/손절가 입력 절차 단순화",
            },
            {
              text: "시장가·지정가 주문 패널 UI를 추가하여, 차트 화면 내에서 주문 유형 전환 및 가격 설정을 즉시 수행 가능, 별도 주문 화면 이동 없이 빠른 매매 작업 환경 제공",
            },
          ],
        },
        {
          text: "DX 개선",
          children: [
            {
              text: "Lit 컴포넌트의 HMR 지원 Vite 플러그인을 개발하여, 개발 중 UI 변경사항을 실시간 반영, iframe 기반 환경에서도 개발·테스트 속도 향상",
            },
          ],
        },
      ],
    },
    {
      company: "아데나 소프트웨어 (버블탭)",
      role: "Frontend Developer",
      period: "2024.10 - 2025.06",
      summary: "AI 채팅 플랫폼 버블챗/팅글 프론트엔드 개발 담당.",
      stacks: [
        "Pnpm",
        "React",
        "TypeScript",
        "Tanstack Query",
        "Zustand",
        "Styled-Component",
      ],
      bullets: [
        {
          text: "기능 추가",
          children: [
            {
              text: "에디터 내에서 특정 키워드를 칩 UI로 자동 변환하는 알고리즘 구현, 유저 니즈 충족",
            },
            {
              text: "Web Worker 기반 MP4 → Animated WebP 변환 로직에 Blob 변환 적용, 다중 업로드 시 UI 프리징 현상 수정",
            },
            {
              text: "ImageDecoder API로 Animated WebP 프레임 제어 기능 구현(정밀 재생/정지/프레임 탐색)",
            },
            {
              text: "유저의 챗봇 수익을 공유하는 신규 서비스 런칭에 기여(창작자·플랫폼 수익 분배 모델)",
            },
            {
              text: "유저 입력의 부적절한 단어 자동 검열 기능 구현(Z), 커뮤니티 가이드라인 준수/신뢰성 확보",
            },
            {
              text: "결제/구매 등 핵심 비즈니스 로직 테스트 코드 작성, 장애 발생 가능성 최소화",
            },
          ],
        },
        {
          text: "UX 개선",
          children: [
            {
              text: "기존 JSON 기반 LLM 응답 방식을 SSE 스트리밍 기반으로 전환 PoC, 응답이 순차 표시되어 실시간 피드백 UX 제공 및 체감 대기 시간 단축",
            },
            {
              text: "대량 이미지 업로드 시 가상 스크롤(virtualized list) 도입, 수백 개 이미지도 스크롤 지연 없이 렌더링·메모리 최적화",
            },
            {
              text: "Chrome/Firefox/Safari/Samsung Internet 및 데스크톱·iOS·Android 전반 크로스 브라우저/디바이스 호환성 지원",
            },
          ],
        },
        {
          text: "DX 개선",
          children: [
            {
              text: "GA4, X Pixel, Airbridge, 네이버 프리미엄 로그를 추상화한 통합 로깅 클래스 설계·구현, 플랫폼별 로깅 인터페이스 통일",
            },
            {
              text: "번역 키 누락 방지 ESLint 규칙 개발, i18n 키 오타/누락을 개발 단계에서 실시간 검출",
            },
            {
              text: "Turborepo JIT 환경 타입 해석(절대 경로) 실패 이슈 원인 분석·수정, 모노레포 전역 안정적 타입 참조 확보",
            },
            {
              text: "백오피스 메뉴 검색 패널·즐겨찾기 기능 추가, 운영자 접근성 향상으로 업무 효율 증대",
            },
          ],
        },
      ],
    },
  ],
  education: [
    {
      school: "광운대학교",
      degree: "정보융합학부",
      period: "2018.03 - 2025.02",
      gpaMajor: "전공 4.23 / 4.5",
      gpaOverall: "평균 4.12 / 4.5",
      note: "졸업",
    },
  ],
  activities: [
    {
      title: "항해플러스 프론트엔드 1기",
      bullets: ["React·TDD·성능 최적화 심화", "10주 팀 프로젝트 완성"],
    },
    {
      title: "광운대학교 IDEA Lab",
      bullets: [
        "LLM 채용/시선추적 서비스 구현",
        "스터디장으로 커리큘럼 설계·진행",
      ],
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Vite",
    "Module Federation",
    "TanStack Query",
    "Zustand",
    "Tailwind",
    "Lit",
    "SSE",
    "WebSocket",
  ],
};
