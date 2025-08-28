// scripts/build-blog.cjs
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { execSync } = require("node:child_process");
const chardet = require("chardet");
const iconv = require("iconv-lite");

const root = path.resolve(process.cwd());
const SRC = path.join(root, "apps/blog/content/blog");
const OUT = path.join(root, "apps/blog/public/_blog");
const POSTS_DIR = path.join(OUT, "posts");
const ASSETS_DIR = path.join(OUT, "assets");

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

function readTextSmart(abs) {
  const buf = fs.readFileSync(abs);
  // UTF-8 가능하면 그대로, 아니면 감지 후 iconv 디코드
  const enc = chardet.detect(buf) || "UTF-8";
  try {
    return iconv.decode(buf, enc);
  } catch {
    // 최후 보루
    return buf.toString("utf8");
  }
}

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

function copyAssetNearby(postAbs, rel) {
  const src = path.resolve(path.dirname(postAbs), rel);
  if (!fs.existsSync(src)) return null;
  ensureDir(ASSETS_DIR);
  const base = `${Date.now()}_${path.basename(src)}`;
  const dest = path.join(ASSETS_DIR, base);
  fs.copyFileSync(src, dest);
  return `/_blog/assets/${base}`;
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
    const raw = readTextSmart(abs); // ← 여기서 인코딩 방어
    const { data } = matter(raw);

    const slug = (data.slug || file.replace(/\.mdx?$/i, "")).toLowerCase();
    const created =
      data.date ||
      gitDate("created", abs) ||
      new Date(fs.statSync(abs).ctimeMs).toISOString();
    const updated =
      data.updatedAt ||
      gitDate("updated", abs) ||
      new Date(fs.statSync(abs).mtimeMs).toISOString();

    let coverUrl = null;
    if (data.cover) coverUrl = copyAssetNearby(abs, data.cover);

    const outName = `${cat}__${slug}.mdx`;
    fs.writeFileSync(path.join(POSTS_DIR, outName), raw, "utf8");

    const meta = {
      category: cat,
      title: data.title || slug,
      slug,
      date: created,
      updatedAt: updated,
      tags: data.tags || [],
      summary: data.summary || "",
      cover: coverUrl,
      path: `/_blog/posts/${outName}`,
    };

    (categories[cat] ||= []).push(meta);
    allPosts.push(meta);
  }
}

const byDateDesc = (a, b) => String(b.date).localeCompare(String(a.date));
Object.keys(categories).forEach((c) => categories[c].sort(byDateDesc));
allPosts.sort(byDateDesc);

const index = {
  categories: Object.keys(categories).sort(),
  byCategory: categories,
  all: allPosts,
};

fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));
console.log(
  `[blog] built: ${allPosts.length} posts in ${Object.keys(categories).length} categories -> apps/blog/public/_blog`,
);
