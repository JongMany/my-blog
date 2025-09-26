import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import * as path from "node:path";
import pkg from "./package.json" assert { type: "json" };

const REPO = "my-blog";
const isCI = process.env.CI === "true";
const BASE = isCI ? `/${REPO}/blog/` : "/";

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    mdx({ remarkPlugins: [remarkGfm] }),
    notifyOnRebuild({
      appName: "blog",
      hostUrl: "http://localhost:3000",
      endpoint: "/__remote_rebuilt__",
      notifyOnSuccessOnly: true,
    }),
    federation({
      name: "blog",
      filename: "remoteEntry.js",
      exposes: {
        "./BlogApp": "./src/App.tsx",
        // "./routes": "./src/routes.tsx",
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
  server: { port: 3001, fs: { allow: [path.resolve(__dirname, ".")] } },
  preview: {
    port: 3001,
    strictPort: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
