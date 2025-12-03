/**
 * Semantic Color Tokens
 * Purpose-driven color tokens that reference primitive colors
 * Type-safe references to primitive tokens
 */

import type { PrimitiveColorKey } from "../colors";

/**
 * Type-safe primitive color reference
 */
type PrimitiveRef = PrimitiveColorKey;

/**
 * Background Colors
 * - Used for surfaces, cards, overlays
 */
export const colorBackground = {
  // Canvas backgrounds
  "color-background-canvas": "gray1" as PrimitiveRef, // Main app background
  "color-background-panel": "gray2" as PrimitiveRef, // Panel/card background
  "color-background-surface": "gray3" as PrimitiveRef, // Interactive surface

  // Interactive backgrounds
  "color-background-hover": "gray4" as PrimitiveRef, // Hover state
  "color-background-pressed": "gray5" as PrimitiveRef, // Pressed state
  "color-background-selected": "gray6" as PrimitiveRef, // Selected state

  // Overlay backgrounds
  "color-background-overlay": "grayA8" as PrimitiveRef, // Modal overlay
  "color-background-tooltip": "gray12" as PrimitiveRef, // Tooltip background
} as const;

/**
 * Border Colors
 * - Used for borders, dividers, outlines
 */
export const colorBorder = {
  "color-border-default": "gray7" as PrimitiveRef, // Default border
  "color-border-hover": "gray8" as PrimitiveRef, // Border on hover
  "color-border-focus": "blue8" as PrimitiveRef, // Focus ring
  "color-border-subtle": "gray6" as PrimitiveRef, // Subtle border
  "color-border-strong": "gray9" as PrimitiveRef, // Strong border
} as const;

/**
 * Text Colors
 * - Used for text content at different hierarchy levels
 */
export const colorText = {
  "color-text-primary": "gray12" as PrimitiveRef, // Primary text (high contrast)
  "color-text-secondary": "gray11" as PrimitiveRef, // Secondary text (medium contrast)
  "color-text-tertiary": "gray10" as PrimitiveRef, // Tertiary text (low contrast)
  "color-text-placeholder": "gray9" as PrimitiveRef, // Placeholder text
  "color-text-disabled": "gray8" as PrimitiveRef, // Disabled text
  "color-text-inverse": "gray1" as PrimitiveRef, // Text on dark backgrounds
} as const;

/**
 * Brand/Accent Colors
 * - Used for primary actions, links, and brand elements
 */
export const colorAccent = {
  "color-accent-subtle": "blue3" as PrimitiveRef, // Subtle accent background
  "color-accent-muted": "blue4" as PrimitiveRef, // Muted accent background
  "color-accent-surface": "blue5" as PrimitiveRef, // Accent surface
  "color-accent-hover": "blue6" as PrimitiveRef, // Accent hover
  "color-accent-pressed": "blue7" as PrimitiveRef, // Accent pressed
  "color-accent-solid": "blue9" as PrimitiveRef, // Main accent/brand color
  "color-accent-solid-hover": "blue10" as PrimitiveRef, // Accent solid hover
  "color-accent-text": "blue11" as PrimitiveRef, // Accent text color
  "color-accent-contrast": "blue12" as PrimitiveRef, // High contrast accent
} as const;

/**
 * Status Colors
 * - Used for success, warning, error, info states
 */
export const colorStatus = {
  // Success (Green)
  "color-success-subtle": "green3" as PrimitiveRef,
  "color-success-surface": "green4" as PrimitiveRef,
  "color-success-solid": "green9" as PrimitiveRef,
  "color-success-text": "green11" as PrimitiveRef,

  // Warning (Amber)
  "color-warning-subtle": "amber3" as PrimitiveRef,
  "color-warning-surface": "amber4" as PrimitiveRef,
  "color-warning-solid": "amber9" as PrimitiveRef,
  "color-warning-text": "amber11" as PrimitiveRef,

  // Error (Red)
  "color-error-subtle": "red3" as PrimitiveRef,
  "color-error-surface": "red4" as PrimitiveRef,
  "color-error-solid": "red9" as PrimitiveRef,
  "color-error-text": "red11" as PrimitiveRef,

  // Info (Blue - same as accent but semantically named)
  "color-info-subtle": "blue3" as PrimitiveRef,
  "color-info-surface": "blue4" as PrimitiveRef,
  "color-info-solid": "blue9" as PrimitiveRef,
  "color-info-text": "blue11" as PrimitiveRef,
} as const;

/**
 * All semantic color tokens combined
 */
export const semanticColors = {
  ...colorBackground,
  ...colorBorder,
  ...colorText,
  ...colorAccent,
  ...colorStatus,
} as const;
