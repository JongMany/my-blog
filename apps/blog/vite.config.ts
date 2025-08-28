import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import { notifyOnRebuild } from "@antdevx/vite-plugin-hmr-sync";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@mdx-js/rollup";
import remarkGfm from "remark-gfm";
import * as fs from "node:fs";
import * as path from "node:path";
import fg from "fast-glob";
import matter from "gray-matter";
import { viteStaticCopy } from "vite-plugin-static-copy";

import type { Plugin, ViteDevServer } from "vite";
import type { IncomingMessage, ServerResponse } from "node:http";
// const USER = "JongMany";
const REPO = "my-blog";
const isCI = process.env.CI === "true";
const BASE = isCI ? `/${REPO}/blog/` : "/";

const CONTENT_DIR = path.resolve(__dirname, "content/blog");

export default defineConfig({
  base: BASE,
  plugins: [
    react(),
    tailwindcss(),
    mdx({ remarkPlugins: [remarkGfm] }),
    // ⬇️ dev에서 content/blog → /_blog/** 로 서빙
    blogContentDev(),

    // ⬇️ build에서 content/blog → dist/_blog/** 로 복사
    viteStaticCopy({
      targets: [{ src: "content/blog/**/*", dest: "_blog" }],
    }),
    blogIndexBuild(),
    notifyOnRebuild({
      appName: "blog",
      hostUrl: "http://localhost:5173",
      endpoint: "/__remote_rebuilt__",
      notifyOnSuccessOnly: true,
    }),
    federation({
      name: "blog",
      filename: "remoteEntry.js",
      exposes: {
        "./BlogApp": "./src/App.tsx",
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
  ],
  server: { port: 3001, fs: { allow: [path.resolve(__dirname, ".")] } },
  build: {
    // modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});

async function buildIndexJSON(): Plugin {
  const files = await fg("**/*.{md,mdx}", { cwd: CONTENT_DIR, dot: false });
  const items = files.map((rel) => {
    const full = path.join(CONTENT_DIR, rel);
    const raw = fs.readFileSync(full, "utf-8");
    const { data } = matter(raw);

    const { name: filename, dir } = path.parse(rel);
    const category = (dir.split(path.sep)[0] || "uncategorized").trim();
    const slug = filename;
    const stat = fs.statSync(full);

    // path는 "BASE_URL + path"로 접근하도록 상대값 `_blog/...`
    const postPath = `_blog/${rel.replace(/\\/g, "/")}`;

    return {
      title: data.title ?? slug,
      summary: data.summary ?? "",
      category,
      slug,
      date: data.date ?? stat.birthtime.toISOString(),
      updatedAt: stat.mtime.toISOString(),
      cover: data.cover
        ? `_blog/${dir.replace(/\\/g, "/")}/${data.cover}`
        : null,
      path: postPath, // MDX 원문을 fetch할 때 사용
    };
  });

  // 원하는 정렬 규칙(예: 작성일 내림차순)
  items.sort((a, b) => (a.date < b.date ? 1 : -1));

  // byCategory 도 같이 구성
  const byCategory = items.reduce<Record<string, typeof items>>((acc, it) => {
    (acc[it.category] ??= []).push(it);
    return acc;
  }, {});

  return { all: items, byCategory };
}

// DEV 전용: /_blog/** 서빙 + /_blog/index.json 즉석 생성
function blogContentDev(): Plugin {
  return {
    name: "blog-content-dev",
    apply: "serve" as const,
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next();

        // index.json 생성해서 제공
        if (
          req.url === "/_blog/index.json" ||
          req.url.startsWith(`${BASE}_blog/index.json`)
        ) {
          const json = await buildIndexJSON();
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(json));
          return;
        }

        // 실제 MDX/이미지 파일 제공
        const m = req.url.match(/\/_blog\/(.+)$/);
        if (m) {
          const rel = decodeURIComponent(m[1]);
          const file = path.join(CONTENT_DIR, rel);
          if (fs.existsSync(file) && fs.statSync(file).isFile()) {
            // 간단한 Content-Type 처리 (필요시 확장)
            if (/\.(md|mdx)$/i.test(file)) {
              res.setHeader("Content-Type", "text/markdown; charset=utf-8");
            }
            fs.createReadStream(file).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

// BUILD: 정적 복사 + index.json 파일 생성
function blogIndexBuild(): Plugin {
  return {
    name: "blog-index-build",
    apply: "build" as const,
    closeBundle: async () => {
      const outDir = path.resolve(__dirname, "dist/_blog");
      fs.mkdirSync(outDir, { recursive: true });
      const json = await buildIndexJSON();
      fs.writeFileSync(
        path.join(outDir, "index.json"),
        JSON.stringify(json, null, 2)
      );
    },
  };
}
