/**
 * Design Token TypeScript Definitions
 * Provides type safety for design tokens across the system
 * Following Radix UI and Adobe Spectrum patterns
 */

// ============================================================================
// Primitive Token Types (Base color scales)
// ============================================================================

/**
 * Gray scale tokens (1-12 scale following Radix UI)
 */
export type GrayScale =
  | "gray1"
  | "gray2"
  | "gray3"
  | "gray4"
  | "gray5"
  | "gray6"
  | "gray7"
  | "gray8"
  | "gray9"
  | "gray10"
  | "gray11"
  | "gray12";

/**
 * Gray alpha (transparent) tokens
 */
export type GrayAlphaScale =
  | "grayA1"
  | "grayA2"
  | "grayA3"
  | "grayA4"
  | "grayA5"
  | "grayA6"
  | "grayA7"
  | "grayA8"
  | "grayA9"
  | "grayA10"
  | "grayA11"
  | "grayA12";

/**
 * Blue scale tokens (brand/accent colors)
 */
export type BlueScale =
  | "blue1"
  | "blue2"
  | "blue3"
  | "blue4"
  | "blue5"
  | "blue6"
  | "blue7"
  | "blue8"
  | "blue9"
  | "blue10"
  | "blue11"
  | "blue12";

/**
 * Green scale tokens (success colors)
 */
export type GreenScale =
  | "green1"
  | "green2"
  | "green3"
  | "green4"
  | "green5"
  | "green6"
  | "green7"
  | "green8"
  | "green9"
  | "green10"
  | "green11"
  | "green12";

/**
 * Red scale tokens (error colors)
 */
export type RedScale =
  | "red1"
  | "red2"
  | "red3"
  | "red4"
  | "red5"
  | "red6"
  | "red7"
  | "red8"
  | "red9"
  | "red10"
  | "red11"
  | "red12";

/**
 * Amber scale tokens (warning colors)
 */
export type AmberScale =
  | "amber1"
  | "amber2"
  | "amber3"
  | "amber4"
  | "amber5"
  | "amber6"
  | "amber7"
  | "amber8"
  | "amber9"
  | "amber10"
  | "amber11"
  | "amber12";

/**
 * All primitive color tokens
 */
export type PrimitiveColorToken =
  | GrayScale
  | GrayAlphaScale
  | BlueScale
  | GreenScale
  | RedScale
  | AmberScale;

// ============================================================================
// Semantic Token Types (Purpose-driven)
// ============================================================================

/**
 * Background semantic tokens
 */
export type BackgroundToken =
  | "color-background-canvas" // Main app background
  | "color-background-panel" // Cards, panels
  | "color-background-surface" // Interactive surfaces
  | "color-background-hover" // Hover states
  | "color-background-pressed" // Pressed states
  | "color-background-selected" // Selected states
  | "color-background-overlay" // Modal overlays
  | "color-background-tooltip"; // Tooltips

/**
 * Border semantic tokens
 */
export type BorderToken =
  | "color-border-default" // Default borders
  | "color-border-hover" // Border hover
  | "color-border-focus" // Focus rings
  | "color-border-subtle" // Subtle borders
  | "color-border-strong"; // Strong borders

/**
 * Text semantic tokens
 */
export type TextToken =
  | "color-text-primary" // Primary text (high contrast)
  | "color-text-secondary" // Secondary text
  | "color-text-tertiary" // Tertiary text
  | "color-text-placeholder" // Placeholder text
  | "color-text-disabled" // Disabled text
  | "color-text-inverse"; // Text on dark backgrounds

/**
 * Accent/brand semantic tokens
 */
export type AccentToken =
  | "color-accent-subtle" // Subtle accent background
  | "color-accent-muted" // Muted accent background
  | "color-accent-surface" // Accent surface
  | "color-accent-hover" // Accent hover
  | "color-accent-pressed" // Accent pressed
  | "color-accent-solid" // Main brand color
  | "color-accent-solid-hover" // Brand hover
  | "color-accent-text" // Accent text
  | "color-accent-contrast"; // High contrast accent

/**
 * Status semantic tokens
 */
export type StatusToken =
  // Success
  | "color-success-subtle"
  | "color-success-surface"
  | "color-success-solid"
  | "color-success-text"
  // Warning
  | "color-warning-subtle"
  | "color-warning-surface"
  | "color-warning-solid"
  | "color-warning-text"
  // Error
  | "color-error-subtle"
  | "color-error-surface"
  | "color-error-solid"
  | "color-error-text"
  // Info
  | "color-info-subtle"
  | "color-info-surface"
  | "color-info-solid"
  | "color-info-text";

/**
 * All semantic color tokens
 */
export type SemanticColorToken =
  | BackgroundToken
  | BorderToken
  | TextToken
  | AccentToken
  | StatusToken;

// ============================================================================
// Spacing Token Types
// ============================================================================

/**
 * Primitive spacing tokens
 */
export type PrimitiveSpacingToken =
  | "spacing-0"
  | "spacing-1"
  | "spacing-2"
  | "spacing-3"
  | "spacing-4"
  | "spacing-5"
  | "spacing-6"
  | "spacing-8"
  | "spacing-10"
  | "spacing-12"
  | "spacing-16"
  | "spacing-20"
  | "spacing-24"
  | "spacing-32";

/**
 * Semantic spacing tokens
 */
export type SemanticSpacingToken =
  // Component spacing
  | "spacing-component-xs" // 4px - tiny padding
  | "spacing-component-sm" // 8px - small padding
  | "spacing-component-md" // 12px - medium padding
  | "spacing-component-lg" // 16px - large padding
  | "spacing-component-xl" // 24px - extra large padding
  // Layout spacing
  | "spacing-layout-xs" // 16px - small gaps
  | "spacing-layout-sm" // 24px - medium gaps
  | "spacing-layout-md" // 32px - large gaps
  | "spacing-layout-lg" // 48px - section gaps
  | "spacing-layout-xl"; // 64px - page gaps

// ============================================================================
// Border Radius Token Types
// ============================================================================

/**
 * Primitive radius tokens
 */
export type PrimitiveRadiusToken =
  | "radius-none"
  | "radius-sm"
  | "radius-md"
  | "radius-lg"
  | "radius-xl"
  | "radius-2xl"
  | "radius-3xl"
  | "radius-full";

/**
 * Semantic radius tokens
 */
export type SemanticRadiusToken =
  | "radius-component-sm" // Small components (buttons, inputs)
  | "radius-component-md" // Medium components (cards)
  | "radius-component-lg" // Large components (modals)
  | "radius-full"; // Pills, avatars

// ============================================================================
// Typography Token Types
// ============================================================================

/**
 * Typography semantic tokens
 */
export type TypographyToken =
  // Display text (largest)
  | "text-display-lg"
  | "text-display-md"
  | "text-display-sm"
  // Heading text
  | "text-heading-lg"
  | "text-heading-md"
  | "text-heading-sm"
  // Body text
  | "text-body-lg"
  | "text-body-md"
  | "text-body-sm"
  // Label/caption text (smallest)
  | "text-label-lg"
  | "text-label-md"
  | "text-label-sm";

// ============================================================================
// Unified Token Types
// ============================================================================

/**
 * All design tokens (primitive + semantic)
 */
export type DesignToken =
  | PrimitiveColorToken
  | SemanticColorToken
  | PrimitiveSpacingToken
  | SemanticSpacingToken
  | PrimitiveRadiusToken
  | SemanticRadiusToken
  | TypographyToken;

/**
 * Token categories for organization
 */
export type TokenCategory = "color" | "spacing" | "radius" | "typography";

// ============================================================================
// Utility Types
// ============================================================================

/**
 * CSS custom property helper
 */
export type CSSCustomProperty<T extends string> = `var(--${T})`;

/**
 * Get CSS custom property for any token
 */
export function getTokenCSS<T extends DesignToken>(
  token: T,
): CSSCustomProperty<T> {
  return `var(--${token.replace(/([A-Z])/g, "-$1").toLowerCase()})` as CSSCustomProperty<T>;
}

/**
 * Token value mapping (for compile-time checking)
 */
export interface TokenValue {
  // Colors map to hex/rgb values
  [K in SemanticColorToken]: string;
}

/**
 * Component token mapping (allows components to define their own tokens)
 */
export interface ComponentTokens {
  [componentName: string]: {
    [tokenName: string]: DesignToken;
  };
}

// ============================================================================
// Theme Configuration
// ============================================================================

/**
 * Theme configuration interface
 */
export interface ThemeConfig {
  name: string;
  tokens: {
    primitive: Record<PrimitiveColorToken, string>;
    semantic: Record<SemanticColorToken, PrimitiveColorToken>;
  };
}

/**
 * Available themes
 */
export type Theme = "light" | "dark";

// ============================================================================
// Examples & Documentation
// ============================================================================

/**
 * Example usage:
 *
 * ```typescript
 * // ✅ Type-safe token usage
 * const primaryText: SemanticColorToken = "color-text-primary";
 * const buttonBg: AccentToken = "color-accent-solid";
 *
 * // ✅ CSS custom property generation
 * const cssVar = getTokenCSS("color-background-canvas"); // "var(--color-background-canvas)"
 *
 * // ✅ Component token definition
 * const buttonTokens: ComponentTokens = {
 *   Button: {
 *     background: "color-accent-solid",
 *     text: "color-text-inverse",
 *     border: "color-border-default"
 *   }
 * };
 * ```
 */

export default DesignToken;
