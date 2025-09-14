/**
 * Common Token Presets
 * Pre-configured token combinations for quick usage
 */

/**
 * Most commonly used semantic tokens for quick access
 * Use these when you need fast, type-safe access to design tokens
 */
export const tokens = {
  // Background tokens
  background: {
    canvas: "var(--color-background-canvas)",
    panel: "var(--color-background-panel)",
    surface: "var(--color-background-surface)",
    hover: "var(--color-background-hover)",
    pressed: "var(--color-background-pressed)",
    selected: "var(--color-background-selected)",
    overlay: "var(--color-background-overlay)",
    tooltip: "var(--color-background-tooltip)",
  },

  // Text tokens
  text: {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    tertiary: "var(--color-text-tertiary)",
    placeholder: "var(--color-text-placeholder)",
    disabled: "var(--color-text-disabled)",
    inverse: "var(--color-text-inverse)",
  },

  // Border tokens
  border: {
    default: "var(--color-border-default)",
    hover: "var(--color-border-hover)",
    focus: "var(--color-border-focus)",
    subtle: "var(--color-border-subtle)",
    strong: "var(--color-border-strong)",
  },

  // Accent/brand tokens
  accent: {
    subtle: "var(--color-accent-subtle)",
    muted: "var(--color-accent-muted)",
    surface: "var(--color-accent-surface)",
    hover: "var(--color-accent-hover)",
    pressed: "var(--color-accent-pressed)",
    solid: "var(--color-accent-solid)",
    solidHover: "var(--color-accent-solid-hover)",
    text: "var(--color-accent-text)",
    contrast: "var(--color-accent-contrast)",
  },

  // Status tokens
  status: {
    success: {
      subtle: "var(--color-success-subtle)",
      surface: "var(--color-success-surface)",
      solid: "var(--color-success-solid)",
      text: "var(--color-success-text)",
    },
    warning: {
      subtle: "var(--color-warning-subtle)",
      surface: "var(--color-warning-surface)",
      solid: "var(--color-warning-solid)",
      text: "var(--color-warning-text)",
    },
    error: {
      subtle: "var(--color-error-subtle)",
      surface: "var(--color-error-surface)",
      solid: "var(--color-error-solid)",
      text: "var(--color-error-text)",
    },
    info: {
      subtle: "var(--color-info-subtle)",
      surface: "var(--color-info-surface)",
      solid: "var(--color-info-solid)",
      text: "var(--color-info-text)",
    },
  },

  // Spacing tokens
  spacing: {
    // Component spacing
    component: {
      xs: "var(--spacing-component-xs)",
      sm: "var(--spacing-component-sm)",
      md: "var(--spacing-component-md)",
      lg: "var(--spacing-component-lg)",
      xl: "var(--spacing-component-xl)",
    },
    // Layout spacing
    layout: {
      xs: "var(--spacing-layout-xs)",
      sm: "var(--spacing-layout-sm)",
      md: "var(--spacing-layout-md)",
      lg: "var(--spacing-layout-lg)",
      xl: "var(--spacing-layout-xl)",
    },
  },

  // Border radius tokens
  radius: {
    sm: "var(--radius-component-sm)",
    md: "var(--radius-component-md)",
    lg: "var(--radius-component-lg)",
    full: "var(--radius-full)",
  },
} as const;

/**
 * Simplified token access (for backwards compatibility)
 */
export const simpleTokens = {
  background: {
    canvas: tokens.background.canvas,
    panel: tokens.background.panel,
    surface: tokens.background.surface,
  },
  text: {
    primary: tokens.text.primary,
    secondary: tokens.text.secondary,
    tertiary: tokens.text.tertiary,
  },
  accent: {
    solid: tokens.accent.solid,
    subtle: tokens.accent.subtle,
    text: tokens.accent.text,
  },
  status: {
    success: tokens.status.success.solid,
    warning: tokens.status.warning.solid,
    error: tokens.status.error.solid,
    info: tokens.status.info.solid,
  },
  spacing: {
    xs: tokens.spacing.component.xs,
    sm: tokens.spacing.component.sm,
    md: tokens.spacing.component.md,
    lg: tokens.spacing.component.lg,
    xl: tokens.spacing.component.xl,
  },
  radius: tokens.radius,
} as const;
