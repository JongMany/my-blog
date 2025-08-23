import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const cursorOutputDir = path.join(outputDir, "css", "cursor");

function generateCursorCss() {
  return `
.jds-themes {
  --cursor-button: default;
  --cursor-checkbox: default;
  --cursor-disabled: not-allowed;
  --cursor-link: pointer;
  --cursor-menu-item: default;
  --cursor-radio: default;
  --cursor-slider-thumb: default;
  --cursor-slider-thumb-active: default;
  --cursor-switch: default;
}`;
}

async function generateCursorCssFiles() {
  await mkdir(cursorOutputDir, { recursive: true });
  const css = generateCursorCss();

  const outFile = path.join(cursorOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
}
generateCursorCssFiles();
