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
  const lines = [`[data-radius] {`];

  for (const [key, px] of Object.entries(values)) {
    lines.push(
      `  --radius-${key}: calc(${px}px * var(--scaling) * var(--radius-factor));`
    );
  }

  lines.push(`}`);

  let css = lines.join("\n");

  css += `  
[data-radius='none'] {
  --radius-factor: 0;
  --radius-full: 0px;
  --radius-thumb: 0.5px;
}

[data-radius='small'] {
  --radius-factor: 0.75;
  --radius-full: 0px;
  --radius-thumb: 0.5px;
}

[data-radius='medium'] {
  --radius-factor: 1;
  --radius-full: 0px;
  --radius-thumb: 9999px;
}

[data-radius='large'] {
  --radius-factor: 1.5;
  --radius-full: 0px;
  --radius-thumb: 9999px;
}

[data-radius='full'] {
  --radius-factor: 1.5;
  --radius-full: 9999px;
  --radius-thumb: 9999px;
}
`;

  return css;
};

const generateRadiusCSSFile = async () => {
  await mkdir(radiusOutputDir, { recursive: true });
  const css = generateRadiusCSS(radius.radiusBaseValues);

  const outFile = path.join(radiusOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
};

generateRadiusCSSFile();
