import { defineConfig, type Plugin, type ViteDevServer } from "vite";
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

import chardet from "chardet";
import iconv from "iconv-lite";
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
    blogContentBuild(),
    // ⬇️ build에서 content/blog → dist/_blog/** 로 복사
    viteStaticCopy({
      targets: [{ src: "content/blog/**/*", dest: "_blog" }],
    }),
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

// 공통: index.json 만들기 (변경 없음)
async function buildIndexJSON() {
  const files = await fg("**/*.{md,mdx}", { cwd: CONTENT_DIR, dot: false });
  const items = files.map((rel) => {
    const full = path.join(CONTENT_DIR, rel);
    const raw = fs.readFileSync(full); // ← 바이트로 읽음
    const enc = chardet.detect(raw) || "UTF-8"; // ← 감지
    let text = iconv.decode(raw, enc); // ← UTF-8 문자열
    if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 제거
    const { data } = matter(text);

    const { name: filename, dir } = path.parse(rel);
    const category = (dir.split(path.sep)[0] || "uncategorized").trim();
    const slug = filename;
    const stat = fs.statSync(full);

    return {
      title: data.title ?? slug,
      summary: data.summary ?? "",
      category,
      slug,
      date: data.date ?? stat.birthtime.toISOString(),
      updatedAt: data.updatedAt ?? stat.mtime.toISOString(),
      cover: data.cover ?? null,
      path: `/_blog/${rel.replace(/\\/g, "/")}`, // 원문 md 경로
    };
  });

  items.sort((a, b) => (a.date < b.date ? 1 : -1));
  const byCategory = items.reduce<Record<string, typeof items>>((acc, it) => {
    (acc[it.category] ??= []).push(it);
    return acc;
  }, {});
  const categories = Object.keys(byCategory).sort();

  return { all: items, byCategory, categories };
}

// ⬇️ DEV: UTF-8로 변환해 서빙
function blogContentDev(): Plugin {
  return {
    name: "blog-content-dev",
    apply: "serve",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(
        async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
          const url = req.url || "";
          // index.json 즉석 생성
          if (
            url === "/_blog/index.json" ||
            url === `${BASE}_blog/index.json`
          ) {
            const json = await buildIndexJSON();
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.end(JSON.stringify(json));
            return;
          }

          // 원문/에셋 서빙
          const m = url.match(/^\/_blog\/(.+)$/);
          if (m) {
            const rel = decodeURIComponent(m[1]);
            const file = path.join(CONTENT_DIR, rel);
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
              // 마크다운은 인코딩 감지 → UTF-8로 변환해서 보냄
              if (/\.(md|mdx)$/i.test(file)) {
                const buf = fs.readFileSync(file);
                const enc = chardet.detect(buf) || "UTF-8";
                let text = iconv.decode(buf, enc);
                if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 제거
                res.setHeader("Content-Type", "text/markdown; charset=utf-8");
                res.end(text, "utf8");
                return;
              }
              // 그 외는 스트리밍
              fs.createReadStream(file).pipe(res);
              return;
            }
          }
          next();
        },
      );
    },
  };
}

// ⬇️ BUILD: md/mdx는 UTF-8로 재저장, 나머진 그대로 복사
function blogContentBuild(): Plugin {
  return {
    name: "blog-content-build",
    apply: "build",
    closeBundle: async () => {
      const out = path.resolve(__dirname, "dist/_blog");
      fs.mkdirSync(out, { recursive: true });

      const files = await fg("**/*", { cwd: CONTENT_DIR, dot: false });
      for (const rel of files) {
        const src = path.join(CONTENT_DIR, rel);
        const dst = path.join(out, rel);
        fs.mkdirSync(path.dirname(dst), { recursive: true });

        if (/\.(md|mdx)$/i.test(rel)) {
          const buf = fs.readFileSync(src);
          const enc = chardet.detect(buf) || "UTF-8";
          let text = iconv.decode(buf, enc);
          if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM 제거
          fs.writeFileSync(dst, text, "utf8"); // ← 항상 UTF-8로 저장
        } else {
          fs.copyFileSync(src, dst);
        }
      }

      const json = await buildIndexJSON();
      fs.writeFileSync(
        path.join(out, "index.json"),
        JSON.stringify(json, null, 2),
        "utf8",
      );
    },
  };
}
