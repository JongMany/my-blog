/**
 * Semantic Color Tokens
 * Purpose-driven color tokens that reference primitive colors
 */

/**
 * Background Colors
 * - Used for surfaces, cards, overlays
 */
export const colorBackground = {
  // Canvas backgrounds
  "color-background-canvas": "gray1", // Main app background
  "color-background-panel": "gray2", // Panel/card background
  "color-background-surface": "gray3", // Interactive surface

  // Interactive backgrounds
  "color-background-hover": "gray4", // Hover state
  "color-background-pressed": "gray5", // Pressed state
  "color-background-selected": "gray6", // Selected state

  // Overlay backgrounds
  "color-background-overlay": "grayA8", // Modal overlay
  "color-background-tooltip": "gray12", // Tooltip background
} as const;

/**
 * Border Colors
 * - Used for borders, dividers, outlines
 */
export const colorBorder = {
  "color-border-default": "gray7", // Default border
  "color-border-hover": "gray8", // Border on hover
  "color-border-focus": "blue8", // Focus ring
  "color-border-subtle": "gray6", // Subtle border
  "color-border-strong": "gray9", // Strong border
} as const;

/**
 * Text Colors
 * - Used for text content at different hierarchy levels
 */
export const colorText = {
  "color-text-primary": "gray12", // Primary text (high contrast)
  "color-text-secondary": "gray11", // Secondary text (medium contrast)
  "color-text-tertiary": "gray10", // Tertiary text (low contrast)
  "color-text-placeholder": "gray9", // Placeholder text
  "color-text-disabled": "gray8", // Disabled text
  "color-text-inverse": "gray1", // Text on dark backgrounds
} as const;

/**
 * Brand/Accent Colors
 * - Used for primary actions, links, and brand elements
 */
export const colorAccent = {
  "color-accent-subtle": "blue3", // Subtle accent background
  "color-accent-muted": "blue4", // Muted accent background
  "color-accent-surface": "blue5", // Accent surface
  "color-accent-hover": "blue6", // Accent hover
  "color-accent-pressed": "blue7", // Accent pressed
  "color-accent-solid": "blue9", // Main accent/brand color
  "color-accent-solid-hover": "blue10", // Accent solid hover
  "color-accent-text": "blue11", // Accent text color
  "color-accent-contrast": "blue12", // High contrast accent
} as const;

/**
 * Status Colors
 * - Used for success, warning, error, info states
 */
export const colorStatus = {
  // Success (Green)
  "color-success-subtle": "green3",
  "color-success-surface": "green4",
  "color-success-solid": "green9",
  "color-success-text": "green11",

  // Warning (Amber)
  "color-warning-subtle": "amber3",
  "color-warning-surface": "amber4",
  "color-warning-solid": "amber9",
  "color-warning-text": "amber11",

  // Error (Red)
  "color-error-subtle": "red3",
  "color-error-surface": "red4",
  "color-error-solid": "red9",
  "color-error-text": "red11",

  // Info (Blue - same as accent but semantically named)
  "color-info-subtle": "blue3",
  "color-info-surface": "blue4",
  "color-info-solid": "blue9",
  "color-info-text": "blue11",
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
