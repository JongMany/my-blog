import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import tailwindcss from "@tailwindcss/vite";
import pkg from "./package.json" assert { type: "json" };

const REPO = "my-blog";
const isCI = process.env.CI === "true";

export default defineConfig({
  base: isCI ? `/${REPO}/portfolio/` : "/",
  publicDir: "public",
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "portfolio",
      filename: "remoteEntry.js",
      exposes: { "./routes": "./src/routes.tsx", "./App": "./src/App.tsx" },
      shared: {
        react: { version: pkg.dependencies.react },
        "react-dom": { version: pkg.dependencies["react-dom"] },
        "react-router-dom": { version: pkg.dependencies["react-router-dom"] },
        "@tanstack/react-query": {
          version: pkg.dependencies["@tanstack/react-query"],
        },
        "@mfe/shared": { version: "0.0.0" },
      },
    }),
    notifyOnRebuild({
      appName: "portfolio",
      hostUrl: "http://localhost:3000",
      endpoint: "/__remote_rebuilt__",
      notifyOnSuccessOnly: true,
    }),
  ],
  server: { port: 3002 },
  preview: {
    port: 3002,
    strictPort: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
