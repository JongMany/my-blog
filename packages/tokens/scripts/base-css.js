import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const rolesOutputDir = path.join(outputDir, "css");

function generateBaseCss() {
  return `
@import './colors/index.css';
@import './cursor/index.css';
@import './scaling/index.css';
@import './space/index.css';
@import './radius/index.css';
@import './shadow/index.css';
@import './typography/index.css';
`;
}

async function generateBaseCssFiles() {
  await mkdir(rolesOutputDir, { recursive: true });
  const css = generateBaseCss();

  const outFile = path.join(rolesOutputDir, `base.css`);
  await writeFileSync(outFile, css, "utf-8");
}
generateBaseCssFiles();
