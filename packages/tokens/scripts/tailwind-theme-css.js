import { writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Tailwind CSS v4용 @theme CSS 생성
 * tokens의 CSS 변수를 Tailwind 유틸리티 클래스로 사용할 수 있게 합니다.
 */
async function generateTailwindThemeCSS() {
  const outputDir = path.join(__dirname, "../dist/css");
  await mkdir(outputDir, { recursive: true });

  const themeCSS = `/**
 * Tailwind CSS v4 Theme Integration
 * @srf/tokens의 CSS 변수를 Tailwind 유틸리티 클래스로 사용할 수 있습니다.
 * 
 * 사용법:
 * @import "@srf/tokens/tailwind";
 * 
 * 예시:
 * <div class="bg-canvas text-primary p-my-md rounded-my-sm border-default">
 *   <button class="bg-accent-solid text-inverse hover:bg-accent-solid-hover">
 *     Button
 *   </button>
 * </div>
 */

@theme inline {
  /* ========================================
   * Color - Background (bg-*)
   * bg-canvas, bg-panel, bg-surface, bg-hover, etc.
   * ======================================== */
  --color-canvas: var(--color-background-canvas);
  --color-panel: var(--color-background-panel);
  --color-surface: var(--color-background-surface);
  --color-hover: var(--color-background-hover);
  --color-pressed: var(--color-background-pressed);
  --color-selected: var(--color-background-selected);
  --color-overlay: var(--color-background-overlay);
  --color-tooltip: var(--color-background-tooltip);

  /* ========================================
   * Color - Text (text-*)
   * text-primary, text-secondary, text-tertiary, etc.
   * ======================================== */
  --color-primary: var(--color-text-primary);
  --color-secondary: var(--color-text-secondary);
  --color-tertiary: var(--color-text-tertiary);
  --color-placeholder: var(--color-text-placeholder);
  --color-disabled: var(--color-text-disabled);
  --color-inverse: var(--color-text-inverse);

  /* ========================================
   * Color - Border (border-*)
   * border-default, border-subtle, border-strong, etc.
   * ======================================== */
  --color-default: var(--color-border-default);
  --color-border-hover: var(--color-border-hover);
  --color-focus: var(--color-border-focus);
  --color-subtle: var(--color-border-subtle);
  --color-strong: var(--color-border-strong);

  /* ========================================
   * Color - Accent/Brand (bg-accent-*, text-accent-*)
   * bg-accent-solid, bg-accent-subtle, text-accent, etc.
   * ======================================== */
  --color-accent-subtle: var(--color-accent-subtle);
  --color-accent-muted: var(--color-accent-muted);
  --color-accent-surface: var(--color-accent-surface);
  --color-accent-hover: var(--color-accent-hover);
  --color-accent-pressed: var(--color-accent-pressed);
  --color-accent-solid: var(--color-accent-solid);
  --color-accent-solid-hover: var(--color-accent-solid-hover);
  --color-accent: var(--color-accent-text);
  --color-accent-contrast: var(--color-accent-contrast);

  /* ========================================
   * Color - Status Success (bg-success-*, text-success-*)
   * ======================================== */
  --color-success-subtle: var(--color-success-subtle);
  --color-success-surface: var(--color-success-surface);
  --color-success-solid: var(--color-success-solid);
  --color-success: var(--color-success-text);

  /* ========================================
   * Color - Status Warning (bg-warning-*, text-warning-*)
   * ======================================== */
  --color-warning-subtle: var(--color-warning-subtle);
  --color-warning-surface: var(--color-warning-surface);
  --color-warning-solid: var(--color-warning-solid);
  --color-warning: var(--color-warning-text);

  /* ========================================
   * Color - Status Error (bg-error-*, text-error-*)
   * ======================================== */
  --color-error-subtle: var(--color-error-subtle);
  --color-error-surface: var(--color-error-surface);
  --color-error-solid: var(--color-error-solid);
  --color-error: var(--color-error-text);

  /* ========================================
   * Color - Status Info (bg-info-*, text-info-*)
   * ======================================== */
  --color-info-subtle: var(--color-info-subtle);
  --color-info-surface: var(--color-info-surface);
  --color-info-solid: var(--color-info-solid);
  --color-info: var(--color-info-text);

  /* ========================================
   * Spacing - Component (p-my-*, m-my-*, gap-my-*)
   * p-my-xs, p-my-sm, p-my-md, p-my-lg, p-my-xl
   * ======================================== */
  --spacing-my-xs: var(--spacing-component-xs);
  --spacing-my-sm: var(--spacing-component-sm);
  --spacing-my-md: var(--spacing-component-md);
  --spacing-my-lg: var(--spacing-component-lg);
  --spacing-my-xl: var(--spacing-component-xl);

  /* ========================================
   * Spacing - Layout (p-my-layout-*, m-my-layout-*, gap-my-layout-*)
   * p-my-layout-xs, gap-my-layout-md, m-my-layout-lg, etc.
   * ======================================== */
  --spacing-my-layout-xs: var(--spacing-layout-xs);
  --spacing-my-layout-sm: var(--spacing-layout-sm);
  --spacing-my-layout-md: var(--spacing-layout-md);
  --spacing-my-layout-lg: var(--spacing-layout-lg);
  --spacing-my-layout-xl: var(--spacing-layout-xl);

  /* ========================================
   * Border Radius (rounded-my-*)
   * rounded-my-xs, rounded-my-sm, rounded-my-md, rounded-my-lg
   * 
   * Note: Tailwind 기본값(rounded-full=9999px)은 유지됨
   * ======================================== */
  --radius-my-xs: var(--radius-component-sm);
  --radius-my-sm: var(--radius-component-sm);
  --radius-my-md: var(--radius-component-md);
  --radius-my-lg: var(--radius-component-lg);
}
`;

  writeFileSync(path.join(outputDir, "tailwind-theme.css"), themeCSS);
  console.log("✅ Tailwind v4 theme CSS 생성: dist/css/tailwind-theme.css");
}

generateTailwindThemeCSS();
