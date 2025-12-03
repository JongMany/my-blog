import { mkdir, readdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const cssOutputDir = path.join(outputDir, "css");

async function generateIndexCss() {
  const colorRoleFiles = await readdir(
    path.join(cssOutputDir, "colors", "roles")
  );

  let css = ``;
  colorRoleFiles.forEach((filename) => {
    css += `@import './colors/roles/${filename}'; \n`;
  });
  css += `@import './base.css';\n`;
  // Semantic tokens (spacing-component-*, radius-component-*, etc.)
  css += `@import '../semantic.css';\n`;
  return css;
}

async function generateIndexCssFiles() {
  await mkdir(cssOutputDir, { recursive: true });
  const css = await generateIndexCss();

  const outFile = path.join(cssOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
}
generateIndexCssFiles();
