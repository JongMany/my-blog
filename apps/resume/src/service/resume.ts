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
      "복잡한 기술적 문제를 깊이 있게 분석하고 해결하는 것을 즐기는 Frontend Developer입니다.",
      "기능을 구현하는 것을 넘어서 내부 동작 원리까지 파악하여 근본적인 해결책을 찾아내는 것에 강점이 있습니다.",
      "부족한 점을 인지하고 채워넣는 과정을 좋아합니다.",
      "사용자 경험을 최우선으로 생각하며 개발 과정에서 사용성을 높일 수 있는 요소를 발견하면 이를 개선하려고 노력합니다.",
    ],
    email: "blackberry1114@naver.com",
    github: "https://github.com/JongMany",
    blog: "https://homebody-coder.tistory.com/",
    portfolio:
      "https://zircon-muscle-434.notion.site/26d56c6d0b84803cab29cb0cb89ff948",
    personalSite: "https://jongmany.github.io/my-blog/",
    photoUrl: "/img/profile.jpeg",
  },
  experiences: [
    {
      company: "아데나 소프트웨어 (코인니스)",
      role: "Frontend Developer",
      period: "2025.07 - now",
      summary:
        "국내 최대 암호화폐 및 가상자산 투자 정보 미디어 서비스인 코인니스 내의 암호화폐 거래소 서비스를 개발했습니다. 주로 차트 내 거래 서비스를 기획, 개발하여 거래 사용성을 개선했습니다.",
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
          text: "차트 트레이딩 기능 확장 (라이브러리 내 TP/SL 설정 인터페이스 추가)",
          children: [
            {
              text: "TradingView API 한계로 인한 익절/손절(TP/SL) 설정 API 부재 문제를 리버스 엔지니어링을 통해 해결",
            },
            {
              text: "Chrome DevTools를 활용해 번들링된 TradingView 라이브러리의 핵심 클래스 구조 파악 및 LineToolPosition 클래스 확장",
            },
            {
              text: "onTpSl, setTpSlTooltip, onMove 메서드를 추가하여 드래그 앤 드롭 기반 TP/SL 설정 및 실시간 P&L 계산 기능 구현",
            },
            {
              text: "PositionPaneView 클래스의 hitTest 메서드 확장으로 영역별 히트 테스트 및 TP/SL 버튼 렌더링 구현",
            },
            {
              text: "IPositionLineAdapter 인터페이스에 새로운 메서드 시그니처 추가로 컴파일 타임 타입 안전성 확보",
            },
          ],
        },
        {
          text: "차트 내 시장가/지정가 Panel UI 개발",
          children: [
            {
              text: "iframe과 메인 앱 간 안정적인 상태 동기화 시스템 구축으로 차트에서 원클릭 거래 가능",
            },
            {
              text: "Lit 라이브러리 도입으로 Vanilla JS 대비 선언적 렌더링, 반응형 상태 관리, 생명주기 관리의 장점 확보",
            },
            {
              text: "Orchestrator, View, Service, Infrastructure Layer로 모듈화된 아키텍처 설계",
            },
            {
              text: "EventBus 패턴을 통한 iframe과 메인 앱 간 실시간 양방향 통신 구현",
            },
          ],
        },
        {
          text: "iframe 내 Lit 컴포넌트 주입을 위한 모듈 로딩 신뢰성 개선",
          children: [
            {
              text: "iframe 전용 모듈 로더 개발로 커스텀 엘리먼트 등록 완료까지 Promise 기반 대기 메커니즘 구현",
            },
            {
              text: "Vite manifest 기반 동적 경로 해석으로 환경별 해시 청크 경로 차이 해결",
            },
            {
              text: "개발/배포 환경별 분기 로딩 전략으로 모든 환경에서 일관된 거래 패널 동작 보장",
            },
          ],
        },
        {
          text: "TradingView 관련 아키텍처 리팩토링",
          children: [
            {
              text: "기존 단일 훅에 혼재된 위젯 초기화, 이벤트 처리, 상태 관리, 렌더링 로직을 관심사별 모듈로 분리",
            },
            {
              text: "Adapter, Controller, Manager, Renderer로 역할 분담하여 코드 복잡도 감소 및 명확한 의존 관계 확립",
            },
          ],
        },
        {
          text: "소켓 불안정 시 HTTP Fallback 자동화",
          children: [
            {
              text: "소켓 주기 기반 헬스 체크 상태 머신 개발 (예상 틱 간격 15초, Soft 타임아웃 25초, Hard 타임아웃 180초)",
            },
            {
              text: "연속 미스 카운트 기반 Stale/Dead 상태 전환 및 WebSocket → HTTP Polling 자동 전환 시스템 구현",
            },
          ],
        },
        {
          text: "소켓 통신 DevTools 개발",
          children: [
            {
              text: "실시간 소켓 이벤트 모니터링 시스템으로 메시지 수집, 토픽별 필터링, 전송 속도 표시 기능 구현",
            },
            {
              text: "정지/재개 기능과 JSON 트리 뷰어로 개발 환경에서 실시간 디버깅 효율성 대폭 향상",
            },
          ],
        },
      ],
    },
    {
      company: "아데나 소프트웨어 (버블탭)",
      role: "Frontend Developer",
      period: "2024.10 - 2025.06",
      summary: "AI 채팅 플랫폼 버블챗/팅글에서 프론트엔드 개발을 담당했습니다.",
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
          text: "에디터 UX 개선 (Tiptap 기반 특정 키워드 자동 칩 변환 시스템)",
          children: [
            {
              text: "{{ 트리거로 자동 suggestion 드롭다운 활성화 및 멘션 선택 시 칩 UI로 변환하는 시스템 구현",
            },
            {
              text: "백스페이스 키로 칩 전체 삭제, 키보드 화살표로 칩 간 이동 및 선택 기능 구현",
            },
            {
              text: "복사 붙여넣기 시에도 원본 형태 그대로 유지하여 {{assistant}}, {{user}}를 각각 '캐릭터', '나' 칩 UI로 시각화",
            },
          ],
        },
        {
          text: "LLM UX 개선작업 POC 진행 (SSE 기반 실시간 스트리밍 시스템)",
          children: [
            {
              text: "토큰 단위 실시간 스트리밍으로 즉각적 피드백 제공 및 연결 상태 관리 (idle → connecting → streaming → done)",
            },
            {
              text: "자동 재연결 및 에러 복구 메커니즘과 llm-ui 라이브러리를 통한 마크다운 및 코드 블록 실시간 렌더링",
            },
          ],
        },
        {
          text: "통합 로깅 아키텍처 설계 및 구축",
          children: [
            {
              text: "Abstract Factory 패턴 기반 통합 로깅 시스템 설계로 GA4, Airbridge, X Pixel, 네이버로그 통합 관리",
            },
            {
              text: "플랫폼 별 Logger 클래스 구현으로 신규 로깅 이벤트 구현 시간 단축",
            },
          ],
        },
        {
          text: "커뮤니티 가이드를 준수하기 위한 실시간 단어 검열 시스템 구현",
          children: [
            {
              text: "AhoCorasick 문자열 매칭 알고리즘을 적용한 클래스 개발로 검열 처리 성능 향상",
            },
            {
              text: "싱글턴 패턴을 통해 검열 엔진 메모리 효율성 상승 및 실시간 사용자 피드백 제공",
            },
          ],
        },
        {
          text: "대규모 이미지 스크롤 최적화",
          children: [
            {
              text: "tanstack/react-virtual 도입으로 뷰포트 기반 선택적 렌더링 구현",
            },
            {
              text: "마우스 드래그, 휠 스크롤, 키보드 네비게이션 멀티 인터랙션 지원으로 100장 이상의 이미지에서도 부드러운 스크롤 달성",
            },
          ],
        },
        {
          text: "창작자 수익 공유 신규 서비스 런칭",
          children: [
            {
              text: "일별/주별/월별 수익 트렌드 분석 및 시각화, 콘텐츠별 상세 수익 내역 및 사용량 통계 제공",
            },
            {
              text: "카테고리별 랭킹 세분화 및 React flushSync API를 활용한 동기 상태 관리로 API 호출 상태 관리",
            },
            {
              text: "Single Flight 패턴 구현으로 동일 요청 통합 처리하여 창작자 생태계 활성화 및 플랫폼 콘텐츠 품질 향상",
            },
          ],
        },
        {
          text: "미디어 처리 최적화 (Web Worker 기반 이미지 변환 시스템)",
          children: [
            {
              text: "Web Worker 기반 백그라운드 이미지 변환 시스템 구축으로 메인 스레드 분리",
            },
            {
              text: "postMessage 기반 안전한 데이터 전달 및 에러 핸들링으로 다중 이미지 변환 중에도 메인 스레드 블로킹 현상 해소",
            },
          ],
        },
        {
          text: "웹 미디어 처리 최적화 (WebP 애니메이션 프레임 단위 제어 시스템)",
          children: [
            {
              text: "webpxmux 라이브러리 기반 프레임 단위 제어 시스템으로 WebAssembly 런타임을 활용한 네이티브 성능의 WebP 파싱",
            },
            {
              text: "각 프레임별 RGBA 픽셀 데이터 및 duration 정보 추출로 Animated WebP의 완전한 프레임 단위 제어 기능 구현",
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
    "Lit",
    "WebSocket",
    "TradingView",
    "Styled Components",
    "Pnpm",
    "Yarn",
  ],
};
