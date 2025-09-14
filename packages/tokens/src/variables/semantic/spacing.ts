/**
 * Semantic Spacing Tokens
 * Purpose-driven spacing tokens for consistent layouts
 */

/**
 * Component Spacing
 * - Internal spacing for UI components
 */
export const componentSpacing = {
  "spacing-component-xs": "spacing-1", // 4px - tiny padding
  "spacing-component-sm": "spacing-2", // 8px - small padding
  "spacing-component-md": "spacing-3", // 12px - medium padding
  "spacing-component-lg": "spacing-4", // 16px - large padding
  "spacing-component-xl": "spacing-6", // 24px - extra large padding
} as const;

/**
 * Layout Spacing
 * - Spacing between layout elements and sections
 */
export const layoutSpacing = {
  "spacing-layout-xs": "spacing-4", // 16px - small gaps
  "spacing-layout-sm": "spacing-6", // 24px - medium gaps
  "spacing-layout-md": "spacing-8", // 32px - large gaps
  "spacing-layout-lg": "spacing-12", // 48px - section gaps
  "spacing-layout-xl": "spacing-16", // 64px - page gaps
} as const;

/**
 * All semantic spacing tokens combined
 */
export const semanticSpacing = {
  ...componentSpacing,
  ...layoutSpacing,
} as const;
