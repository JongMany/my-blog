import { cubicBezier } from "framer-motion";
export const easeOutCb = cubicBezier(0.16, 1, 0.3, 1);
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-10% 0px" },
  transition: { duration: 0.5, ease: easeOutCb } as const,
};
export const vItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutCb } },
};
export const stagger = {
  hidden: { opacity: 1 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
