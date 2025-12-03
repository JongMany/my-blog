import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";

import path from "path";
import colorScales from "../dist/colors.js";
import { mkdir } from "fs/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);
const outputDir = tsconfig.compilerOptions.outDir;

const supportsP3AtRule = "@supports (color: color(display-p3 1 1 1))";
const matchesP3MediaRule = "@media (color-gamut: p3)";

async function generateColorCss() {
  const folderPath = path.join(outputDir, "css", "colors", "tokens");

  await mkdir(folderPath, { recursive: true });

  Object.keys(colorScales)
    .filter((key) => !key.includes("P3"))
    .forEach((key) => {
      let selector = ":root, .light, .light-theme";

      if (key === "blackA" || key === "whiteA") {
        selector = ":root";
      }

      if (key.includes("Dark")) {
        selector = ".dark, .dark-theme";
      }

      const srgbValues = Object.entries(colorScales).find(
        ([name]) => name === key
      )[1];

      const srgbCssProperties = Object.entries(srgbValues)
        .map(([name, value]) => [toCssCasing(name), value])
        .map(([name, value]) => `  --${name}: ${value};`)
        .join("\n");

      const srgbCssRule = `${selector} {\n${srgbCssProperties}\n}`;

      const p3Values = Object.entries(colorScales).find(
        ([name]) => name === key + "P3" || name === key.replace(/.$/, "P3A")
      )?.[1];

      let finalCss = srgbCssRule;

      // Only generate P3 CSS if P3 values exist
      if (p3Values && typeof p3Values === "object") {
        const p3CssProperties = Object.entries(p3Values)
          .map(([name, value]) => [toCssCasing(name), value])
          .map(([name, value]) => `      --${name}: ${value};`)
          .join("\n");

        let p3CssRule = `    ${selector} {\n${p3CssProperties}\n    }`;
        p3CssRule = `  ${matchesP3MediaRule} {\n${p3CssRule}\n  }`;
        p3CssRule = `${supportsP3AtRule} {\n${p3CssRule}\n}`;

        finalCss = `${srgbCssRule}\n\n${p3CssRule}`;
      }

      writeFileSync(
        path.join(folderPath, toFileName(key) + ".css"),
        finalCss
      );
    });
}

function toCssCasing(str) {
  return str
    .replace(/([a-z])(\d)/, "$1-$2")
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase();
}

function toFileName(str) {
  return toCssCasing(str).replace(/-a$/, "-alpha");
}

generateColorCss().then(() => {
  console.log("✅ Color CSS 파일 생성");
});
