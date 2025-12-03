import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    // 메인 진입점
    index: "src/index.ts",

    // Primitive tokens - 기존 CSS 스크립트 호환성을 위해 기존 경로 유지
    colors: "src/variables/colors/index.ts",
    scaling: "src/variables/scaling/index.ts",
    space: "src/variables/space/index.ts",
    radius: "src/variables/radius/index.ts",
    typography: "src/variables/typography/index.ts",

    // Semantic tokens
    "semantic/index": "src/variables/semantic/index.ts",

    // Component tokens
    "components/button": "src/variables/components/button.ts",

    // Presets
    "presets/index": "src/presets/index.ts",
    "presets/common": "src/presets/common.ts",

    // Utils
    "utils/index": "src/utils/index.ts",
    "utils/tokens": "src/utils/tokens.ts",
    "utils/theme": "src/utils/theme.ts",
    "utils/token-generator": "src/utils/token-generator.ts",

    // Types
    "types/tokens": "src/types/tokens.ts",
  },
  output: [
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].js",
      preserveModules: false,
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: true,
      declarationDir: "dist",
    }),
  ],
  external: [],
};
