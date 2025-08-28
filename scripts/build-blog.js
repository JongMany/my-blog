import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { execSync } from "node:child_process";

const root = path.resolve(process.cwd());
const SRC = path.join(root, "apps/blog/content/blog");
const OUT = path.join(root, "apps/blog/public/_blog");
const POSTS_DIR = path.join(OUT, "posts");
const ASSETS_DIR = path.join(OUT, "assets");

// 유틸
function cleanDir(p) {
  fs.rmSync(p, { recursive: true, force: true });
  fs.mkdirSync(p, { recursive: true });
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function isMdx(f) {
  return /\.mdx?$/i.test(f);
}

// git 최초 커밋일(작성일)과 마지막 커밋일(수정일) 가져오기 (없으면 파일 mtime fallback)
function gitDate(kind, fileAbs) {
  try {
    const rel = path.relative(root, fileAbs);
    const fmt =
      kind === "created"
        ? "git log --diff-filter=A --follow --format=%aI -1 -- "
        : "git log --follow --format=%aI -1 -- ";
    const out = execSync(fmt + JSON.stringify(rel), {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return out || null;
  } catch {
    return null;
  }
}

// 커버/이미지 복사 (상대경로만, 같은 폴더 기준)
function copyAssetNearby(postAbs, rel) {
  const src = path.resolve(path.dirname(postAbs), rel);
  if (!fs.existsSync(src)) return null;
  ensureDir(ASSETS_DIR);
  const base = `${Date.now()}_${path.basename(src)}`; // 이름 충돌 피하기
  const dest = path.join(ASSETS_DIR, base);
  fs.copyFileSync(src, dest);
  return `/_blog/assets/${base}`; // public 기준 경로
}

cleanDir(OUT);
ensureDir(POSTS_DIR);

const categories = {};
const allPosts = [];

for (const cat of fs.readdirSync(SRC)) {
  const catDir = path.join(SRC, cat);
  if (!fs.statSync(catDir).isDirectory()) continue;

  const files = fs.readdirSync(catDir).filter(isMdx);

  for (const file of files) {
    const abs = path.join(catDir, file);
    const raw = fs.readFileSync(abs, "utf8");
    const { data, content } = matter(raw);

    const slug = (data.slug || file.replace(/\.mdx?$/i, "")).toLowerCase();
    const created =
      data.date ||
      gitDate("created", abs) ||
      new Date(fs.statSync(abs).ctimeMs).toISOString();
    const updated =
      data.updatedAt ||
      gitDate("updated", abs) ||
      new Date(fs.statSync(abs).mtimeMs).toISOString();

    // 커버 복사(옵션)
    let coverUrl = null;
    if (data.cover) coverUrl = copyAssetNearby(abs, data.cover);

    // 원문 MDX 복사 (런타임에서 @mdx-js/runtime 으로 렌더)
    const outName = `${cat}__${slug}.mdx`;
    fs.writeFileSync(path.join(POSTS_DIR, outName), raw, "utf8");

    const meta = {
      category: cat,
      title: data.title || slug,
      slug,
      date: created, // 정렬용
      updatedAt: updated, // 표기용
      tags: data.tags || [],
      summary: data.summary || "",
      cover: coverUrl, // null 또는 "/_blog/assets/xxxx.png"
      path: `/_blog/posts/${outName}`, // MDX 원문 경로(펫치해서 런타임 렌더)
    };

    (categories[cat] ||= []).push(meta);
    allPosts.push(meta);
  }
}

// 정렬: 작성일 내림차순 (updatedAt은 표시에만 사용)
const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));
for (const c of Object.keys(categories)) categories[c].sort(byDateDesc);
allPosts.sort(byDateDesc);

// 인덱스 JSON
const index = {
  categories: Object.keys(categories).sort(),
  byCategory: categories,
  all: allPosts,
};

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));
console.log(
  `[blog] built: ${allPosts.length} posts in ${Object.keys(categories).length} categories -> apps/blog/public/_blog`
);
