import typescript from "@rollup/plugin-typescript";

export default {
  input: {
    colors: "src/variables/colors/index.ts",
    scaling: "src/variables/scaling/index.ts",
    space: "src/variables/space/index.ts",
    radius: "src/variables/radius/index.ts",
    typography: "src/variables/typography/index.ts",
  },
  output: [
    {
      dir: "dist",
      format: "esm",
      entryFileNames: "[name].js", // colors → colors.js
    },
  ],
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
    }),
  ],
};
