import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Generate semantic CSS tokens that reference primitive tokens
 * This creates the Radix UI / Adobe Spectrum style token hierarchy:
 *
 * Primitive tokens (gray1, blue9) → Semantic tokens (color-text-primary) → Component tokens
 */

// Import our semantic token definitions
// Note: We'll need to compile this after creating the semantic tokens
const semanticTokens = {
  // Background Colors
  "color-background-canvas": "gray1",
  "color-background-panel": "gray2",
  "color-background-surface": "gray3",
  "color-background-hover": "gray4",
  "color-background-pressed": "gray5",
  "color-background-selected": "gray6",
  "color-background-overlay": "grayA8",
  "color-background-tooltip": "gray12",

  // Border Colors
  "color-border-default": "gray7",
  "color-border-hover": "gray8",
  "color-border-focus": "blue8",
  "color-border-subtle": "gray6",
  "color-border-strong": "gray9",

  // Text Colors
  "color-text-primary": "gray12",
  "color-text-secondary": "gray11",
  "color-text-tertiary": "gray10",
  "color-text-placeholder": "gray9",
  "color-text-disabled": "gray8",
  "color-text-inverse": "gray1",

  // Accent Colors
  "color-accent-subtle": "blue3",
  "color-accent-muted": "blue4",
  "color-accent-surface": "blue5",
  "color-accent-hover": "blue6",
  "color-accent-pressed": "blue7",
  "color-accent-solid": "blue9",
  "color-accent-solid-hover": "blue10",
  "color-accent-text": "blue11",
  "color-accent-contrast": "blue12",

  // Status Colors - Success
  "color-success-subtle": "green3",
  "color-success-surface": "green4",
  "color-success-solid": "green9",
  "color-success-text": "green11",

  // Status Colors - Warning
  "color-warning-subtle": "amber3",
  "color-warning-surface": "amber4",
  "color-warning-solid": "amber9",
  "color-warning-text": "amber11",

  // Status Colors - Error
  "color-error-subtle": "red3",
  "color-error-surface": "red4",
  "color-error-solid": "red9",
  "color-error-text": "red11",

  // Status Colors - Info
  "color-info-subtle": "blue3",
  "color-info-surface": "blue4",
  "color-info-solid": "blue9",
  "color-info-text": "blue11",

  // Spacing
  "spacing-component-xs": "spacing-1",
  "spacing-component-sm": "spacing-2",
  "spacing-component-md": "spacing-3",
  "spacing-component-lg": "spacing-4",
  "spacing-component-xl": "spacing-6",
  "spacing-layout-xs": "spacing-4",
  "spacing-layout-sm": "spacing-6",
  "spacing-layout-md": "spacing-8",
  "spacing-layout-lg": "spacing-12",
  "spacing-layout-xl": "spacing-16",

  // Border Radius
  "radius-component-sm": "radius-sm",
  "radius-component-md": "radius-md",
  "radius-component-lg": "radius-lg",
  "radius-full": "radius-full",
};

/**
 * Convert camelCase to kebab-case for CSS custom properties
 */
function toCssCustomProperty(tokenName) {
  return `--${tokenName.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
}

/**
 * Convert primitive token reference to CSS custom property
 */
function primitiveToCustomProperty(primitiveToken) {
  // Convert camelCase primitive tokens to CSS custom properties
  // e.g., "gray1" → "--gray-1", "grayA8" → "--gray-a-8"
  return `--${primitiveToken
    .replace(/([A-Z])/g, "-$1")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase()}`;
}

/**
 * Generate semantic CSS that references primitive tokens
 */
async function generateSemanticCss() {
  const outputDir = path.join(__dirname, "../dist");
  await mkdir(outputDir, { recursive: true });

  // Generate light theme semantic tokens
  let lightCss = `:root, .light, .light-theme {\n`;
  lightCss += `  /* Semantic Design Tokens */\n`;
  lightCss += `  /* These reference primitive color tokens for maintainability */\n\n`;

  // Group by category for better organization
  const categories = {
    Background: Object.entries(semanticTokens).filter(([key]) =>
      key.includes("background"),
    ),
    Border: Object.entries(semanticTokens).filter(([key]) =>
      key.includes("border"),
    ),
    Text: Object.entries(semanticTokens).filter(([key]) =>
      key.includes("text"),
    ),
    Accent: Object.entries(semanticTokens).filter(([key]) =>
      key.includes("accent"),
    ),
    Status: Object.entries(semanticTokens).filter(
      ([key]) =>
        key.includes("success") ||
        key.includes("warning") ||
        key.includes("error") ||
        key.includes("info"),
    ),
    Spacing: Object.entries(semanticTokens).filter(([key]) =>
      key.includes("spacing"),
    ),
    Radius: Object.entries(semanticTokens).filter(([key]) =>
      key.includes("radius"),
    ),
  };

  for (const [categoryName, tokens] of Object.entries(categories)) {
    if (tokens.length === 0) continue;

    lightCss += `  /* ${categoryName} */\n`;
    for (const [semanticToken, primitiveToken] of tokens) {
      const cssProperty = toCssCustomProperty(semanticToken);
      const referencedProperty = primitiveToCustomProperty(primitiveToken);
      lightCss += `  ${cssProperty}: var(${referencedProperty});\n`;
    }
    lightCss += `\n`;
  }

  lightCss += `}\n`;

  // Generate dark theme semantic tokens (same structure, but different primitive references)
  let darkCss = `.dark, .dark-theme {\n`;
  darkCss += `  /* Semantic Design Tokens - Dark Theme */\n`;
  darkCss += `  /* Override semantic tokens for dark theme */\n\n`;

  const darkOverrides = {
    // In dark theme, we flip the gray scale
    "color-background-canvas": "grayDark1",
    "color-background-panel": "grayDark2",
    "color-background-surface": "grayDark3",
    "color-background-hover": "grayDark4",
    "color-background-pressed": "grayDark5",
    "color-background-selected": "grayDark6",
    "color-background-tooltip": "grayDark1",

    "color-border-default": "grayDark7",
    "color-border-hover": "grayDark8",
    "color-border-subtle": "grayDark6",
    "color-border-strong": "grayDark9",

    "color-text-primary": "grayDark12",
    "color-text-secondary": "grayDark11",
    "color-text-tertiary": "grayDark10",
    "color-text-placeholder": "grayDark9",
    "color-text-disabled": "grayDark8",
    "color-text-inverse": "grayDark1",

    // Accent colors use dark variants
    "color-accent-subtle": "blueDark3",
    "color-accent-muted": "blueDark4",
    "color-accent-surface": "blueDark5",
    "color-accent-hover": "blueDark6",
    "color-accent-pressed": "blueDark7",
    "color-accent-solid": "blueDark9",
    "color-accent-solid-hover": "blueDark10",
    "color-accent-text": "blueDark11",
    "color-accent-contrast": "blueDark12",

    // Status colors use dark variants
    "color-success-subtle": "greenDark3",
    "color-success-surface": "greenDark4",
    "color-success-solid": "greenDark9",
    "color-success-text": "greenDark11",

    "color-warning-subtle": "amberDark3",
    "color-warning-surface": "amberDark4",
    "color-warning-solid": "amberDark9",
    "color-warning-text": "amberDark11",

    "color-error-subtle": "redDark3",
    "color-error-surface": "redDark4",
    "color-error-solid": "redDark9",
    "color-error-text": "redDark11",

    "color-info-subtle": "blueDark3",
    "color-info-surface": "blueDark4",
    "color-info-solid": "blueDark9",
    "color-info-text": "blueDark11",
  };

  const darkCategories = {
    Background: Object.entries(darkOverrides).filter(([key]) =>
      key.includes("background"),
    ),
    Border: Object.entries(darkOverrides).filter(([key]) =>
      key.includes("border"),
    ),
    Text: Object.entries(darkOverrides).filter(([key]) => key.includes("text")),
    Accent: Object.entries(darkOverrides).filter(([key]) =>
      key.includes("accent"),
    ),
    Status: Object.entries(darkOverrides).filter(
      ([key]) =>
        key.includes("success") ||
        key.includes("warning") ||
        key.includes("error") ||
        key.includes("info"),
    ),
  };

  for (const [categoryName, tokens] of Object.entries(darkCategories)) {
    if (tokens.length === 0) continue;

    darkCss += `  /* ${categoryName} */\n`;
    for (const [semanticToken, primitiveToken] of tokens) {
      const cssProperty = toCssCustomProperty(semanticToken);
      const referencedProperty = primitiveToCustomProperty(primitiveToken);
      darkCss += `  ${cssProperty}: var(${referencedProperty});\n`;
    }
    darkCss += `\n`;
  }

  darkCss += `}\n`;

  // Combine light and dark themes
  const fullCss = `/*
 * Semantic Design Tokens
 * Generated automatically from semantic token definitions
 * 
 * Architecture:
 * 1. Primitive tokens (--gray-1, --blue-9) - defined elsewhere
 * 2. Semantic tokens (--color-text-primary) - defined here, reference primitives  
 * 3. Component tokens (--button-background) - defined per component, reference semantic
 * 
 * This follows Radix UI and Adobe Spectrum best practices.
 */\n\n${lightCss}\n${darkCss}`;

  // Write the semantic CSS file
  writeFileSync(path.join(outputDir, "semantic.css"), fullCss);

  console.log("✅ Generated semantic.css with token references");

  // Also generate a TypeScript type definition
  const typeDefinitions = `
/**
 * Semantic Design Token Types
 * Auto-generated from semantic token definitions
 */

export type SemanticColorToken = 
${Object.keys(semanticTokens)
  .filter((key) => key.startsWith("color-"))
  .map((token) => `  | "${token}"`)
  .join("\n")};

export type SemanticSpacingToken =
${Object.keys(semanticTokens)
  .filter((key) => key.startsWith("spacing-"))
  .map((token) => `  | "${token}"`)
  .join("\n")};

export type SemanticRadiusToken =
${Object.keys(semanticTokens)
  .filter((key) => key.startsWith("radius-"))
  .map((token) => `  | "${token}"`)
  .join("\n")};

export type SemanticToken = SemanticColorToken | SemanticSpacingToken | SemanticRadiusToken;

/**
 * Get CSS custom property name for a semantic token
 */
export function getSemanticTokenCss(token: SemanticToken): string {
  return \`var(--\${token.replace(/([A-Z])/g, '-$1').toLowerCase()})\`;
}
`;

  writeFileSync(path.join(outputDir, "semantic.d.ts"), typeDefinitions);
  console.log("✅ Generated semantic.d.ts with TypeScript types");
}

// Run the generation
generateSemanticCss().catch(console.error);
