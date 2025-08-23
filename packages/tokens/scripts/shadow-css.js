import { mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync, writeFileSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tsconfig = JSON.parse(
  readFileSync(path.join(__dirname, "../tsconfig.json"), "utf-8")
);

const outputDir = tsconfig.compilerOptions.outDir;
const shadowOutputDir = path.join(outputDir, "css", "shadow");

const generateShadowCSS = () => {
  return `
/* prettier-ignore */
:where(.jds-themes) {
  --shadow-1:
    inset 0 0 0 1px var(--gray-a5),
    inset 0 1.5px 2px 0 var(--gray-a2),
    inset 0 1.5px 2px 0 var(--black-a2);

  --shadow-2:
    0 0 0 1px var(--gray-a3),
    0 0 0 0.5px var(--black-a1),
    0 1px 1px 0 var(--gray-a2),
    0 2px 1px -1px var(--black-a1),
    0 1px 3px 0 var(--black-a1);

  --shadow-3:
    0 0 0 1px var(--gray-a3),
    0 2px 3px -2px var(--gray-a3),
    0 3px 12px -4px var(--black-a2),
    0 4px 16px -8px var(--black-a2);

  --shadow-4:
    0 0 0 1px var(--gray-a3),
    0 8px 40px var(--black-a1),
    0 12px 32px -16px var(--gray-a3);

  --shadow-5:
    0 0 0 1px var(--gray-a3),
    0 12px 60px var(--black-a3),
    0 12px 32px -16px var(--gray-a5);

  --shadow-6:
    0 0 0 1px var(--gray-a3),
    0 12px 60px var(--black-a3),
    0 16px 64px var(--gray-a2),
    0 16px 36px -20px var(--gray-a7);
}

/* prettier-ignore */
@supports (color: color-mix(in oklab, white, black)) {
  :where(.jds-themes) {
    --shadow-1:
      inset 0 0 0 1px var(--gray-a5),
      inset 0 1.5px 2px 0 var(--gray-a2),
      inset 0 1.5px 2px 0 var(--black-a2);

    --shadow-2:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 0 0 0.5px var(--black-a1),
      0 1px 1px 0 var(--gray-a2),
      0 2px 1px -1px var(--black-a1),
      0 1px 3px 0 var(--black-a1);

    --shadow-3:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 2px 3px -2px var(--gray-a3),
      0 3px 12px -4px var(--black-a2),
      0 4px 16px -8px var(--black-a2);

    --shadow-4:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 8px 40px var(--black-a1),
      0 12px 32px -16px var(--gray-a3);

    --shadow-5:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 12px 60px var(--black-a3),
      0 12px 32px -16px var(--gray-a5);

    --shadow-6:
      0 0 0 1px color-mix(in oklab, var(--gray-a3), var(--gray-3) 25%),
      0 12px 60px var(--black-a3),
      0 16px 64px var(--gray-a2),
      0 16px 36px -20px var(--gray-a7);
  }
}

/* prettier-ignore */
:is(.dark, .dark-theme),
:is(.dark, .dark-theme) :where(.jds-themes:not(.light, .light-theme)) {
  --shadow-1:
    inset 0 -1px 1px 0 var(--gray-a3),
    inset 0 0 0 1px var(--gray-a3),
    inset 0 3px 4px 0 var(--black-a5),
    inset 0 0 0 1px var(--gray-a4);

  --shadow-2:
    0 0 0 1px var(--gray-a6),
    0 0 0 0.5px var(--black-a3),
    0 1px 1px 0 var(--black-a6),
    0 2px 1px -1px var(--black-a6),
    0 1px 3px 0 var(--black-a5);

  --shadow-3:
    0 0 0 1px var(--gray-a6),
    0 2px 3px -2px var(--black-a3),
    0 3px 8px -2px var(--black-a6),
    0 4px 12px -4px var(--black-a7);

  --shadow-4:
    0 0 0 1px var(--gray-a6),
    0 8px 40px var(--black-a3),
    0 12px 32px -16px var(--black-a5);

  --shadow-5:
    0 0 0 1px var(--gray-a6),
    0 12px 60px var(--black-a5),
    0 12px 32px -16px var(--black-a7);

  --shadow-6:
    0 0 0 1px var(--gray-a6),
    0 12px 60px var(--black-a4),
    0 16px 64px var(--black-a6),
    0 16px 36px -20px var(--black-a11);
}

/* prettier-ignore */
@supports (color: color-mix(in oklab, white, black)) {
  :is(.dark, .dark-theme),
  :is(.dark, .dark-theme) :where(.jds-themes:not(.light, .light-theme)) {
    --shadow-1:
      inset 0 -1px 1px 0 var(--gray-a3),
      inset 0 0 0 1px var(--gray-a3),
      inset 0 3px 4px 0 var(--black-a5),
      inset 0 0 0 1px var(--gray-a4);

    --shadow-2:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 0 0 0.5px var(--black-a3),
      0 1px 1px 0 var(--black-a6),
      0 2px 1px -1px var(--black-a6),
      0 1px 3px 0 var(--black-a5);

    --shadow-3:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 2px 3px -2px var(--black-a3),
      0 3px 8px -2px var(--black-a6),
      0 4px 12px -4px var(--black-a7);

    --shadow-4:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 8px 40px var(--black-a3),
      0 12px 32px -16px var(--black-a5);

    --shadow-5:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 12px 60px var(--black-a5),
      0 12px 32px -16px var(--black-a7);

    --shadow-6:
      0 0 0 1px color-mix(in oklab, var(--gray-a6), var(--gray-6) 25%),
      0 12px 60px var(--black-a4),
      0 16px 64px var(--black-a6),
      0 16px 36px -20px var(--black-a11);
  }
}
`;
};

const generateShadowCSSFile = async () => {
  await mkdir(shadowOutputDir, { recursive: true });
  const css = generateShadowCSS();

  const outFile = path.join(shadowOutputDir, `index.css`);
  await writeFileSync(outFile, css, "utf-8");
};

generateShadowCSSFile();
