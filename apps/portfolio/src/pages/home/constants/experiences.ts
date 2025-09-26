import type { Experience } from "../../../service/portfolio";

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
