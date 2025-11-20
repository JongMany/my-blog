import type { ResumeData } from "./types";

export const resume: ResumeData = {
  profile: {
    name: "이종민",
    tagline: "Frontend Developer",
    intro: [
      "새로운 기술과 패턴을 빠르게 학습하고 적용하여 더 나은 서비스 경험을 만드는 데 보람을 느낍니다.",
      "부족한 점을 끊임없이 개선하고 팀과 함께 성장하는 과정을 즐기며, 문제를 단순하고 확장 가능한 구조로 풀어내는 데 집중합니다.",
      "팀이 직면한 이슈를 적극적으로 해결하고 개발자 경험을 향상시키는 데 기여합니다.",
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
      company: "토스증권",
      role: "Frontend Developer(Chart)",
      period: "2025.12.08 입사 예정",
    },
    {
      company: "아데나 소프트웨어 (코인니스)",
      role: "Frontend Developer",
      period: "2025.07 - now",
      summary:
        "암호화폐 거래소의 WTS(Web Trading System)을 개발했습니다. 이 과정에서 사용자의 거래 편의성을 높이기 위한 기능들을 기획 및 개발했습니다.",
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
        "익절/손절을 차트 내에서 드래그를 통해 설정": "/assets/tpsl.gif",
        "지정가 주문 패널": "/assets/limit-order-panel.gif",
        "시장가 주문 패널": "/assets/market-order-panel.gif",
        "웹소켓 ↔ HTTP 폴링 자동 전환 시스템":
          "/assets/websocket-fallback.png",
        "웹소켓 DevTools": "/assets/socket-devtools.gif",
      },
      sections: [
        {
          title: "차트 내 거래 편의성 기능 개발",
          description:
            "차트를 단순히 거래 데이터 시각화 도구가 아닌 직접적인 거래 인터페이스로 확장하기 위해 다양한 기능을 개발했습니다. \n차트 내 주문 기능을 붙이는 것에 그치지 않고 사용자가 거래 과정에서 겪는 인지적 부하를 줄이고 의사결정 속도를 높이는 UX에 집중했습니다. \n이를 위해 드래그 앤 드랍 익절/손절 예약 주문 거래 기능, 차트 내에서의 시장가/지정가 주문 패널 등을 구현하며 TradingView 라이브러리의 한계를 극복하고 사용자에게 더 나은 거래 편의성을 제공했습니다. \n차트를 거래 플랫폼으로 확장하고 사용자의 거래 경험의 편의성과 속도를 향상시켰습니다.",
          bullets: [
            {
              text: "[드래그 앤 드랍 익절/손절(TP/SL) 예약 주문] 기능 구현",
              portfolioLinks: [
                {
                  title: "드래그 앤 드랍 손절/익절 예약 주문",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-tpsl-drag",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "[익절/손절을 차트 내에서 드래그를 통해 설정]할 수 있도록 구현하여 시각적으로 거래를 쉽게 할 수 있도록 편의성을 향상시켰습니다.",
                },
                {
                  text: "드래깅 시 해당 가격 익절/손절 시 예상 수익/손실 기능을 추가하여 거래 의사결정 속도와 편의성을 향상시켰습니다.",
                },
                {
                  text: "TradingView 라이브러리의 내부 코드를 수정하여 차트 기능을 확장했습니다.",
                  children: [
                    {
                      text: "차트 요소 간 히트 테스트 로직 분석 및 TP/SL 관련 버튼 렌더링 기능 확장",
                      children: [
                        {
                          text: "마우스가 차트 위 체결 주문 라인 영역 내부에 있을 때 TP/SL 버튼 노출",
                        },
                      ],
                    },
                    {
                      text: "차트 내 렌더링 최적화 기능 추가",
                      children: [
                        {
                          text: "마우스 드래그 상태일 때만 실시간 PnL 계산 수행",
                        },
                        {
                          text: "조건부 렌더링으로 불필요한 TP/SL 버튼 렌더링 방지",
                        },
                      ],
                    },
                    {
                      text: "드래깅 시 실시간 시각적 피드백 시스템 구현",
                      children: [
                        {
                          text: "드래그 시 수평/수직 연결 선으로 익절/손절 시 예상 이익/손실 시각화",
                        },
                        {
                          text: "드래그 시작 시 시작점과 현재점 상태 관리로 드래그 상태 추적 (현재 포지션 가격 포인트와 마우스 위치 가격 포인트 구분 렌더링)",
                        },
                        {
                          text: "드래그 중 실시간으로 가격을 계산하여 예상 손실/이익을 계산하여 시각화",
                        },
                        {
                          text: "드래그 종료 시 최종 가격을 외부 콜백에 전달하여 익절/손절 요청 처리",
                        },
                      ],
                    },
                  ],
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
                  text: "버튼 클릭 시 즉시 체결 가능한 가격에 매수/매도 주문을 요청하는 기능을 기획 및 개발했습니다.",
                },
                {
                  text: "React Draggable 라이브러리를 활용하여 차트 내에서 주문 패널을 자유롭게 이동할 수 있도록 구현하였습니다.",
                },
                {
                  text: "실시간 호가창 내 데이터(매도 1호가/매수 1호가)를 연동하여 시장가를 표시하였습니다",
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
                  text: "버튼 클릭시 해당 가격축에 해당하는 주문을 요청하는 기능을 기획 및 개발했습니다.",
                },
                {
                  text: "TradingView가 차트를 렌더링하는 iframe 내의 DOM 내부 구조를 분석하고 가격 축을 트래킹하는 주문 패널 UI를 추가했습니다.",
                },
                {
                  text: "Lit 기반 커스텀 앨리먼트 개발 및 iframe 환경에서의 커스텀 UI 컴포넌트 주입 시스템을 구현했습니다.",
                  children: [
                    {
                      text: "iframe 환경에서 동적으로 커스텀 엘리먼트를 등록 및 주입하는 시스템을 개발하여 Dev/Prod 환경에서 안정적으로 패널을 렌더링하도록 했습니다.",
                    },
                    {
                      text: "Dev 모드에서는 소스 파일을 직접, Prod 모드에서는 vite manifest 기반 번들을 자동으로 로드하여 커스텀 엘리먼트를 주입하도록 설계했습니다.",
                    },
                  ],
                },
                {
                  text: "React와 iframe 내 커스텀 엘리먼트 간 콜백 동기화 패턴을 구현하여 패널 내 주문 요청 시 최신 콜백 참조를 보장하도록 했습니다.",
                  portfolioLinks: [
                    {
                      title: "useCallbackRef 관련 기술 블로그",
                      url: "https://homebody-coder.tistory.com/entry/useCallbackRef-useEffect%EC%9D%98-%ED%95%A8%EC%88%98-deps%EB%A5%BC-%EC%97%86%EC%95%A0%EB%8A%94-%EB%B0%A9%EB%B2%95",
                      type: "blog",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          title: "웹소켓 안정성 및 모니터링 시스템 개발",
          description:
            "웹소켓 연결 불안정 시 폴링 자동 전환과 단일 캐싱을 통해 끊김 없는 데이터 경험을 제공했습니다. 또한 DevTools를 개발해 병목 구간 파악 및 장애 대응 속도를 개선했습니다.",
          bullets: [
            {
              text: "[웹소켓 ↔ HTTP 폴링 자동 전환 시스템] 구축",
              portfolioLinks: [
                {
                  title: "웹소켓 HTTP Polling 자동 전환 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-http-fallback",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "웹소켓 연결 불안정 시 데이터가 갱신되지 않았던 문제가 발생하여 사용자의 거래 시스템에 대한 불신 문제가 발생했습니다.",
                },
                {
                  text: "웹소켓 연결 상태를 감지하여 소켓이 불안정한 경우 폴링으로 자동으로 전환되도록 구축하였습니다.",
                  children: [
                    {
                      text: "Tanstack Query의 setQueryData를 활용하여 웹소켓과 HTTP 데이터를 동일 캐시에 통합하여 데이터 끊김을 최소화했습니다.",
                    },
                  ],
                },
                {
                  text: "메시지 처리시 200ms 쓰로틀링을 적용하여 과도한 업데이트를 방지하였습니다.",
                },
              ],
            },
            {
              text: "[웹소켓 DevTools] 개발",
              portfolioLinks: [
                {
                  title: "웹소켓 메시지 DevTools",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/websocket-devtools",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "토픽 / 메시지 크기 / 속도를 실시간 관찰하고 시각화하여 소켓 병목 구간을 빠르게 파악할 수 있었습니다.",
                },
                {
                  text: "구독 / 재구독 제어 기능을 구현하여 소켓 관련 장애 상황을 재현하고 방어 로직을 검증할 수 있었습니다.",
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
          title: "TradingView – React 아키텍처 리팩토링",
          description:
            "의존성 및 상태 변경의 흐름을 단방향으로 변경하도록 수정하였습니다. 코드 복잡도와 확장성을 고려하여 신규 기능 추가 시 안정성을 높이고, 버그 발생 시 버그 발생 지점을 빠르게 찾을 수 있었습니다.",
          portfolioLinks: [
            {
              title: "TradingView 아키텍처 리팩토링",
              url: "https://jongmany.github.io/my-blog/portfolio/project/tradingview-architecture-refactoring",
              type: "portfolio",
            },
          ],
          bullets: [
            {
              text: "기존 구현",
              children: [
                {
                  text: "다수의 useEffect에서 TradingView와 리액트 간의 상태 동기화를 위한 로직이 작성되어 의존성이 복잡하게 관리되었습니다.",
                  children: [
                    {
                      text: "특히 차트 초기화, 테마 변경, 심볼 업데이트, 주문 패널 관리, 지표 관리 등 로직이 얽혀있었습니다.",
                    },
                  ],
                },
              ],
            },
            {
              text: "리팩토링",
              children: [
                {
                  text: "useSyncExternalStore을 통해 React와 TradingView의 상태를 동기화하여 리렌더링되도록 구현했습니다.",
                },
                {
                  text: "레이어드 아키텍처를 도입하여 코드의 유지보수성을 향상시켰습니다.",
                  children: [
                    {
                      text: "TradingView의 내부 구성요소들을 파악하고 이를 각각의 클래스로 변환시켜 차트 내 관심사를 분리시켰습니다.",
                    },
                  ],
                },
                {
                  text: "EventBus 기반 이벤트 통신 아키텍처를 설계, 구현하였습니다.",
                  children: [
                    {
                      text: "TradingView API를 호출하여 차트 내부의 상태를 변경한 경우 구독자들에게 변경사항을 전파하여 리액트와 TradingView 간의 상태 불일치를 방지했습니다.",
                    },
                  ],
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
        "SSE 기반 LLM 응답 스트리밍 시스템": "/assets/sse-streaming.gif",
        "WASM 기반 WebP 애니메이션 디코딩 시스템": "/assets/wasm-poc.gif",
        "에디터 내 텍스트 칩 변환 시스템": "/assets/chip-transform.gif",
        "ESLint Rule": "/assets/transform-eslint-after.png",
      },
      sections: [
        {
          title: "사용자 경험 개선을 위한 다양한 기능들을 구현 및 검증",
          description:
            "SSE 기반 LLM 응답 스트리밍과 WASM 기반 WebP 디코딩을 도입해 응답 속도·애니메이션 UX를 개선했습니다. 또한 텍스트 칩 시스템을 구현해 발화자 구분과 가독성을 높여 캐릭터 생성 과정의 편의성을 강화했습니다.",
          bullets: [
            {
              text: "[SSE 기반 LLM 응답 스트리밍 시스템] 검증 (PoC)",
              portfolioLinks: [
                {
                  title: "SSE 기반 LLM 스트리밍 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/llm-sse-streaming",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "SSE를 활용해 토큰 단위 실시간 렌더링을 구현하여 응답 속도와 몰입감을 높였습니다.",
                },
                {
                  text: "MSW 기반 SSE 모킹을 도입해 서버 의존성을 제거하고 프론트엔드 단독 개발이 가능하도록 했습니다.",
                },
                {
                  text: "네트워크 상태에 따라 적응형 렌더링 스케줄러와 버퍼 큐 관리를 적용해 지연 상황에서도 부드러운 출력 경험을 제공했습니다.",
                },
              ],
            },
            {
              text: "[WASM 기반 WebP 애니메이션 디코딩 시스템] 검증 (PoC)",
              portfolioLinks: [
                {
                  title: "WASM 기반 WebP 애니메이션 디코딩 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/wasm-webp-decoder",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "ImageDecoder API의 Webp 애니메이션 디코딩 시의 불안정성을 보완하기 위해 WASM 기반 WebP 디코더를 도입했습니다.",
                },
                {
                  text: "마우스 호버 시 프레임 지속시간을 제어해 자연스럽고 안정적인 애니메이션 UX를 구현했습니다.",
                },
              ],
            },
            {
              text: "[에디터 내 텍스트 칩 변환 시스템] 구현",
              portfolioLinks: [
                {
                  title: "에디터 내 텍스트 칩 시스템",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/text-chip-system",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "프롬프트 내 {{assistant}}, {{user}} 키워드를 정의하여 발화자를 명확히 구분할 수 있도록 했습니다.",
                },
                {
                  text: "해당 키워드를 색상 칩으로 시각화해 가독성과 명확성을 강화했습니다.",
                },
                {
                  text: "직관적인 UI를 제공하여 캐릭터 생성 과정에서 편의성과 사용자 경험을 개선했습니다.",
                },
              ],
            },
          ],
        },
        {
          title: "개발자 경험 향상 기능 추가",
          description:
            "다중 로깅 시스템을 단일 인터페이스로 통합해 이벤트 적용 속도와 생산성을 개선했습니다. 또한 번역키 검증 ESLint Rule을 개발해 다국어 서비스의 품질과 안정성을 강화했습니다.",
          bullets: [
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
                  text: "GA4, Airbridge, NaverLog, XPixel 등 여러 로깅 시스템을 단일 인터페이스로 통합하여 신규 이벤트 적용 속도를 개선하고 개발 생산성을 높였습니다.",
                },
                {
                  text: "이벤트 enum 기반 구조를 설계하여 신규 이벤트 추가 시 로깅 시스템에 자동 반영되도록 했습니다.",
                },
              ],
            },
            {
              text: "번역키 검증을 위한 [ESLint Rule] 개발",
              portfolioLinks: [
                {
                  title: "ESLint Rule",
                  url: "https://jongmany.github.io/my-blog/portfolio/project/eslint-rule",
                  type: "portfolio",
                },
              ],
              children: [
                {
                  text: "한국어, 영어, 중국어 등의 번역 파일을 동시에 검증하는 ESLint Rule을 개발했습니다.",
                },
                {
                  text: "i18n의 t 함수와 <Trans> 컴포넌트 호출 시의 번역키 오타를 검출하여 ESLint 에러로 노출시켜 휴먼 에러를 방지하도록 했습니다.",
                },
                {
                  text: "런타임 번역 오류를 예방하여 다국어 서비스의 품질과 안정성을 강화했습니다.",
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
