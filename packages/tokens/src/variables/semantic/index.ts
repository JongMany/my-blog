/**
 * Semantic Design Tokens
 * Radix UI & Adobe Spectrum inspired semantic token system
 *
 * Structure:
 * - Primitive tokens (gray1, blue9) → Semantic tokens (color-text-primary) → Component tokens
 */

// Import individual semantic token groups
export * from "./colors";
export * from "./spacing";
export * from "./radius";
export * from "./typography";

// Import for re-export
import { semanticColors } from "./colors";
import { semanticSpacing } from "./spacing";
import { semanticRadius } from "./radius";
import { semanticTypography } from "./typography";

// ============================================================================
// Combined Semantic Tokens Export
// ============================================================================

/**
 * All semantic tokens combined for easy access
 */
export const semanticTokens = {
  ...semanticColors,
  ...semanticSpacing,
  ...semanticRadius,
  ...semanticTypography,
} as const;

/**
 * Type for all semantic token keys
 */
export type SemanticToken = keyof typeof semanticTokens;
