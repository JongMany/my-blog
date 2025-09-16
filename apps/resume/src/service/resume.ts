export type Bullet = {
  text: string;
  tags?: string[];
  children?: Bullet[]; // ← 하위 불릿(들여쓰기) 지원
  portfolioLinks?: PortfolioLink[]; // ← 포트폴리오 링크들
};

export type PortfolioLink = {
  title: string;
  url: string;
  type?: "portfolio" | "demo" | "github" | "blog" | "other";
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
    personalSite?: string;
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
      "사용자 경험을 최우선으로 생각하며, 복잡한 기술적 문제를 창의적으로 해결하는 Frontend Developer입니다.",
      "암호화폐 거래소와 AI 채팅 플랫폼에서 핵심 기능을 개발하여 실제 사용자들의 만족도를 높였습니다.",
      "기술의 본질을 이해하고, 더 나은 사용자 경험을 위해 지속적으로 개선하는 것을 추구합니다.",
    ],
    email: "blackberry1114@naver.com",
    github: "https://github.com/JongMany",
    blog: "https://homebody-coder.tistory.com/",
    portfolio: "https://jongmany.github.io/portfolio/",
    personalSite: "https://jongmany.github.io/my-blog/",
    photoUrl: "/img/profile.jpeg",
  },
  experiences: [
    {
      company: "아데나 소프트웨어 (코인니스)",
      role: "Frontend Developer",
      period: "2025.07 - now",
      summary:
        "암호화폐 거래소의 핵심 거래 기능을 개발하여 사용자들이 더 쉽고 안전하게 거래할 수 있도록 개선했습니다. 차트에서 바로 주문할 수 있는 직관적인 인터페이스와 실시간 데이터 처리로 거래 경험을 혁신했습니다.",
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
          text: "TradingView 차트 내 TP/SL 드래그 UX 확장",
          portfolioLinks: [
            {
              title: "드래그 UX 구현 과정",
              url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-tpsl-drag",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "기존에 불가능했던 차트 내 익절/손절 설정을 드래그 앤 드롭으로 구현하여 거래 편의성 대폭 향상",
            },
            {
              text: "실시간 손익 계산으로 사용자가 거래 전 수익을 미리 확인할 수 있도록 개선",
            },
          ],
        },
        {
          text: "차트 내 시장가/지정가 주문 UI 시스템",
          portfolioLinks: [
            {
              title: "원클릭 거래 시스템 구현",
              url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-chart-order-ui",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "차트에서 바로 시장가/지정가 주문이 가능한 원클릭 거래 시스템 구축",
            },
            {
              text: "안정적인 실시간 데이터 동기화로 거래 오류 최소화 및 사용자 신뢰도 향상",
            },
          ],
        },
        {
          text: "WebSocket 자동 HTTP Fallback 시스템",
          portfolioLinks: [
            {
              title: "Fallback 시스템 설계",
              url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-http-fallback",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "네트워크 불안정 시 자동으로 백업 시스템으로 전환하여 거래 중단 없는 서비스 제공",
            },
            {
              text: "실시간 모니터링 도구로 문제 발생 시 즉시 대응 가능한 시스템 구축",
            },
          ],
        },
        {
          text: "TradingView 아키텍처 리팩토링",
          portfolioLinks: [
            {
              title: "아키텍처 리팩토링 과정",
              url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-architecture-refactoring",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "복잡한 거래 로직을 명확한 구조로 재설계하여 개발 속도 향상 및 버그 감소",
            },
            {
              text: "실시간 디버깅 도구로 문제 해결 시간 단축 및 서비스 품질 향상",
            },
          ],
        },
      ],
    },
    {
      company: "아데나 소프트웨어 (버블탭)",
      role: "Frontend Developer",
      period: "2024.10 - 2025.06",
      summary:
        "AI 채팅 플랫폼에서 사용자들이 더 자연스럽고 편리하게 AI와 대화할 수 있도록 핵심 기능들을 개발했습니다. 실시간 대화, 직관적인 에디터, 안정적인 미디어 처리로 사용자 만족도를 크게 향상시켰습니다.",
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
          text: "AI 캐릭터 지능형 텍스트 파싱 시스템",
          portfolioLinks: [
            {
              title: "텍스트 파싱 알고리즘",
              url: "https://jongmany.github.io/my-blog/portfolio/project/ai-character-text-parsing",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "복잡한 템플릿 문법을 직관적인 시각적 칩으로 변환하여 사용자 학습 비용 대폭 감소",
            },
            {
              text: "키보드만으로도 편리하게 편집할 수 있는 UX로 창작자들의 생산성 향상",
            },
          ],
        },
        {
          text: "SSE 기반 LLM 실시간 스트리밍 시스템",
          portfolioLinks: [
            {
              title: "SSE 스트리밍 구현",
              url: "https://jongmany.github.io/my-blog/portfolio/project/llm-sse-streaming",
              type: "portfolio",
            },
            {
              title: "실시간 대화 데모",
              url: "https://jongmany.github.io/my-blog/portfolio/project/sse-llm-streaming",
              type: "demo",
            },
          ],
          children: [
            {
              text: "AI 응답을 실시간으로 스트리밍하여 마치 사람과 대화하는 것처럼 자연스러운 경험 제공",
            },
            {
              text: "연결 문제 발생 시 자동으로 복구하여 끊김 없는 대화 환경 구축",
            },
          ],
        },
        {
          text: "AI 캐릭터 리워드 서비스 및 SSO 시스템",
          portfolioLinks: [
            {
              title: "수익 분배 시스템 및 SSO 구현",
              url: "https://jongmany.github.io/my-blog/portfolio/project/ai-character-reward-service",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "투명한 수익 분배 시스템으로 창작자들의 동기 부여 및 플랫폼 콘텐츠 품질 향상",
            },
            {
              text: "안정적인 결제 시스템으로 창작자와 사용자 모두 신뢰할 수 있는 환경 조성",
            },
          ],
        },
        {
          text: "실시간 텍스트 검열 시스템",
          portfolioLinks: [
            {
              title: "Aho-Corasick 알고리즘 기반 실시간 필터링",
              url: "https://jongmany.github.io/my-blog/portfolio/project/realtime-text-filtering-system",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "실시간 부적절한 콘텐츠 필터링으로 깨끗한 대화 환경 유지",
            },
            {
              text: "사용자 등급별 맞춤형 검열로 과도한 제재 없이 자유로운 소통 보장",
            },
          ],
        },
        {
          text: "다중 분석 플랫폼 통합 로그 수집 시스템",
          portfolioLinks: [
            {
              title: "통합 로깅 아키텍처",
              url: "https://jongmany.github.io/my-blog/portfolio/project/multi-platform-analytics-integration",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "GA4, Airbridge, X Pixel, 네이버로그 등 4개 분석 플랫폼을 통합 관리하여 데이터 일관성 확보",
            },
            {
              text: "확장 가능한 로깅 아키텍처로 신규 분석 플랫폼 추가 시 개발 시간 단축",
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
      gpaMajor: "전공 평점 4.23 / 4.5",
      gpaOverall: "평균 평점 4.12 / 4.5",
    },
  ],
  activities: [
    {
      title: "항해플러스 프론트엔드 1기",
      bullets: [
        "시니어 개발자 분들의 멘토링을 받으며, 10주 동안 React 작동 원리, TDD, 성능 최적화 등 주니어 프론트엔드 개발자가 알아야 할 내용을 학습하고, 팀별로 하나의 프로젝트를 완성하는 프로그램을 진행했습니다.",
      ],
    },
    {
      title: "광운대학교 IDEA Lab",
      bullets: [
        "연구실 내 학부연구생으로 LLM 기반 인채 채용 서비스 / 교육 환경에서의 시선 추적 서비스를 구현하였습니다.",
        "연구실 내에서 스터디장을 맡아 커리큘럼을 설계하고 학부연구생들과 함께 프론트엔드 스터디를 진행했습니다.",
      ],
    },
  ],
  skills: [
    "React",
    "TypeScript",
    "Vite",
    "TanStack Query",
    "Zustand",
    "Tailwind CSS",
    "Styled Components",
    "Lit",
    "WebSocket",
    "TradingView",
    "Pnpm",
    "Yarn",
  ],
};
