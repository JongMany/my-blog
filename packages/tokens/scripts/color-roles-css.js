import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import colorScales from "../dist/colors.js";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8"),
);

const outputDir = tsconfig.compilerOptions.outDir;
const rolesOutputDir = path.join(outputDir, "css", "colors", "roles");

const supportsP3AtRule = "@supports (color: color(display-p3 1 1 1))";
const matchesP3MediaRule = "@media (color-gamut: p3)";

function toCssCasing(str) {
  return str
    .replace(/([a-z])(\d)/g, "$1-$2")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
}

// function getColorToken(colorObj, step) {
//   return Object.entries(colorObj).find(([key]) => key.endsWith(step))?.[0];
// }

function generateColorRolesCss(colorName, colorObj, colorP3Obj) {
  const dashedColor = toCssCasing(colorName);
  const dashedColorP3 = toCssCasing(colorName + "P3");

  const surfaceVar = `--${dashedColor}-1`;
  const indicatorVar = `--${dashedColor}-9`;
  const surfaceP3Var = colorP3Obj ? `--${dashedColorP3}-1` : surfaceVar; // fallback
  // color, color-dark, color-alpha, color-dark-alpha
  return `
@import '../tokens/${dashedColor}.css';
@import '../tokens/${dashedColor}-dark.css';
@import '../tokens/${dashedColor}-alpha.css';
@import '../tokens/${dashedColor}-dark-alpha.css';

:root {
  --${dashedColor}-contrast: white;
}

:root,
.light,
.light-theme {
  --${dashedColor}-surface: var(${surfaceVar});
  --${dashedColor}-indicator: var(${indicatorVar});
  --${dashedColor}-track: var(${indicatorVar});
  ${supportsP3AtRule} {
    ${matchesP3MediaRule} {
      --${dashedColor}-surface: var(${surfaceP3Var});
    }
  }
}

.dark,
.dark-theme {
  --${dashedColor}-surface: var(${surfaceVar});
  --${dashedColor}-indicator: var(${indicatorVar});
  --${dashedColor}-track: var(${indicatorVar});
  ${supportsP3AtRule} {
    ${matchesP3MediaRule} {
      --${dashedColor}-surface: var(${surfaceP3Var});
    }
  }
}
`.trim();
}

async function generateAllRoleCssFiles() {
  await mkdir(rolesOutputDir, { recursive: true });

  for (const key of Object.keys(colorScales)) {
    // 특정 키워드가 뒤에 있는 경우는 X
    if (key.endsWith("P3")) continue;
    if (key.endsWith("A")) continue;
    if (key.endsWith("P3A")) continue;
    if (key.endsWith("Dark")) continue;
    // Type-only exports (not actual color scales)
    if (key === "lightColors") continue;

    const baseColor = key;
    const p3Key = key + "P3";
    const colorObj = colorScales[baseColor];
    const colorP3Obj = colorScales[p3Key];

    const css = generateColorRolesCss(baseColor, colorObj, colorP3Obj);
    const outFile = path.join(rolesOutputDir, `${toCssCasing(baseColor)}.css`);
    await writeFileSync(outFile, css, "utf-8");
    console.log(`✅ Generated roles CSS for: ${baseColor}`);
  }
}

generateAllRoleCssFiles();
