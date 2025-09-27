import type { ResumeData } from "./types";

export const resume: ResumeData = {
  profile: {
    name: "이종민",
    tagline: "Frontend Developer",
    intro: [
      "새로운 기술과 패턴을 빠르게 학습하고 적용하여, 더 나은 서비스 경험을 만드는 데 보람을 느낍니다.",
      "부족한 점을 끊임없이 보완하며, 팀과 함께 성장하는 과정을 즐기고 복잡한 문제를 단순하고 확장 가능한 구조로 해결하는 것을 지향합니다.",
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
        "암호화폐 거래소의 WTS(Web Trading System)을 개발했습니다. 사용자의 거래 편의성을 향상시키기 위한 기능들을 제안하고 개발했습니다.",
      stacks: [
        "Yarn",
        "React",
        "TypeScript",
        "Tanstack Query",
        "Zustand",
        "Tailwindcss",
        "Lit",
      ],
      keywordImageMap: {
        "드래그 앤 드랍 손절/익절 예약 주문": "/assets/tpsl.gif",
        "지정가 주문 패널": "/assets/limit-order-panel.gif",
        "시장가 주문 패널": "/assets/market-order-panel.gif",
        "웹소켓 ↔ HTTP Polling 자동 전환 시스템":
          "/assets/websocket-fallback.png",
        "웹소켓 메시지 DevTools": "/assets/socket-devtools.gif",
      },
      bullets: [
        {
          text: "차트 내 거래 편의성 기능 개발",
          children: [
            {
              text: "[드래그 앤 드랍 손절/익절 예약 주문] 기능 구현",
              portfolioLinks: [
                {
                  title: "드래그 앤 드랍 손절/익절 예약 주문",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-tpsl-drag",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "TradingView 라이브러리 내부 코드 디버깅 및 내부 코드 수정\n→ canvas 내에서의 히트 테스트 및 렌더링 로직 추가",
                },
                {
                  text: "실시간 예상 수익/손실 표시 기능 추가 → 사용자 편의성과 거래 의사결정 속도 향상",
                },
              ],
            },
            {
              text: "차트 기반 [시장가 주문 패널] 개발",
              portfolioLinks: [
                {
                  title: "시장가 주문 패널",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-market-order-panel",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "React Draggable 라이브러리 활용 → 사용자가 원하는 위치로 패널 자유롭게 이동 가능",
                },
                {
                  text: "실시간 호가창 내 데이터(매도 1호가 / 매수 1호가) 연동하여 시장가 표시 → 즉시 매수/매도 주문 실행 지원",
                },
              ],
            },
            {
              text: "차트 기반 [지정가 주문 패널] 개발",
              portfolioLinks: [
                {
                  title: "지정가 주문 패널",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-limit-order-panel",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "TradingView iframe DOM 구조 분석 → 차트 위에 동적 마운트 가능한 주문 패널 시스템 설계",
                },
                {
                  text: "Lit 기반 커스텀 엘리먼트 개발 및 환경별 동적 스크립트 주입 시스템 구축",
                  children: [
                    {
                      text: "개발 환경: Vite dev server에서 직접 로드",
                    },
                    {
                      text: "운영 환경: vite manifest 파싱 후 빌드된 스크립트 경로를 추출해 커스텀 엘리먼트를 iframe 내에 주입",
                    },
                  ],
                },
                {
                  text: "React ↔ iframe 간 콜백 동기화 패턴(useRef 기반) 구현 → 패널 내 주문 요청 시 최신 콜백 참조 보장",
                  portfolioLinks: [
                    {
                      title: "콜백 패턴 최적화",
                      url: "https://homebody-coder.tistory.com/entry/useCallbackRef-useEffect%EC%9D%98-%ED%95%A8%EC%88%98-deps%EB%A5%BC-%EC%97%86%EC%95%A0%EB%8A%94-%EB%B0%A9%EB%B2%95",
                      type: "blog",
                    },
                  ],
                },
              ],
            },
            {
              text: "성과:",
              children: [
                {
                  text: "복잡한 라이브러리 내부 구조를 파악하고 커스터마이징하여 차트 자체를 '거래 플랫폼'으로 확장",
                },
                {
                  text: "사용자의 거래속도 및 거래 시의 인지부조화를 줄여 편의성 향상",
                },
              ],
            },
          ],
        },
        {
          text: "웹소켓 안정성 및 모니터링 시스템 개발",
          children: [
            {
              text: "[웹소켓 ↔ HTTP Polling 자동 전환 시스템] 구축",
              portfolioLinks: [
                {
                  title: "웹소켓 HTTP Polling 자동 전환 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-http-fallback",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "웹소켓 연결 상태를 실시간 모니터링 → 웹소켓 서버 불안정/끊김 발생 시 Polling으로 자동 전환",
                },
                {
                  text: "Tanstack Query setQueryData 활용 → 웹소켓, HTTP 데이터를 동일 캐시에 통합 / 사용자에게 끊김없는 데이터 경험 제공",
                },
                {
                  text: "메시지 처리 시 200ms 스로틀링 적용 → 과도한 업데이트 방지 및 성능 최적화",
                },
              ],
            },
            {
              text: "[웹소켓 메시지 DevTools] 개발",
              portfolioLinks: [
                {
                  title: "웹소켓 메시지 DevTools",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-devtools",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "토픽 / 메시지 크기 / 속도 실시간 관찰 및 시각화 → 소켓 병목 구간 신속 파악",
                },
                {
                  text: "구독 / 재구독 제어 기능 제공 → 병목 지점 분석, 장애 상황 재현, 방어 로직 검증",
                },
              ],
            },
            {
              text: "성과:",
              children: [
                {
                  text: "서버 불안정 상황에서도 실시간 데이터 끊김 없는 사용자 경험 보장",
                },
                {
                  text: "DevTools 기반의 모니터링 시스템으로 장애 대응 및 성능 최적화 속도 향상",
                },
              ],
            },
          ],
        },
        {
          text: "TradingView 차트 라이브러리 – React 통합 아키텍처 리팩토링",
          portfolioLinks: [
            {
              title: "TradingView 아키텍처 리팩토링",
              url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-architecture-refactoring",
              type: "portfolio",
            },
          ],
          children: [
            {
              text: "문제 상황:",
              children: [
                {
                  text: "기존 구현은 다수의 useEffect에서 TradingView 메서드를 직접 호출 → 복잡한 의존성, 디버깅 난이도 증가",
                },
                {
                  text: "차트 초기화, 테마 변경, 심볼 업데이트, 주문 패널 관리 등 로직이 얽혀 있어 기능 추가 및 버그 해결 시 영향 범위 예측 어려움",
                },
              ],
            },
            {
              text: "해결 방법:",
              children: [
                {
                  text: "useSyncExternalStore + Observer 패턴 적용 → iframe 기반 TradingView 라이브러리와 React 생명주기 일관된 상태 동기화 모델 확립",
                },
                {
                  text: "레이어드 아키텍처(Controller / Manager / Renderer)로 책임 분리",
                },
                {
                  text: "EventBus 기반 이벤트 통신 설계 → 인스턴스 간 이벤트 브로커 역할 수행",
                },
              ],
            },
            {
              text: "성과:",
              children: [
                {
                  text: "기능 간 의존성 방향을 일관되게 설계하여 코드 복잡도 감소",
                },
                {
                  text: "신규 기능 추가 시 기존 코드 영향 최소화",
                },
              ],
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
        "AI 채팅 플랫폼에서 사용자들이 더 자연스럽고 편리하게 AI와 대화할 수 있도록 핵심 기능들을 검증 및 개발했습니다.",
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
          text: "사용자 경험 개선을 위한 다양한 기능들을 구현 및 검증",
          children: [
            {
              text: "SSE 기반 LLM 응답 스트리밍 시스템 검증 (PoC)",
              portfolioLinks: [
                {
                  title: "SSE 기반 LLM 스트리밍 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/llm-sse-streaming",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "SSE를 활용하여 토큰 단위 실시간 텍스트 렌더링 구현 → 대화형 응답 속도 및 몰입감 향상",
                },
                {
                  text: "MSW 기반 SSE 모킹 시스템 구축 → 서버 의존성 제거 및 독립적 프론트엔드 개발/테스트 가능",
                },
                {
                  text: "네트워크 상태에 따른 적응형 렌더링 스케줄러 및 버퍼 기반 큐 관리 도입 → 지연/폭주 상황에서도 부드러운 타이핑 효과 제공",
                },
              ],
            },
            {
              text: "WASM 기반 WebP 애니메이션 디코딩 시스템 검증 (PoC)",
              portfolioLinks: [
                {
                  title: "WASM WebP 애니메이션 디코딩",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/wasm-webp-animation",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "ImageDecoder API의 WebP 애니메이션 디코딩 시의 불안정성을 보완하기 위해 WASM 기반 디코더 라이브러리 도입",
                },
                {
                  text: "마우스 호버 시 프레임 지속시간 기반 재생/정지 제어 → 자연스러운 애니메이션 UX 제공",
                },
              ],
            },
            {
              text: "에디터 내 텍스트 칩 시스템 구현",
              portfolioLinks: [
                {
                  title: "텍스트 칩 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/ai-character-text-parsing",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "캐릭터 생성 프롬프트에 {{assistant}}, {{user}} 키워드 정의 → LLM이 발화자(사용자/캐릭터)를 명확히 구분",
                },
                {
                  text: "작성 화면에서 해당 키워드를 색상 구분된 칩으로 시각화 → 시각적 명확성 및 가독성 강화",
                },
                {
                  text: "직관적인 인터페이스를 통해 캐릭터 생성 과정의 편의성과 사용자 경험 개선",
                },
              ],
            },
          ],
        },
        {
          text: "개발자 경험 향상 기능 추가",
          children: [
            {
              text: "로깅 시스템 공통 인터페이스 구축",
              portfolioLinks: [
                {
                  title: "통합 로깅 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/multi-platform-analytics-integration",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "GA4, Airbridge, NaverLog, XPixel 등 다중 로깅 시스템을 단일 인터페이스로 통합",
                },
                {
                  text: "이벤트 enum 기반 구조 설계 → 신규 이벤트 추가 시 모든 로깅 시스템에 자동 반영",
                },
                {
                  text: "이벤트 적용 속도 개선 및 개발 생산성 향상",
                },
              ],
            },
            {
              text: "번역키 검증을 위한 ESLint Rule 개발",
              portfolioLinks: [
                {
                  title: "ESLint Rule 개발",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/eslint-i18n-rule",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "한국어/영어/중국어 번역 파일을 동시에 검증 → 누락된 번역키 실시간 감지",
                },
                {
                  text: "i18n의 t 함수 및 <Trans> 컴포넌트 호출 시 번역 키 오타 검출",
                },
                {
                  text: "런타임 번역 오류 예방으로 다국어 서비스 품질 및 안정성 강화",
                },
              ],
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
