import typography from "../dist/typography.js";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const typographyOutputDir = path.join(outputDir, "css", "typography");

const generateTypographyCSS = (typography) => {
  const lines = [];

  const scaled = (key, val, prefix) =>
    `  --${prefix}-${key}: calc(${val}px * var(--scaling));`;

  const direct = (key, val, prefix) => `  --${prefix}-${key}: ${val};`;

  const emUnit = (key, val, prefix) => `  --${prefix}-${key}: ${val}em;`;

  for (const [group, values] of Object.entries(typography)) {
    const prefix = group.replace(/([A-Z])/g, "-$1").toLowerCase(); // e.g., headingLineHeight → heading-line-height

    for (const [key, val] of Object.entries(values)) {
      switch (group) {
        case "fontSize":
        case "lineHeight":
        case "headingLineHeight":
          lines.push(scaled(key, val, prefix));
          break;
        case "fontWeight":
          lines.push(direct(key, val, prefix));
          break;
        case "letterSpacing":
          lines.push(emUnit(key, val, prefix));
          break;
      }
    }
  }

  const rules = lines.join("\n");

  return `
.jds-themes {
  ${rules}
    
/* default values */
--default-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI (Custom)', Roboto,
  'Helvetica Neue', 'Open Sans (Custom)', system-ui, sans-serif, 'Apple Color Emoji',
  'Segoe UI Emoji';
--default-font-size: var(--font-size-3); 
--default-font-style: normal;
--default-font-weight: var(--font-weight-regular);
--default-line-height: 1.5; 
--default-letter-spacing: 0em;
--default-leading-trim-start: 0.42em;
--default-leading-trim-end: 0.36em;

/* Code */
--code-font-family: 'Menlo', 'Consolas (Custom)', 'Bitstream Vera Sans Mono', monospace,
  'Apple Color Emoji', 'Segoe UI Emoji';
--code-font-size-adjust: 0.95;
--code-font-style: normal;
--code-font-weight: inherit;
--code-letter-spacing: -0.007em;
--code-padding-top: 0.1em;
--code-padding-bottom: 0.1em;
--code-padding-left: 0.25em;
--code-padding-right: 0.25em;

/* Strong */

--strong-font-family: var(--default-font-family);
--strong-font-size-adjust: 1;
--strong-font-style: inherit;
--strong-font-weight: var(--font-weight-bold);
--strong-letter-spacing: 0em;

/* Em */

--em-font-family: 'Times New Roman', 'Times', serif;
--em-font-size-adjust: 1.18;
--em-font-style: italic;
--em-font-weight: inherit;
--em-letter-spacing: -0.025em;

/* Quote */

--quote-font-family: 'Times New Roman', 'Times', serif;
--quote-font-size-adjust: 1.18;
--quote-font-style: italic;
--quote-font-weight: inherit;
--quote-letter-spacing: -0.025em;

/* Tabs */

--tab-active-letter-spacing: -0.01em;
--tab-active-word-spacing: 0em;
--tab-inactive-letter-spacing: 0em;
--tab-inactive-word-spacing: 0em;
}

.jds-themes {
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
}
`;
};

const generateTypographyCSSFile = async () => {
  await mkdir(typographyOutputDir, { recursive: true });
  const css = generateTypographyCSS(typography);

  const outFile = path.join(typographyOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
};

generateTypographyCSSFile();
