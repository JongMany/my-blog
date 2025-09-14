/**
 * Button Component Tokens
 * Following Adobe Spectrum component token pattern
 *
 * Architecture:
 * Primitive tokens → Semantic tokens → Component tokens
 */

import type {
  SemanticColorToken,
  SemanticSpacingToken,
  SemanticRadiusToken,
} from "../../types/tokens";

/**
 * Button component token mapping
 * Maps component-specific tokens to semantic tokens
 */
export const buttonTokens = {
  // Primary button (main CTA)
  primary: {
    background: "color-accent-solid" as SemanticColorToken,
    backgroundHover: "color-accent-solid-hover" as SemanticColorToken,
    backgroundPressed: "color-accent-pressed" as SemanticColorToken,
    text: "color-text-inverse" as SemanticColorToken,
    border: "color-accent-solid" as SemanticColorToken,
    borderHover: "color-accent-solid-hover" as SemanticColorToken,
  },

  // Secondary button (secondary actions)
  secondary: {
    background: "color-background-surface" as SemanticColorToken,
    backgroundHover: "color-background-hover" as SemanticColorToken,
    backgroundPressed: "color-background-pressed" as SemanticColorToken,
    text: "color-text-primary" as SemanticColorToken,
    border: "color-border-default" as SemanticColorToken,
    borderHover: "color-border-hover" as SemanticColorToken,
  },

  // Ghost button (subtle actions)
  ghost: {
    background: "color-background-canvas" as SemanticColorToken,
    backgroundHover: "color-background-surface" as SemanticColorToken,
    backgroundPressed: "color-background-hover" as SemanticColorToken,
    text: "color-accent-text" as SemanticColorToken,
    border: "color-background-canvas" as SemanticColorToken,
    borderHover: "color-border-subtle" as SemanticColorToken,
  },

  // Destructive button (dangerous actions)
  destructive: {
    background: "color-error-solid" as SemanticColorToken,
    backgroundHover: "color-error-solid" as SemanticColorToken, // Could be darker variant
    backgroundPressed: "color-error-solid" as SemanticColorToken,
    text: "color-text-inverse" as SemanticColorToken,
    border: "color-error-solid" as SemanticColorToken,
    borderHover: "color-error-solid" as SemanticColorToken,
  },

  // Size variants
  size: {
    sm: {
      paddingX: "spacing-component-sm" as SemanticSpacingToken,
      paddingY: "spacing-component-xs" as SemanticSpacingToken,
      borderRadius: "radius-component-sm" as SemanticRadiusToken,
      fontSize: "text-label-md",
    },
    md: {
      paddingX: "spacing-component-md" as SemanticSpacingToken,
      paddingY: "spacing-component-sm" as SemanticSpacingToken,
      borderRadius: "radius-component-sm" as SemanticRadiusToken,
      fontSize: "text-body-sm",
    },
    lg: {
      paddingX: "spacing-component-lg" as SemanticSpacingToken,
      paddingY: "spacing-component-md" as SemanticSpacingToken,
      borderRadius: "radius-component-md" as SemanticRadiusToken,
      fontSize: "text-body-md",
    },
  },

  // State variants
  state: {
    disabled: {
      background: "color-background-surface" as SemanticColorToken,
      text: "color-text-disabled" as SemanticColorToken,
      border: "color-border-subtle" as SemanticColorToken,
    },
    loading: {
      background: "color-background-selected" as SemanticColorToken,
      text: "color-text-tertiary" as SemanticColorToken,
      border: "color-border-default" as SemanticColorToken,
    },
  },
} as const;

/**
 * Generate CSS custom properties for button component
 */
export function generateButtonCSS() {
  return `
/* Button Component Tokens */
/* Generated from semantic design tokens */

.button {
  /* Default (primary) button */
  --button-background: var(--${buttonTokens.primary.background});
  --button-background-hover: var(--${buttonTokens.primary.backgroundHover});
  --button-background-pressed: var(--${buttonTokens.primary.backgroundPressed});
  --button-text: var(--${buttonTokens.primary.text});
  --button-border: var(--${buttonTokens.primary.border});
  --button-border-hover: var(--${buttonTokens.primary.borderHover});
  
  /* Size tokens */
  --button-padding-x: var(--${buttonTokens.size.md.paddingX});
  --button-padding-y: var(--${buttonTokens.size.md.paddingY});
  --button-border-radius: var(--${buttonTokens.size.md.borderRadius});
  
  /* Base styles */
  background: var(--button-background);
  color: var(--button-text);
  border: 1px solid var(--button-border);
  border-radius: var(--button-border-radius);
  padding: var(--button-padding-y) var(--button-padding-x);
  cursor: pointer;
  transition: all 0.2s ease;
}

.button:hover {
  background: var(--button-background-hover);
  border-color: var(--button-border-hover);
}

.button:active {
  background: var(--button-background-pressed);
}

/* Variant: Secondary */
.button--secondary {
  --button-background: var(--${buttonTokens.secondary.background});
  --button-background-hover: var(--${buttonTokens.secondary.backgroundHover});
  --button-background-pressed: var(--${buttonTokens.secondary.backgroundPressed});
  --button-text: var(--${buttonTokens.secondary.text});
  --button-border: var(--${buttonTokens.secondary.border});
  --button-border-hover: var(--${buttonTokens.secondary.borderHover});
}

/* Variant: Ghost */
.button--ghost {
  --button-background: var(--${buttonTokens.ghost.background});
  --button-background-hover: var(--${buttonTokens.ghost.backgroundHover});
  --button-background-pressed: var(--${buttonTokens.ghost.backgroundPressed});
  --button-text: var(--${buttonTokens.ghost.text});
  --button-border: var(--${buttonTokens.ghost.border});
  --button-border-hover: var(--${buttonTokens.ghost.borderHover});
}

/* Variant: Destructive */
.button--destructive {
  --button-background: var(--${buttonTokens.destructive.background});
  --button-background-hover: var(--${buttonTokens.destructive.backgroundHover});
  --button-background-pressed: var(--${buttonTokens.destructive.backgroundPressed});
  --button-text: var(--${buttonTokens.destructive.text});
  --button-border: var(--${buttonTokens.destructive.border});
  --button-border-hover: var(--${buttonTokens.destructive.borderHover});
}

/* Size: Small */
.button--sm {
  --button-padding-x: var(--${buttonTokens.size.sm.paddingX});
  --button-padding-y: var(--${buttonTokens.size.sm.paddingY});
  --button-border-radius: var(--${buttonTokens.size.sm.borderRadius});
}

/* Size: Large */
.button--lg {
  --button-padding-x: var(--${buttonTokens.size.lg.paddingX});
  --button-padding-y: var(--${buttonTokens.size.lg.paddingY});
  --button-border-radius: var(--${buttonTokens.size.lg.borderRadius});
}

/* State: Disabled */
.button:disabled,
.button--disabled {
  --button-background: var(--${buttonTokens.state.disabled.background});
  --button-text: var(--${buttonTokens.state.disabled.text});
  --button-border: var(--${buttonTokens.state.disabled.border});
  cursor: not-allowed;
  opacity: 0.6;
}

/* State: Loading */
.button--loading {
  --button-background: var(--${buttonTokens.state.loading.background});
  --button-text: var(--${buttonTokens.state.loading.text});
  --button-border: var(--${buttonTokens.state.loading.border});
  cursor: wait;
}
`;
}

export type ButtonVariant = keyof typeof buttonTokens;
export type ButtonSize = keyof typeof buttonTokens.size;
