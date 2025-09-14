/**
 * Semantic Border Radius Tokens
 * Purpose-driven radius tokens for UI components
 */

/**
 * Component Border Radius
 * - Semantic radius tokens for different component types
 */
export const componentRadius = {
  "radius-component-sm": "radius-sm", // Small components (buttons, inputs)
  "radius-component-md": "radius-md", // Medium components (cards)
  "radius-component-lg": "radius-lg", // Large components (modals)
  "radius-full": "radius-full", // Pills, avatars
} as const;

/**
 * All semantic radius tokens combined
 */
export const semanticRadius = {
  ...componentRadius,
} as const;
