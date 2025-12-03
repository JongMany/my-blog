import space from "../dist/space.js";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const spaceOutputDir = path.join(outputDir, "css", "space");

const generateSpaceCSS = (map) => {
  const rules = Object.entries(map)
    .map(([key, px]) => `  --space-${key}: ${px}px;`)
    .join("\n");

  return `:root {\n${rules}\n}`;
};

const generateSpaceCSSFile = async () => {
  await mkdir(spaceOutputDir, { recursive: true });
  const css = generateSpaceCSS(space.spaceBaseValues);

  const outFile = path.join(spaceOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
};

generateSpaceCSSFile();
