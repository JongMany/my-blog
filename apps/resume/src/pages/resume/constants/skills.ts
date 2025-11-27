/**
 * 스킬 카테고리 및 분류 정의
 */

export const SKILL_CATEGORIES = {
  Languages: ["TypeScript"],
  Frontend: ["React", "Lit", "Tailwind CSS", "Styled Components"],
  "State Management": ["TanStack Query", "Zustand"],
  Specialized: ["TradingView"],
} as const;

export type SkillCategory = keyof typeof SKILL_CATEGORIES;
export type Skill = (typeof SKILL_CATEGORIES)[SkillCategory][number];
