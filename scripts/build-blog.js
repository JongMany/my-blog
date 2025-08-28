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

// ---------- utils ----------
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

// UTF-8 아닌 파일도 자동 감지/디코드
function readTextSmart(abs) {
  const buf = fs.readFileSync(abs);
  const enc = chardet.detect(buf) || "UTF-8";
  try {
    return iconv.decode(buf, enc);
  } catch {
    return buf.toString("utf8");
  }
}

// Git 최초/최종 커밋일(ISO) 얻기; 없으면 파일시스템 시간 대체
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

// /_blog/assets/* 로 커버/붙임파일 복사
function copyAssetNearby(postAbs, rel) {
  const src = path.resolve(path.dirname(postAbs), rel);
  if (!fs.existsSync(src)) return null;
  ensureDir(ASSETS_DIR);
  const base = `${Date.now()}_${path.basename(src)}`;
  const dest = path.join(ASSETS_DIR, base);
  fs.copyFileSync(src, dest);
  return `/_blog/assets/${base}`;
}

// ---- 분 단위 헬퍼들 ----
// ISO: "YYYY-MM-DDTHH:MM(:SS[.sss])?(Z|±hh:mm)" → "YYYY-MM-DDTHH:MM(Z|±hh:mm)"
function isoToMinute(iso) {
  const m = String(iso).match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  );
  if (m) return m[1] + m[2];
  // fallback: JS Date로 변환 후 로컬 TZ로 다시 조립
  const d = new Date(iso);
  if (isNaN(d.getTime())) return String(iso);
  const pad = (n) => String(n).padStart(2, "0");
  const tzMin = -d.getTimezoneOffset();
  const sign = tzMin >= 0 ? "+" : "-";
  const abs = Math.abs(tzMin);
  const th = pad((abs / 60) | 0);
  const tm = pad(abs % 60);
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}${sign}${th}:${tm}`
  );
}

// ISO에서 y/m/d/hh/mm만 뽑은 파츠(커밋 타임존 기준)
function pickParts(iso) {
  const m = String(iso).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  );
  if (!m) return null;
  return {
    y: +m[1],
    m: +m[2],
    d: +m[3],
    hh: +m[4],
    mm: +m[5],
    tz: m[6],
  };
}

function toFallbackIso(ms) {
  return new Date(ms).toISOString(); // Z(UTC)로 나옴
}

// ---------- build ----------
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
    const raw = readTextSmart(abs);
    const { data } = matter(raw);

    const slug = (data.slug || file.replace(/\.mdx?$/i, "")).toLowerCase();

    // 원본 ISO (초 포함)
    const createdIso =
      data.date ||
      gitDate("created", abs) ||
      toFallbackIso(fs.statSync(abs).ctimeMs);
    const updatedIso =
      data.updatedAt ||
      gitDate("updated", abs) ||
      toFallbackIso(fs.statSync(abs).mtimeMs);

    // 분 단위로 자른 ISO / 파츠 / 정렬키
    const createdMinute = isoToMinute(createdIso);
    const updatedMinute = isoToMinute(updatedIso);
    const createdParts = pickParts(createdIso);
    const updatedParts = pickParts(updatedIso);
    const createdMs = Date.parse(createdIso);
    const updatedMs = Date.parse(updatedIso);

    let coverUrl = null;
    if (data.cover) coverUrl = copyAssetNearby(abs, data.cover);

    // 원문 MDX 복사 (런타임 평가)
    const outName = `${cat}__${slug}.mdx`;
    fs.writeFileSync(path.join(POSTS_DIR, outName), raw, "utf8");

    const meta = {
      category: cat,
      title: data.title || slug, // ← title 없으면 파일명(slug)
      slug,

      // 원본 ISO(초 포함)과 분 단위 파생 필드 모두 제공
      date: createdIso,
      updatedAt: updatedIso,
      dateMinute: createdMinute,
      updatedMinute: updatedMinute,
      dateParts: createdParts, // { y, m, d, hh, mm, tz }
      updatedParts: updatedParts,
      createdAtMs: createdMs, // 정렬/필터에 편한 밀리초
      updatedAtMs: updatedMs,

      tags: data.tags || [],
      summary: data.summary || "",
      cover: coverUrl,
      path: `/_blog/posts/${outName}`,
    };

    (categories[cat] ||= []).push(meta);
    allPosts.push(meta);
  }
}

// 정렬: 작성일(desc)
const byDateDesc = (a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0);
Object.keys(categories).forEach((c) => categories[c].sort(byDateDesc));
allPosts.sort(byDateDesc);

// 인덱스 JSON
const index = {
  categories: Object.keys(categories).sort(),
  byCategory: categories,
  all: allPosts,
};

ensureDir(OUT);
fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

console.log(
  `[blog] built: ${allPosts.length} posts in ${Object.keys(categories).length} categories -> apps/blog/public/_blog`,
);
