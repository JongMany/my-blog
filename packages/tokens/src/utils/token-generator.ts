/**
 * Token Generator
 * Centralized token generation logic for CSS and Tailwind
 * Reads from TypeScript source files (single source of truth)
 */

import { semanticColors } from "../variables/semantic/colors";
import { semanticSpacing } from "../variables/semantic/spacing";
import { semanticRadius } from "../variables/semantic/radius";

/**
 * Convert primitive token key to CSS custom property name
 * e.g., "gray1" -> "--gray-1", "grayA8" -> "--gray-a-8"
 */
export function primitiveToCSSProperty(primitiveKey: string): string {
  return `--${primitiveKey
    .replace(/([A-Z])/g, "-$1")
    .replace(/([a-z])(\d)/g, "$1-$2")
    .toLowerCase()}`;
}

/**
 * Convert semantic token name to CSS custom property
 * e.g., "color-background-canvas" -> "--color-background-canvas"
 */
export function semanticToCSSProperty(semanticToken: string): string {
  return `--${semanticToken}`;
}

/**
 * Get primitive reference from semantic token
 * 
 * @throws {Error} If semantic token doesn't exist or has invalid reference
 */
export function getPrimitiveReference(semanticKey: string): string {
  const allTokens = {
    ...semanticColors,
    ...semanticSpacing,
    ...semanticRadius,
  };
  
  if (!(semanticKey in allTokens)) {
    const availableTokens = Object.keys(allTokens).slice(0, 5).join(", ");
    throw new Error(
      `Invalid semantic token: "${semanticKey}". ` +
      `Token not found in semantic tokens registry. ` +
      `Available tokens include: ${availableTokens}... (and ${Object.keys(allTokens).length - 5} more)`
    );
  }
  
  const token = allTokens[semanticKey as keyof typeof allTokens];
  if (typeof token !== "string") {
    throw new Error(
      `Invalid primitive reference for semantic token: "${semanticKey}". ` +
      `Expected string, got ${typeof token}.`
    );
  }
  
  return token;
}

/**
 * Generate semantic CSS from token definitions
 */
export function generateSemanticCSS(): string {
  const allTokens = {
    ...semanticColors,
    ...semanticSpacing,
    ...semanticRadius,
  };

  // Group tokens by category
  const categories = {
    Background: Object.entries(allTokens).filter(([key]) =>
      key.includes("background")
    ),
    Border: Object.entries(allTokens).filter(([key]) => key.includes("border")),
    Text: Object.entries(allTokens).filter(([key]) => key.includes("text")),
    Accent: Object.entries(allTokens).filter(([key]) => key.includes("accent")),
    Status: Object.entries(allTokens).filter(
      ([key]) =>
        key.includes("success") ||
        key.includes("warning") ||
        key.includes("error") ||
        key.includes("info")
    ),
    Spacing: Object.entries(allTokens).filter(([key]) =>
      key.includes("spacing")
    ),
    Radius: Object.entries(allTokens).filter(([key]) => key.includes("radius")),
  };

  // Generate light theme CSS
  let lightCss = `:root, .light, .light-theme {\n`;
  lightCss += `  /* Semantic Design Tokens - Light Theme */\n`;
  lightCss += `  /* Auto-generated from TypeScript source */\n\n`;

  for (const [categoryName, tokens] of Object.entries(categories)) {
    if (tokens.length === 0) continue;

    lightCss += `  /* ${categoryName} */\n`;
    for (const [semanticToken, primitiveRef] of tokens) {
      const primitiveKey = String(primitiveRef);
      const cssProperty = semanticToCSSProperty(semanticToken);
      const referencedProperty = primitiveToCSSProperty(primitiveKey);
      lightCss += `  ${cssProperty}: var(${referencedProperty});\n`;
    }
    lightCss += `\n`;
  }

  lightCss += `}\n`;

  // Generate dark theme CSS (same structure, but references dark variants)
  let darkCss = `.dark, .dark-theme {\n`;
  darkCss += `  /* Semantic Design Tokens - Dark Theme */\n`;
  darkCss += `  /* Uses dark variants of primitive tokens */\n\n`;

  for (const [categoryName, tokens] of Object.entries(categories)) {
    if (tokens.length === 0) continue;

    darkCss += `  /* ${categoryName} */\n`;
    for (const [semanticToken, primitiveRef] of tokens) {
      const primitiveKey = String(primitiveRef);
      const darkPrimitiveKey = toDarkThemeKey(primitiveKey);
      const cssProperty = semanticToCSSProperty(semanticToken);
      const referencedProperty = primitiveToCSSProperty(darkPrimitiveKey);
      darkCss += `  ${cssProperty}: var(${referencedProperty});\n`;
    }
    darkCss += `\n`;
  }

  darkCss += `}\n`;

  return `/*
 * Semantic Design Tokens
 * Auto-generated from TypeScript source (single source of truth)
 * 
 * Architecture:
 * 1. Primitive tokens (--gray-1, --blue-9) - base color scales
 * 2. Semantic tokens (--color-text-primary) - purpose-driven, reference primitives
 * 3. Component tokens (--button-background) - component-specific, reference semantic
 * 
 * This file is generated automatically. Do not edit manually.
 * To modify tokens, edit: src/variables/semantic/*.ts
 */\n\n${lightCss}\n${darkCss}`;
}

/**
 * Convert primitive token key to dark theme variant
 * e.g., "gray1" -> "grayDark1", "blue9" -> "blueDark9", "grayA8" -> "grayDarkA8"
 */
export function toDarkThemeKey(primitiveKey: string): string {
  // Handle spacing and radius tokens (no dark variant needed)
  if (primitiveKey.startsWith("spacing-") || primitiveKey.startsWith("radius-")) {
    return primitiveKey;
  }

  const match = primitiveKey.match(/^([a-z]+)(A?)(\d+)$/i);
  if (!match) {
    return primitiveKey;
  }

  const [, colorName, alphaSuffix, scale] = match;
  return `${colorName}Dark${alphaSuffix}${scale}`;
}

/**
 * Tailwind CSS v4 @theme mapping configuration
 * Maps semantic tokens to Tailwind utility classes
 */
export interface TailwindMapping {
  /**
   * Color mappings for Tailwind utilities
   * Key: Tailwind class name (without prefix)
   * Value: Semantic token reference
   */
  colors: Record<string, string>;
  
  /**
   * Spacing mappings
   */
  spacing: Record<string, string>;
  
  /**
   * Radius mappings
   */
  radius: Record<string, string>;
}

/**
 * Default Tailwind mappings
 * These define how semantic tokens map to Tailwind utility classes
 */
export const defaultTailwindMappings: TailwindMapping = {
  colors: {
    // Background colors -> bg-*
    canvas: "color-background-canvas",
    panel: "color-background-panel",
    surface: "color-background-surface",
    hover: "color-background-hover",
    pressed: "color-background-pressed",
    selected: "color-background-selected",
    overlay: "color-background-overlay",
    tooltip: "color-background-tooltip",

    // Text colors -> text-*
    primary: "color-text-primary",
    secondary: "color-text-secondary",
    tertiary: "color-text-tertiary",
    placeholder: "color-text-placeholder",
    disabled: "color-text-disabled",
    inverse: "color-text-inverse",

    // Border colors -> border-*
    default: "color-border-default",
    "border-hover": "color-border-hover",
    focus: "color-border-focus",
    subtle: "color-border-subtle",
    strong: "color-border-strong",

    // Accent colors -> bg-accent-*, text-accent-*
    "accent-subtle": "color-accent-subtle",
    "accent-muted": "color-accent-muted",
    "accent-surface": "color-accent-surface",
    "accent-hover": "color-accent-hover",
    "accent-pressed": "color-accent-pressed",
    "accent-solid": "color-accent-solid",
    "accent-solid-hover": "color-accent-solid-hover",
    accent: "color-accent-text",
    "accent-contrast": "color-accent-contrast",

    // Status colors
    "success-subtle": "color-success-subtle",
    "success-surface": "color-success-surface",
    "success-solid": "color-success-solid",
    success: "color-success-text",

    "warning-subtle": "color-warning-subtle",
    "warning-surface": "color-warning-surface",
    "warning-solid": "color-warning-solid",
    warning: "color-warning-text",

    "error-subtle": "color-error-subtle",
    "error-surface": "color-error-surface",
    "error-solid": "color-error-solid",
    error: "color-error-text",

    "info-subtle": "color-info-subtle",
    "info-surface": "color-info-surface",
    "info-solid": "color-info-solid",
    info: "color-info-text",
  },
  spacing: {
    // Component spacing -> p-my-*, m-my-*, gap-my-*
    "my-xs": "spacing-component-xs",
    "my-sm": "spacing-component-sm",
    "my-md": "spacing-component-md",
    "my-lg": "spacing-component-lg",
    "my-xl": "spacing-component-xl",

    // Layout spacing -> p-my-layout-*, m-my-layout-*
    "my-layout-xs": "spacing-layout-xs",
    "my-layout-sm": "spacing-layout-sm",
    "my-layout-md": "spacing-layout-md",
    "my-layout-lg": "spacing-layout-lg",
    "my-layout-xl": "spacing-layout-xl",
  },
  radius: {
    // Border radius -> rounded-my-*
    "my-xs": "radius-component-sm",
    "my-sm": "radius-component-sm",
    "my-md": "radius-component-md",
    "my-lg": "radius-component-lg",
  },
};

/**
 * 실제 값 맵 (primitive token → 실제 CSS 값)
 */
const primitiveValueMap: Record<string, string> = {
  // Radius values
  "radius-sm": "4px",
  "radius-md": "6px",
  "radius-lg": "8px",
  "radius-xl": "12px",
  "radius-full": "9999px",
  
  // Spacing values (spacing-* → 실제 px 값)
  // space-* 변수명과 매핑: spacing-1 → space-1 (4px), spacing-2 → space-2 (8px), etc.
  "spacing-1": "4px",    // space-1
  "spacing-2": "8px",    // space-2
  "spacing-3": "12px",   // space-3
  "spacing-4": "16px",   // space-4
  "spacing-5": "24px",   // space-5
  "spacing-6": "32px",   // space-6
  "spacing-8": "48px",   // space-8
  "spacing-12": "112px", // space-12
  "spacing-16": "160px", // space-16
};

/**
 * Semantic token의 실제 값을 추적
 * @param semanticToken - Semantic token 이름 (예: "radius-component-sm")
 * @returns 실제 값 (예: "4px") 또는 null
 */
function getActualValue(semanticToken: string): string | null {
  try {
    // Semantic token → primitive token 참조 확인
    const allTokens = {
      ...semanticColors,
      ...semanticSpacing,
      ...semanticRadius,
    };
    
    const primitiveRef = allTokens[semanticToken as keyof typeof allTokens];
    if (typeof primitiveRef !== "string") {
      return null;
    }
    
    // Primitive token의 실제 값 확인
    return primitiveValueMap[primitiveRef] || null;
  } catch {
    return null;
  }
}

/**
 * Generate Tailwind CSS v4 @theme block
 */
export function generateTailwindThemeCSS(
  mappings: TailwindMapping = defaultTailwindMappings
): string {
  let themeCSS = `/**
 * Tailwind CSS v4 Theme Integration
 * Auto-generated from token definitions
 * 
 * Usage:
 * @import "@srf/tokens/tailwind";
 * 
 * Examples:
 * <div class="bg-canvas text-primary p-my-md rounded-my-sm border-default">
 *   <button class="bg-accent-solid text-inverse hover:bg-accent-solid-hover">
 *     Button
 *   </button>
 * </div>
 */

@theme inline {
`;

  // Generate color mappings
  if (Object.keys(mappings.colors).length > 0) {
    themeCSS += `  /* ========================================\n`;
    themeCSS += `   * Colors (bg-*, text-*, border-*)\n`;
    themeCSS += `   * ======================================== */\n`;
    
    for (const [tailwindName, semanticToken] of Object.entries(mappings.colors)) {
      const cssVar = semanticToCSSProperty(semanticToken);
      // 색상은 복잡하므로 주석 생략 (필요시 나중에 추가 가능)
      themeCSS += `  --color-${tailwindName}: var(${cssVar});\n`;
    }
    themeCSS += `\n`;
  }

  // Generate spacing mappings
  if (Object.keys(mappings.spacing).length > 0) {
    themeCSS += `  /* ========================================\n`;
    themeCSS += `   * Spacing (p-*, m-*, gap-*)\n`;
    themeCSS += `   * ======================================== */\n`;
    
    for (const [tailwindName, semanticToken] of Object.entries(mappings.spacing)) {
      const cssVar = semanticToCSSProperty(semanticToken);
      const actualValue = getActualValue(semanticToken);
      const comment = actualValue ? ` /* ${actualValue} */` : "";
      themeCSS += `  --spacing-${tailwindName}: var(${cssVar});${comment}\n`;
    }
    themeCSS += `\n`;
  }

  // Generate radius mappings
  if (Object.keys(mappings.radius).length > 0) {
    themeCSS += `  /* ========================================\n`;
    themeCSS += `   * Border Radius (rounded-*)\n`;
    themeCSS += `   * ======================================== */\n`;
    
    for (const [tailwindName, semanticToken] of Object.entries(mappings.radius)) {
      const cssVar = semanticToCSSProperty(semanticToken);
      const actualValue = getActualValue(semanticToken);
      const comment = actualValue ? ` /* ${actualValue} */` : "";
      themeCSS += `  --radius-${tailwindName}: var(${cssVar});${comment}\n`;
    }
    themeCSS += `\n`;
  }

  themeCSS += `}\n`;

  return themeCSS;
}

