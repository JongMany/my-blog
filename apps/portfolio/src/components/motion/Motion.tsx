// apps/portfolio/src/components/motion/Motion.tsx
import { cubicBezier } from "framer-motion";

// TS가 확실히 이해하는 easing 함수(0.16, 1, 0.3, 1: 톡 쏘는 ease-out 느낌)
export const easeOutCb = cubicBezier(0.16, 1, 0.3, 1);

export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { margin: "-10% 0px" },
  transition: { duration: 0.5, ease: easeOutCb } as const, // ★ 문자열 대신 함수
};

export const stagger = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 } as const,
  },
};

export const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOutCb } as const, // (선택) 아이템에도 동일 이징
  },
};
