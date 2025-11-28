import { cubicBezier, type Variants } from "framer-motion";

/**
 * Easing functions
 */
export const easeOut = cubicBezier(0.16, 1, 0.3, 1);

/**
 * Animation props for scroll-triggered animations
 * Use with spread operator: {...fadeUp}
 */
export const fadeUp = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { margin: "-10% 0px", once: true },
  transition: { duration: 0.5, ease: easeOut } as const,
};

/**
 * Variants for item animations (fade in from bottom)
 * Use with variants prop: variants={fadeInItem}
 */
export const fadeInItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

/**
 * Variants for stagger container animations
 * Use with variants prop: variants={staggerContainer}
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};
