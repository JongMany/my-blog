import radius from "../dist/radius.js";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const radiusOutputDir = path.join(outputDir, "css", "radius");

const generateRadiusCSS = (values) => {
  const lines = [`:root {`];

  for (const [key, px] of Object.entries(values)) {
    lines.push(`  --radius-${key}: ${px}px;`);
  }

  // Semantic radius aliases
  lines.push(`  /* Semantic radius aliases */`);
  lines.push(`  --radius-sm: 4px;`);
  lines.push(`  --radius-md: 6px;`);
  lines.push(`  --radius-lg: 8px;`);
  lines.push(`  --radius-xl: 12px;`);

  lines.push(`}`);

  return lines.join("\n");
};

const generateRadiusCSSFile = async () => {
  await mkdir(radiusOutputDir, { recursive: true });
  const css = generateRadiusCSS(radius.radiusBaseValues);

  const outFile = path.join(radiusOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
};

generateRadiusCSSFile();
