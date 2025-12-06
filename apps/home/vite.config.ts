import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import tailwindcss from "@tailwindcss/vite";
import * as path from "node:path";
import pkg from "./package.json" with { type: "json" };

const REPO = "my-blog";
const isCI = process.env.CI === "true";

export default defineConfig({
  base: isCI ? `/${REPO}/` : "/",
  plugins: [
    react(),
    tailwindcss(),
    notifyOnRebuild({
      appName: "home",
      hostUrl: "http://localhost:3000",
      endpoint: "/__remote_rebuilt__",
      notifyOnSuccessOnly: true,
    }),
    federation({
      name: "home",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
      },
      shared: {
        react: { version: pkg.dependencies.react },
        "react-dom": { version: pkg.dependencies["react-dom"] },
        "react-router-dom": { version: pkg.dependencies["react-router-dom"] },
        "@tanstack/react-query": {
          version: pkg.dependencies["@tanstack/react-query"],
        },
        zustand: { version: pkg.dependencies.zustand },
        "@mfe/shared": { version: "0.0.0" },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: { port: 3004 },
  preview: {
    port: 3004,
    strictPort: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
