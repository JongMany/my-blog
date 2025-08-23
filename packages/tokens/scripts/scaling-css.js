import scaling from "../dist/scaling.js";
import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const scalingOutputDir = path.join(outputDir, "css", "scaling");

const generateScalingCSS = (map) => {
  const rules = Object.entries(map)
    .map(
      ([key, value]) =>
        `  &:where([data-scaling='${key}']) {\n    --scaling: ${value};\n  }`
    )
    .join("\n");

  return `.jds-themes {\n${rules}\n}`;
};

const generateScalingCSSFile = async () => {
  await mkdir(scalingOutputDir, { recursive: true });
  const css = generateScalingCSS(scaling.scalingMap);

  const outFile = path.join(scalingOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
};

generateScalingCSSFile();
