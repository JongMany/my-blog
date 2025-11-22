import type { Section } from "../consts/sections";

const GRID_COLUMN_CLASSES: Record<Section["size"], string> = {
  lg: "sm:col-span-2 lg:col-span-2 lg:row-span-2",
  md: "sm:col-span-1 lg:col-span-1",
  sm: "sm:col-span-1 lg:col-span-1",
};

export function getSectionGridClasses(size: Section["size"]): string {
  return GRID_COLUMN_CLASSES[size];
}

export const SECTION_ANIMATION = {
  STAGGER_DELAY: 0.1,
  DURATION: 0.3,
  SCALE_DURATION: 0.2,
  HOVER_SCALE: 1.02,
  HOVER_DURATION: 0.1,
  EASE: [0.4, 0, 0.2, 1] as const,
} as const;

export const SECTION_STYLES = {
  MIN_HEIGHT: {
    base: "min-h-[200px]",
    sm: "sm:min-h-[240px]",
  },
  PADDING: {
    base: "p-6",
    sm: "sm:p-8",
    md: "md:p-10",
    lg: "lg:p-12",
  },
} as const;
