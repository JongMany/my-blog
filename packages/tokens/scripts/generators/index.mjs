/**
 * CSS 생성기 함수들
 * 각 토큰 타입별 모듈화된 생성기
 */

import path from "path";
import { ensureDir, writeFile, loadModule } from "../utils/build-utils.mjs";
import {
  generateCSSFromValues,
  createCSSGenerator,
} from "../utils/css-generators.mjs";

// ============================================================================
// 간단한 값 생성기들
// ============================================================================

/**
 * spacing CSS 생성
 */
export const generateSpacingCSS = createCSSGenerator({
  name: "space",
  modulePath: "dist/space.js",
  dataPath: "spaceBaseValues",
  outputSubdir: "space",
});

/**
 * semantic 별칭을 포함한 radius CSS 생성
 */
export async function generateRadiusCSS(config) {
  const radius = await loadModule("dist/radius.js");
  const radiusOutputDir = path.join(config.cssOutputDir, "radius");
  await ensureDir(radiusOutputDir);

  const baseValues = radius.radiusBaseValues;
  const semanticAliases = {
    sm: "4px",
    md: "6px",
    lg: "8px",
    xl: "12px",
  };

  const allValues = { ...baseValues, ...semanticAliases };
  const css = generateCSSFromValues(allValues, "radius");

  writeFile(path.join(radiusOutputDir, "index.css"), css);
}

/**
 * scaling CSS 생성
 */
export async function generateScalingCSS(config) {
  const scaling = await loadModule("dist/scaling.js");
  const scalingOutputDir = path.join(config.cssOutputDir, "scaling");
  await ensureDir(scalingOutputDir);

  const rules = Object.entries(scaling.scalingMap)
    .map(
      ([key, value]) =>
        `  &:where([data-scaling='${key}']) {\n    --scaling: ${value};\n  }`,
    )
    .join("\n");

  const css = `.jds-themes {\n${rules}\n}`;
  writeFile(path.join(scalingOutputDir, "index.css"), css);
}

// ============================================================================
// 타이포그래피 생성기
// ============================================================================

/**
 * 타이포그래피 CSS 생성
 */
export async function generateTypographyCSS(config) {
  const typography = await loadModule("dist/typography.js");
  const typographyOutputDir = path.join(config.cssOutputDir, "typography");
  await ensureDir(typographyOutputDir);

  const cssRules = buildTypographyRules(typography);
  const css = buildTypographyCSS(cssRules);

  writeFile(path.join(typographyOutputDir, "index.css"), css);
}

/**
 * 토큰 데이터에서 타이포그래피 CSS 규칙 생성
 * @param {Object} typography - 타이포그래피 토큰 데이터
 * @returns {string} CSS 규칙들
 */
function buildTypographyRules(typography) {
  const rules = [];

  const formatters = {
    scaled: (key, val, prefix) =>
      `  --${prefix}-${key}: calc(${val}px * var(--scaling));`,
    direct: (key, val, prefix) => `  --${prefix}-${key}: ${val};`,
    emUnit: (key, val, prefix) => `  --${prefix}-${key}: ${val}em;`,
  };

  const typeMap = {
    fontSize: "scaled",
    lineHeight: "scaled",
    headingLineHeight: "scaled",
    fontWeight: "direct",
    letterSpacing: "emUnit",
  };

  for (const [group, values] of Object.entries(typography)) {
    const prefix = kebabCase(group);
    const formatter = formatters[typeMap[group]] || formatters.direct;

    for (const [key, val] of Object.entries(values)) {
      rules.push(formatter(key, val, prefix));
    }
  }

  return rules.join("\n");
}

/**
 * 완전한 타이포그래피 CSS 생성
 * @param {string} rules - CSS 규칙들
 * @returns {string} 완전한 CSS
 */
function buildTypographyCSS(rules) {
  return `
.jds-themes {
  ${rules}
    
${getTypographyDefaults()}
${getTypographyVariants()}
}

${getTypographyBaseStyles()}
`;
}

/**
 * 타이포그래피 기본값 가져오기
 */
function getTypographyDefaults() {
  return `/* 기본값 */
--default-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto,
  'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji',
  'Segoe UI Emoji';
--default-font-size: var(--font-size-3); 
--default-font-style: normal;
--default-font-weight: var(--font-weight-regular);
--default-line-height: 1.5; 
--default-letter-spacing: 0em;
--default-leading-trim-start: 0.42em;
--default-leading-trim-end: 0.36em;`;
}

/**
 * 타이포그래피 변형 스타일 가져오기
 */
function getTypographyVariants() {
  const variants = [
    {
      name: "code",
      family:
        "'Menlo', 'Consolas (Custom)', 'Bitstream Vera Sans Mono', monospace, 'Apple Color Emoji', 'Segoe UI Emoji'",
      sizeAdjust: "0.95",
      letterSpacing: "-0.007em",
      padding: "0.1em 0.25em",
    },
    {
      name: "strong",
      weight: "var(--font-weight-bold)",
    },
    {
      name: "em",
      family: "'Times New Roman', 'Times', serif",
      sizeAdjust: "1.18",
      style: "italic",
      letterSpacing: "-0.025em",
    },
    {
      name: "quote",
      family: "'Times New Roman', 'Times', serif",
      sizeAdjust: "1.18",
      style: "italic",
      letterSpacing: "-0.025em",
    },
  ];

  return variants
    .map((variant) => {
      const props = [];
      if (variant.family)
        props.push(`--${variant.name}-font-family: ${variant.family};`);
      if (variant.sizeAdjust)
        props.push(
          `--${variant.name}-font-size-adjust: ${variant.sizeAdjust};`,
        );
      if (variant.style)
        props.push(`--${variant.name}-font-style: ${variant.style};`);
      if (variant.weight)
        props.push(`--${variant.name}-font-weight: ${variant.weight};`);
      if (variant.letterSpacing)
        props.push(
          `--${variant.name}-letter-spacing: ${variant.letterSpacing};`,
        );
      if (variant.padding) {
        const [top, sides] = variant.padding.split(" ");
        props.push(`--${variant.name}-padding-top: ${top};`);
        props.push(`--${variant.name}-padding-bottom: ${top};`);
        props.push(`--${variant.name}-padding-left: ${sides || top};`);
        props.push(`--${variant.name}-padding-right: ${sides || top};`);
      }
      return `/* ${variant.name.charAt(0).toUpperCase() + variant.name.slice(1)} */\n${props.join("\n")}`;
    })
    .join("\n\n");
}

/**
 * 타이포그래피 기본 스타일 가져오기
 */
function getTypographyBaseStyles() {
  return `.jds-themes {
  overflow-wrap: break-word;
  font-family: var(--default-font-family);
  font-size: var(--default-font-size);
  font-weight: var(--default-font-weight);
  font-style: var(--default-font-style);
  line-height: var(--default-line-height);
  letter-spacing: var(--default-letter-spacing);
  text-size-adjust: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`;
}

/**
 * camelCase를 kebab-case로 변환
 */
function kebabCase(str) {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase();
}

// ============================================================================
// 정적 CSS 생성기들
// ============================================================================

/**
 * cursor CSS 생성
 */
export async function generateCursorCSS(config) {
  const cursorOutputDir = path.join(config.cssOutputDir, "cursor");
  await ensureDir(cursorOutputDir);

  const cursors = {
    button: "default",
    checkbox: "default",
    disabled: "not-allowed",
    link: "pointer",
    "menu-item": "default",
    radio: "default",
    "slider-thumb": "default",
    "slider-thumb-active": "default",
    switch: "default",
  };

  const css = generateCSSFromValues(cursors, "cursor", ".jds-themes");
  writeFile(path.join(cursorOutputDir, "index.css"), css);
}

/**
 * shadow CSS 생성
 */
export async function generateShadowCSS(config) {
  const shadowOutputDir = path.join(config.cssOutputDir, "shadow");
  await ensureDir(shadowOutputDir);

  const css = buildShadowCSS();
  writeFile(path.join(shadowOutputDir, "index.css"), css);
}

/**
 * 모든 변형을 포함한 shadow CSS 생성
 */
function buildShadowCSS() {
  const lightShadows = getLightShadows();
  const darkShadows = getDarkShadows();

  return `/* prettier-ignore */
:where(.jds-themes) {
${lightShadows}
}

/* prettier-ignore */
@supports (color: color-mix(in oklab, white, black)) {
  :where(.jds-themes) {
${lightShadows.replace(/var\(--gray-a\d+\)/g, (match) => {
  const num = match.match(/\d+/)?.[0];
  return num
    ? `color-mix(in oklab, var(--gray-a${num}), var(--gray-${num}) 25%)`
    : match;
})}
  }
}

/* prettier-ignore */
:is(.dark, .dark-theme),
:is(.dark, .dark-theme) :where(.jds-themes:not(.light, .light-theme)) {
${darkShadows}
}

/* prettier-ignore */
@supports (color: color-mix(in oklab, white, black)) {
  :is(.dark, .dark-theme),
  :is(.dark, .dark-theme) :where(.jds-themes:not(.light, .light-theme)) {
${darkShadows.replace(/var\(--gray-a\d+\)/g, (match) => {
  const num = match.match(/\d+/)?.[0];
  return num
    ? `color-mix(in oklab, var(--gray-a${num}), var(--gray-${num}) 25%)`
    : match;
})}
  }
}`;
}

/**
 * 라이트 테마 shadow 가져오기
 */
function getLightShadows() {
  const shadows = {
    1: `    inset 0 0 0 1px var(--gray-a5),
    inset 0 1.5px 2px 0 var(--gray-a2),
    inset 0 1.5px 2px 0 var(--black-a2)`,
    2: `    0 0 0 1px var(--gray-a3),
    0 0 0 0.5px var(--black-a1),
    0 1px 1px 0 var(--gray-a2),
    0 2px 1px -1px var(--black-a1),
    0 1px 3px 0 var(--black-a1)`,
    3: `    0 0 0 1px var(--gray-a3),
    0 2px 3px -2px var(--gray-a3),
    0 3px 12px -4px var(--black-a2),
    0 4px 16px -8px var(--black-a2)`,
    4: `    0 0 0 1px var(--gray-a3),
    0 8px 40px var(--black-a1),
    0 12px 32px -16px var(--gray-a3)`,
    5: `    0 0 0 1px var(--gray-a3),
    0 12px 60px var(--black-a3),
    0 12px 32px -16px var(--gray-a5)`,
    6: `    0 0 0 1px var(--gray-a3),
    0 12px 60px var(--black-a3),
    0 16px 64px var(--gray-a2),
    0 16px 36px -20px var(--gray-a7)`,
  };

  return Object.entries(shadows)
    .map(([level, value]) => `  --shadow-${level}:\n${value};`)
    .join("\n\n");
}

/**
 * 다크 테마 shadow 가져오기
 */
function getDarkShadows() {
  const shadows = {
    1: `    inset 0 -1px 1px 0 var(--gray-a3),
    inset 0 0 0 1px var(--gray-a3),
    inset 0 3px 4px 0 var(--black-a5),
    inset 0 0 0 1px var(--gray-a4)`,
    2: `    0 0 0 1px var(--gray-a6),
    0 0 0 0.5px var(--black-a3),
    0 1px 1px 0 var(--black-a6),
    0 2px 1px -1px var(--black-a6),
    0 1px 3px 0 var(--black-a5)`,
    3: `    0 0 0 1px var(--gray-a6),
    0 2px 3px -2px var(--black-a3),
    0 3px 8px -2px var(--black-a6),
    0 4px 12px -4px var(--black-a7)`,
    4: `    0 0 0 1px var(--gray-a6),
    0 8px 40px var(--black-a3),
    0 12px 32px -16px var(--black-a5)`,
    5: `    0 0 0 1px var(--gray-a6),
    0 12px 60px var(--black-a5),
    0 12px 32px -16px var(--black-a7)`,
    6: `    0 0 0 1px var(--gray-a6),
    0 12px 60px var(--black-a4),
    0 16px 64px var(--black-a6),
    0 16px 36px -20px var(--black-a11)`,
  };

  return Object.entries(shadows)
    .map(([level, value]) => `  --shadow-${level}:\n${value};`)
    .join("\n\n");
}

// ============================================================================
// 집계 생성기들
// ============================================================================

/**
 * base.css 생성 (모든 primitive 토큰 CSS import)
 */
export async function generateBaseCSS(config) {
  await ensureDir(config.cssOutputDir);

  const imports = [
    "./colors/index.css",
    "./cursor/index.css",
    "./scaling/index.css",
    "./space/index.css",
    "./radius/index.css",
    "./shadow/index.css",
    "./typography/index.css",
  ];

  const css = imports.map((imp) => `@import '${imp}';`).join("\n") + "\n";
  writeFile(path.join(config.cssOutputDir, "base.css"), css);
}

/**
 * index.css 생성 (모든 CSS 파일 import)
 */
export async function generateIndexCSS(config) {
  await ensureDir(config.cssOutputDir);

  const colorRolesDir = path.join(config.cssOutputDir, "colors", "roles");
  const colorRoleImports = await getColorRoleImports(colorRolesDir);

  const imports = [...colorRoleImports, "./base.css", "../semantic.css"].filter(
    Boolean,
  );

  const css = imports.map((imp) => `@import '${imp}';`).join("\n") + "\n";
  writeFile(path.join(config.cssOutputDir, "index.css"), css);
}

/**
 * 색상 역할 import 문 가져오기
 */
async function getColorRoleImports(colorRolesDir) {
  try {
    const { readdir } = await import("fs/promises");
    const files = await readdir(colorRolesDir);
    return files
      .filter((f) => f.endsWith(".css"))
      .sort()
      .map((filename) => `./colors/roles/${filename}`);
  } catch {
    // 디렉토리가 아직 존재하지 않음 (color-roles-css.js에 의해 생성됨)
    return [];
  }
}
