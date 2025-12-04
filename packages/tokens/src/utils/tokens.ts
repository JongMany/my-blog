/**
 * Token Utility Functions
 * Helper functions for working with design tokens
 */

import type { DesignToken, SemanticColorToken, SemanticSpacingToken, SemanticRadiusToken } from "../types/tokens";
import { semanticTokens } from "../variables/semantic";

/**
 * Check if code is running in browser environment
 */
function isBrowser(): boolean {
  return typeof document !== "undefined";
}

/**
 * Convert token name to kebab-case CSS custom property name
 * e.g., "colorBackgroundCanvas" -> "color-background-canvas"
 */
function toKebabCase(tokenName: string): string {
  return tokenName.replace(/([A-Z])/g, "-$1").toLowerCase();
}

/**
 * Get CSS custom property for any design token (type-safe)
 * This is the recommended function to use
 * 
 * @example
 * ```ts
 * getCSSToken("color-background-canvas") // "var(--color-background-canvas)"
 * ```
 */
export function getCSSToken<T extends DesignToken>(token: T): `var(--${string})` {
  const kebabCase = toKebabCase(token);
  return `var(--${kebabCase})` as `var(--${string})`;
}

/**
 * Convert token name to CSS custom property name
 * 
 * @example
 * ```ts
 * toCSSCustomProperty("colorBackgroundCanvas") // "--color-background-canvas"
 * ```
 */
export function toCSSCustomProperty(tokenName: string): string {
  return `--${toKebabCase(tokenName)}`;
}

/**
 * Validate if a token exists in the semantic tokens registry
 * 
 * @example
 * ```ts
 * isValidSemanticToken("color-background-canvas") // true
 * isValidSemanticToken("invalid-token") // false
 * ```
 */
export function isValidSemanticToken(token: string): token is keyof typeof semanticTokens {
  return token in semanticTokens;
}

/**
 * Validate if a string is a semantic color token (checks against actual token list)
 * 
 * @example
 * ```ts
 * isSemanticColorToken("color-text-primary") // true
 * isSemanticColorToken("color-background-canvas") // true
 * isSemanticColorToken("invalid-color") // false
 * ```
 */
export function isSemanticColorToken(token: string): token is SemanticColorToken {
  if (!token.startsWith("color-")) {
    return false;
  }
  return isValidSemanticToken(token);
}

/**
 * Validate if a string is a semantic spacing token (checks against actual token list)
 * 
 * @example
 * ```ts
 * isSemanticSpacingToken("spacing-component-md") // true
 * isSemanticSpacingToken("invalid-spacing") // false
 * ```
 */
export function isSemanticSpacingToken(token: string): token is SemanticSpacingToken {
  if (!token.startsWith("spacing-")) {
    return false;
  }
  return isValidSemanticToken(token);
}

/**
 * Validate if a string is a semantic radius token (checks against actual token list)
 * 
 * @example
 * ```ts
 * isSemanticRadiusToken("radius-component-sm") // true
 * isSemanticRadiusToken("invalid-radius") // false
 * ```
 */
export function isSemanticRadiusToken(token: string): token is SemanticRadiusToken {
  if (!token.startsWith("radius-")) {
    return false;
  }
  return isValidSemanticToken(token);
}

/**
 * Get the primitive token reference for a semantic token
 * Returns null if token doesn't exist
 * 
 * @example
 * ```ts
 * getPrimitiveReference("color-background-canvas") // "gray1"
 * getPrimitiveReference("invalid-token") // null
 * ```
 */
export function getPrimitiveReference(semanticToken: string): string | null {
  if (!isValidSemanticToken(semanticToken)) {
    return null;
  }
  
  const primitiveRef = semanticTokens[semanticToken];
  return typeof primitiveRef === "string" ? primitiveRef : null;
}

/**
 * Validate token and get CSS custom property with error handling
 * Throws descriptive error if token is invalid
 * 
 * @example
 * ```ts
 * getCSSTokenSafe("color-background-canvas") // "var(--color-background-canvas)"
 * getCSSTokenSafe("invalid-token") // throws Error
 * ```
 */
export function getCSSTokenSafe<T extends DesignToken>(token: T): `var(--${string})` {
  // For semantic tokens, validate they exist
  if (token.startsWith("color-") || token.startsWith("spacing-") || token.startsWith("radius-")) {
    if (!isValidSemanticToken(token)) {
      throw new Error(
        `Invalid semantic token: "${token}". ` +
        `Use a valid token from the semantic tokens registry.`
      );
    }
  }
  
  return getCSSToken(token);
}
