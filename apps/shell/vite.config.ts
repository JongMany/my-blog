import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { listenForRemoteRebuilds } from "@antdevx/vite-plugin-hmr-sync";
import tailwindcss from "@tailwindcss/vite";

import pkg from "./package.json" assert { type: "json" };

// const USER = "JongMany";
// const REPO = "my-blog";
// const isCI = process.env.CI === "true";

// const remotes = isCI
//   ? {
//       blog: `https://${USER}.github.io/${REPO}/blog/remoteEntry.js`,
//       portfolio: `https://${USER}.github.io/${REPO}/portfolio/remoteEntry.js`,
//       resume: `https://${USER}.github.io/${REPO}/resume/remoteEntry.js`,
//     }
//   : {
//       blog: "http://localhost:3001/assets/remoteEntry.js",
//       portfolio: "http://localhost:3002/assets/remoteEntry.js",
//       resume: "http://localhost:3003/assets/remoteEntry.js",
//     };

const isCI = process.env.CI === "true";
const REPO = "my-blog";
const isDev = process.env.NODE_ENV !== "production" && !process.env.CI;

// GH Actions에서 주입할 값(없으면 빈 문자열)
const buildId = process.env.VITE_BUILD_ID ?? "";
const q = buildId ? `?v=${buildId}` : "";

const remotes = isDev
  ? {
      // ✅ dev는 각 포트의 /assets/remoteEntry.js
      blog: "http://localhost:3001/assets/remoteEntry.js",
      portfolio: "http://localhost:3002/assets/remoteEntry.js",
      resume: "http://localhost:3003/assets/remoteEntry.js",
    }
  : {
      // ✅ 배포/프리뷰는 루트-상대 경로(오리진 자동)
      blog: `/my-blog/blog/assets/remoteEntry.js${q}`,
      portfolio: `/my-blog/portfolio/assets/remoteEntry.js${q}`,
      resume: `/my-blog/resume/assets/remoteEntry.js${q}`,
    };

// https://vite.dev/config/
export default defineConfig({
  base: isCI ? `/${REPO}/` : "/",
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "shell",
      remotes: remotes,
      // shared: [
      //   "react",
      //   "react-dom",
      //   "react-router-dom",
      //   "@tanstack/react-query",
      //   "zustand",
      //   "@mfe/shared",
      // ],
      shared: {
        react: { version: pkg.dependencies.react },
        "react-dom": { version: pkg.dependencies["react-dom"] },
        "react-router-dom": { version: pkg.dependencies["react-router-dom"] },
        "@tanstack/react-query": {
          version: pkg.dependencies["@tanstack/react-query"],
        },
        "@tanstack/react-form": {
          version: pkg.dependencies["@tanstack/react-form"],
        },
        zustand: { version: pkg.dependencies.zustand },
        "@mfe/shared": { version: "0.0.0" },
      },
    }),
    listenForRemoteRebuilds({
      allowedApps: ["blog", "portfolio", "resume"],
      endpoint: "/__remote_rebuilt__",
      hotPayload: { type: "full-reload", path: "*" },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    minify: false,
    modulePreload: false,
    cssCodeSplit: true,
  },
});
