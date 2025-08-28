import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import tailwindcss from "@tailwindcss/vite";

// const USER = "JongMany";
const REPO = "my-blog";
const isCI = process.env.CI === "true";

export default defineConfig({
  base: isCI ? `/${REPO}/resume/` : "/",
  plugins: [
    react(),
    federation({
      name: "resume",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/App.tsx",
        "./routes": "./src/routes.tsx",
      },
      // shared: [
      //   "react",
      //   "react-dom",
      //   "react-router-dom",
      //   "@tanstack/react-query",
      //   "zustand",
      //   "@mfe/shared",
      // ],
      shared: {
        react: { version: "19.1.1" },
        "react-dom": { version: "19.1.1" },
        "react-router-dom": { version: "7.8.1" },
        "@tanstack/react-query": { version: "5.85.3" },
        zustand: { version: "5.0.7" },
        "@mfe/shared": { version: "0.0.0" },
      },
    }),
    notifyOnRebuild({
      appName: "resume",
      hostUrl: "http://localhost:5173",
      endpoint: "/__remote_rebuilt__",
      notifyOnSuccessOnly: true,
    }),
    tailwindcss(),
  ],
  server: { port: 3003 },
  preview: {
    port: 3003,
    strictPort: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  build: { target: "esnext", minify: false },
});
