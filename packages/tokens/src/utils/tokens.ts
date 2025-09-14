/**
 * Token Utility Functions
 * Helper functions for working with design tokens
 */

/**
 * Get CSS custom property for any token
 */
export function getCSSToken(token: string): string {
  return `var(--${token.replace(/([A-Z])/g, "-$1").toLowerCase()})`;
}

/**
 * Convert token name to CSS custom property name
 */
export function toCSSCustomProperty(tokenName: string): string {
  return `--${tokenName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
}

/**
 * Validate if a string is a semantic color token
 */
export function isSemanticColorToken(token: string): boolean {
  return typeof token === "string" && token.startsWith("color-");
}

/**
 * Validate if a string is a semantic spacing token
 */
export function isSemanticSpacingToken(token: string): boolean {
  return typeof token === "string" && token.startsWith("spacing-");
}

/**
 * Validate if a string is a semantic radius token
 */
export function isSemanticRadiusToken(token: string): boolean {
  return typeof token === "string" && token.startsWith("radius-");
}
