import type { ResumeData } from "./types";

export const resume: ResumeData = {
  profile: {
    name: "이종민",
    tagline: "Frontend Developer",
    intro: [
      "사용자 경험을 최우선으로 생각하며, 복잡한 기술적 문제를 해결하는 Frontend Developer입니다.",
      "암호화폐 거래소와 AI 채팅 플랫폼에서 핵심 기능을 개발하여 실제 사용자들의 만족도를 높였습니다.",
      "기술의 본질을 이해하고, 더 나은 사용자 경험을 위해 지속적으로 개선하는 것을 추구합니다.",
      "부족한 점을 인지하고 채워넣는 과정을 좋아합니다.",
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
        "국내 최대 암호화폐 및 가상자산 투자 정보 미디어 서비스인 코인니스 내의 암호화폐 거래소 서비스를 개발했습니다. 암호화폐 거래소의 핵심 거래 기능을 개발하여 사용자들이 더 쉽고 안전하게 거래할 수 있도록 개선했습니다.",
      stacks: [
        "Yarn",
        "React",
        "TypeScript",
        "Tanstack Query",
        "Zustand",
        "Tailwindcss",
      ],
      keywordImageMap: {
        "TP/SL 드래그 UX": "/assets/tpsl.gif",
        "웹소켓 디버깅 툴": "/assets/socket-devtools.gif",
        "시장가/지정가 주문 UI": "/assets/limit-order-panel.gif",
        "HTTP Polling Fallback 시스템": "/assets/websocket-fallback.png",
      },
      bullets: [
        {
          text: "TradingView 차트 내 [TP/SL 드래그 UX] 확장",
          portfolioLinks: [
            {
              title: "드래그 UX 구현 과정",
              url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-tpsl-drag",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "기존 라이브러리에서 불가능했던 차트 내 익절/손절 설정 인터페이스를 거래 편의성 대폭 향상",
            },
            {
              text: "실시간 손익 계산으로 드래그 시 사용자가 거래 전 수익을 미리 확인할 수 있도록 개선",
            },
          ],
        },
        {
          text: "차트 내 [시장가/지정가 주문 UI] 시스템",
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
          text: "웹소켓 불안정 시 [HTTP Polling Fallback 시스템] 개발",
          portfolioLinks: [
            {
              title: "Fallback 시스템 설계",
              url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-http-fallback",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "웹소켓 서버 불안정 시 웹소켓 → HTTP Polling 자동 전환,",
            },
            {
              text: "웹소켓 서버 복구 시 웹소켓 연결 자동 복귀",
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
              text: "기존 여러 useEffect를 통해 분산된 의존성 관리로 인해 기능 추가 시 예상치 못한 문제 발생",
            },
            {
              text: "차트 내의 요소들을 분석하여 각 요소 별 책임을 분리하여 유지보수성과 확장성을 향상시킴",
            },
          ],
        },
        {
          text: "[웹소켓 디버깅 툴] 개발",
          portfolioLinks: [
            {
              title: "웹소켓 디버깅 툴 개발",
              url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-devtools",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "특정 웹소켓 통신 불안정 시의 디버깅 속도를 향상시키기 위한 디버깅 툴 개발",
            },
            {
              text: "토픽, 크기, 속도를 실시간으로 관찰하여 특정 토픽의 병목 지점 확인",
            },
          ],
        },
      ],
    },
    {
      company: "아데나 소프트웨어 (버블탭)",
      role: "Frontend Developer",
      period: "2024.10 - 2025.07",
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
      keywordImageMap: {
        "트리거 단어 칩 변환 알고리즘": "/assets/chip-transform.gif",
        "실시간 텍스트 검열 시스템": "/assets/realtime-filtering-demo.gif",
        "LLM 실시간 스트리밍 시스템": "/assets/sse-streaming.gif",
      },
      bullets: [
        {
          text: "[트리거 단어 칩 변환 알고리즘] 개발",
          portfolioLinks: [
            {
              title: "트리거 단어를 칩으로 변환",
              url: "https://jongmany.github.io/my-blog/portfolio/project/ai-character-text-parsing",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "트리거 단어를 직관적인 시각적 칩으로 변환하여 생성 시 가독성 향상",
            },
            {
              text: "키보드만으로도 편리하게 편집할 수 있는 UX를 통해 창작자들의 생산성 향상",
            },
          ],
        },
        {
          text: "SSE 기반 [LLM 실시간 스트리밍 시스템] 개발",
          portfolioLinks: [
            {
              title: "SSE 스트리밍 구현",
              url: "https://jongmany.github.io/my-blog/portfolio/project/llm-sse-streaming",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "AI 응답을 실시간으로 스트리밍하여 자연스러운 대화 경험 제공",
            },
            {
              text: "연결 문제 발생 시 자동으로 복구하여 끊김 없는 대화 환경 구축",
            },
          ],
        },
        {
          text: "[실시간 텍스트 검열 시스템] 개발",
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
              text: "GA4, Airbridge, X Pixel, 네이버로그 등 4개 분석 플랫폼을 분석하여 통합된 인터페이스 제공",
            },
            {
              text: "확장 가능한 로깅 아키텍처로 신규 분석 플랫폼 추가 시 개발 시간 단축",
            },
          ],
        },
      ],
    },
  ],
  sideProjects: [
    {
      title: "[스승의 날 프로젝트]",
      period: "2023.05.11 - 2024.05.14",
      summary:
        "스승의 날의 맞이하여 연구실 내의 인원들이 교수님께 편지를 쓸 수 있도록 웹페이지 형태로 구현하였습니다.",
      keywordImageMap: {
        "스승의 날 프로젝트": "/assets/teachers-day-main.png",
      },
      portfolioLinks: [
        {
          title: "스승의 날 프로젝트 포트폴리오",
          url: "https://jongmany.github.io/my-blog/portfolio/project/teachers-day",
          type: "portfolio",
        },
      ],
      bullets: [
        {
          text: "학생들은 원하는 카네이션 편지지를 선택하고 편지를 작성하게 되면 교수님의 정장에 카네이션 표시",
        },
        {
          text: "이미지의 특정 영역을 선택하여 해당 영역에 카네이션을 달 수 있도록 구현",
        },
      ],
    },
    {
      title: "[Ready To Work 프로젝트]",
      period: "2024.05.11 - 2024.05.14",
      summary: `Ready To Work 프로젝트는 "회사가 채용 프로세스를 간소화하면서 검증된 인재를 채용할 수 없을까?" 라는 질문으로부터 시작된 프로젝트입니다.`,
      keywordImageMap: {
        "Ready To Work 프로젝트": "/assets/rtw-excel-upload.png",
      },
      portfolioLinks: [
        {
          title: "Ready To Work 프로젝트 포트폴리오",
          url: "https://jongmany.github.io/my-blog/portfolio/project/ready-to-work",
          type: "portfolio",
        },
      ],
      bullets: [
        {
          text: "D3.js를 통해 LLM 기반의 가설 좌표를 시각화",
        },
        {
          text: "일상 생활 속 다양한 질문들에 대해 얼마나 넓고 깊게 대답 하는지를 LLM 기반의 AI로 분석하여 점수화",
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
