/**
 * 스킬 카테고리 및 분류 정의
 */

export const SKILL_CATEGORIES = {
  Frontend: [
    "React",
    "TypeScript",
    "Vite",
    "Tailwind CSS",
    "Styled Components",
  ],
  "State Management": ["TanStack Query", "Zustand"],
  Specialized: ["Lit", "WebSocket", "TradingView"],
  "Package Managers": ["Pnpm", "Yarn"],
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;
export type Skill = (typeof SKILL_CATEGORIES)[SkillCategory][number];
