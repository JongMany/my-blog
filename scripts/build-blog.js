// // scripts/build-blog.cjs
// /* eslint-disable no-console */
// const fs = require("fs");
// const path = require("path");
// const matter = require("gray-matter");
// const { execSync } = require("node:child_process");
// const chardet = require("chardet");
// const iconv = require("iconv-lite");

// // --- 경로 설정 ---
// const root = path.resolve(process.cwd());
// const SRC = path.join(root, "apps/blog/content/blog"); // 카테고리/글 원본(.md|.mdx)
// const OUT = path.join(root, "apps/blog/public/_blog"); // 공개 산출물
// const POSTS_DIR = path.join(OUT, "posts"); // 변환된 MDX 원문(프론트매터 제거본)
// const ASSETS_DIR = path.join(OUT, "assets"); // 이미지 등 자산

// // --- 유틸 ---
// function cleanDir(p) {
//   fs.rmSync(p, { recursive: true, force: true });
//   fs.mkdirSync(p, { recursive: true });
// }
// function ensureDir(p) {
//   fs.mkdirSync(p, { recursive: true });
// }
// function isMdx(f) {
//   return /\.mdx?$/i.test(f);
// }

// // UTF-8이 아니어도 자동 감지/디코드
// function readTextSmart(abs) {
//   const buf = fs.readFileSync(abs);
//   const enc = chardet.detect(buf) || "UTF-8";
//   try {
//     return iconv.decode(buf, enc);
//   } catch {
//     return buf.toString("utf8");
//   }
// }

// // BOM/개행/템플릿 더블 중괄호 등 사소한 정리
// function sanitizeMdx(src) {
//   return src
//     .replace(/^\uFEFF/, "") // BOM 제거
//     .replace(/\r\n/g, "\n") // CRLF → LF
//     .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
//     .replace(/}}/g, "\\}\\}");
// }

// // Git 최초/최종 커밋일(ISO) 얻기(없으면 파일 시간 fallback)
// function gitDate(kind, fileAbs) {
//   try {
//     const rel = path.relative(root, fileAbs);
//     const fmt =
//       kind === "created"
//         ? "git log --diff-filter=A --follow --format=%aI -1 -- "
//         : "git log --follow --format=%aI -1 -- ";
//     const out = execSync(fmt + JSON.stringify(rel), {
//       stdio: ["ignore", "pipe", "ignore"],
//     })
//       .toString()
//       .trim();
//     return out || null;
//   } catch {
//     return null;
//   }
// }
// function toFallbackIso(ms) {
//   return new Date(ms).toISOString(); // UTC Z
// }

// // ISO → 분 단위(초 제거) "YYYY-MM-DDTHH:MM±TZ"
// function isoToMinute(iso) {
//   const m = String(iso).match(
//     /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
//   );
//   if (m) return m[1] + m[2];
//   const d = new Date(iso);
//   if (isNaN(d.getTime())) return String(iso);
//   const pad = (n) => String(n).padStart(2, "0");
//   const tzMin = -d.getTimezoneOffset();
//   const sign = tzMin >= 0 ? "+" : "-";
//   const abs = Math.abs(tzMin);
//   const th = pad((abs / 60) | 0);
//   const tm = pad(abs % 60);
//   return (
//     `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
//     `T${pad(d.getHours())}:${pad(d.getMinutes())}${sign}${th}:${tm}`
//   );
// }

// // ISO → y/m/d/hh/mm/tz 파츠
// function pickParts(iso) {
//   const m = String(iso).match(
//     /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
//   );
//   if (!m) return null;
//   return { y: +m[1], m: +m[2], d: +m[3], hh: +m[4], mm: +m[5], tz: m[6] };
// }

// // 파일을 /_blog/assets/<timestamp>_<name> 로 복사하고 URL 반환
// function copyAssetNearby(postAbs, rel) {
//   const src = path.resolve(path.dirname(postAbs), rel);
//   if (!fs.existsSync(src)) return null;
//   ensureDir(ASSETS_DIR);
//   const base = `${Date.now()}_${path.basename(src)}`;
//   const dest = path.join(ASSETS_DIR, base);
//   fs.copyFileSync(src, dest);
//   return `/_blog/assets/${base}`;
// }

// // 본문 내 이미지 경로를 전부 /_blog/assets/* 로 치환(상대/"/_blog/xxx" 모두 대응)
// function rewriteInlineAssets(content, postAbs) {
//   let out = content;

//   // 1) Markdown 이미지: ![alt](href "title")
//   out = out.replace(
//     /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
//     (m, alt, href) => {
//       // 외부 URL은 패스
//       if (/^https?:\/\//i.test(href)) return m;
//       // 이미 변환된 /_blog/assets/ 는 그대로
//       if (href.startsWith("/_blog/assets/")) return m;

//       // "/_blog/xxx" → 글 파일 기준 상대로 간주하여 복사
//       const candidate = href.startsWith("/_blog/")
//         ? href.replace(/^\/_blog\//, "")
//         : href;

//       const url = copyAssetNearby(postAbs, candidate);
//       return url ? `![${alt}](${url})` : m;
//     },
//   );

//   // 2) HTML 이미지: <img src="...">
//   out = out.replace(/<img\s+[^>]*src="([^"]+)"[^>]*>/gi, (m, src) => {
//     if (/^https?:\/\//i.test(src)) return m;
//     if (src.startsWith("/_blog/assets/")) return m;

//     const candidate = src.startsWith("/_blog/")
//       ? src.replace(/^\/_blog\//, "")
//       : src;

//     const url = copyAssetNearby(postAbs, candidate);
//     return url ? m.replace(src, url) : m;
//   });

//   return out;
// }

// // --- 빌드 시작 ---
// cleanDir(OUT);
// ensureDir(POSTS_DIR);

// const categories = {};
// const allPosts = [];

// for (const cat of fs.readdirSync(SRC)) {
//   const catDir = path.join(SRC, cat);
//   if (!fs.statSync(catDir).isDirectory()) continue;
//   categories[cat] ||= [];

//   const files = fs.readdirSync(catDir).filter(isMdx);

//   for (const file of files) {
//     const abs = path.join(catDir, file);
//     const raw = readTextSmart(abs);

//     // 프론트매터 1개만 파싱 → content(본문)과 data(메타) 분리
//     const { data, content } = matter(raw);

//     const slug = (data.slug || file.replace(/\.mdx?$/i, "")).toLowerCase();

//     // 작성/수정 시간 (ISO, 초 포함)
//     const createdIso =
//       data.date ||
//       gitDate("created", abs) ||
//       toFallbackIso(fs.statSync(abs).ctimeMs);
//     const updatedIso =
//       data.updatedAt ||
//       gitDate("updated", abs) ||
//       toFallbackIso(fs.statSync(abs).mtimeMs);

//     // 파생 필드(분/파츠/정렬키)
//     const createdMinute = isoToMinute(createdIso);
//     const updatedMinute = isoToMinute(updatedIso);
//     const createdParts = pickParts(createdIso);
//     const updatedParts = pickParts(updatedIso);
//     const createdAtMs = Date.parse(createdIso);
//     const updatedAtMs = Date.parse(updatedIso);

//     // 커버 처리: 절대/이미 변환됨/auto/상대
//     let coverUrl = null;
//     if (data.cover) {
//       if (
//         /^https?:\/\//i.test(data.cover) ||
//         data.cover.startsWith("/_blog/assets/")
//       ) {
//         coverUrl = data.cover;
//       } else if (data.cover === "auto") {
//         const m = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
//         if (m) {
//           coverUrl = /^https?:\/\//i.test(m[1])
//             ? m[1]
//             : copyAssetNearby(abs, m[1].replace(/^\/_blog\//, ""));
//         }
//       } else if (data.cover.startsWith("/_blog/")) {
//         coverUrl = copyAssetNearby(abs, data.cover.replace(/^\/_blog\//, ""));
//       } else {
//         coverUrl = copyAssetNearby(abs, data.cover);
//       }
//     }

//     // 본문 정리: 프론트매터 제거된 content만 저장 + 이미지 경로 재작성 + UTF-8 정리
//     const transformed = sanitizeMdx(rewriteInlineAssets(content, abs));
//     const outName = `${cat}__${slug}.mdx`;
//     fs.writeFileSync(path.join(POSTS_DIR, outName), transformed, "utf8");

//     // 메타(인덱스용)
//     const meta = {
//       category: cat,
//       title: data.title || slug,
//       slug,

//       // 시간 필드들
//       date: createdIso,
//       updatedAt: updatedIso,
//       dateMinute: createdMinute,
//       updatedMinute: updatedMinute,
//       dateParts: createdParts, // { y,m,d,hh,mm,tz }
//       updatedParts: updatedParts,
//       createdAtMs, // 정렬용 숫자
//       updatedAtMs,

//       tags: data.tags || [],
//       summary: data.summary || "",

//       cover: coverUrl, // null | '/_blog/assets/xxx' | 'https://...'
//       coverAlt: data.coverAlt || "", // 선택 메타
//       coverCaption: data.coverCaption || "", // 선택 메타

//       path: `/_blog/posts/${outName}`, // 런타임에서 fetch할 MDX 경로
//     };

//     (categories[cat] ||= []).push(meta);
//     allPosts.push(meta);
//   }
// }

// // 정렬: 작성일(desc)
// allPosts.sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
// for (const c of Object.keys(categories)) {
//   categories[c].sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
// }

// // 인덱스 JSON
// const index = {
//   categories: Object.keys(categories).sort(),
//   byCategory: categories,
//   all: allPosts,
// };

// ensureDir(OUT);
// fs.writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index, null, 2));

// console.log(
//   `[blog] built: ${allPosts.length} posts in ${Object.keys(categories).length} categories -> apps/blog/public/_blog`,
// );

/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { execSync } = require("node:child_process");
const chardet = require("chardet");
const iconv = require("iconv-lite");
const crypto = require("crypto");

// --- 경로 설정 ---
const root = path.resolve(process.cwd());
const SRC = path.join(root, "apps/blog/content/blog"); // 카테고리/글 원본(.md|.mdx)
const OUT = path.join(root, "apps/blog/public/_blog"); // 공개 산출물
const POSTS_DIR = path.join(OUT, "posts"); // 변환된 MDX 원문(프론트매터 제거본)
const ASSETS_DIR = path.join(OUT, "assets"); // 이미지 등 자산

// --- 유틸 ---
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

// UTF-8이 아니어도 자동 감지/디코드
function readTextSmart(abs) {
  const buf = fs.readFileSync(abs);
  const enc = chardet.detect(buf) || "UTF-8";
  try {
    return iconv.decode(buf, enc);
  } catch {
    return buf.toString("utf8");
  }
}

// BOM/개행/템플릿 더블 중괄호 등 사소한 정리
function sanitizeMdx(src) {
  return src
    .replace(/^\uFEFF/, "") // BOM 제거
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
    .replace(/}}/g, "\\}\\}");
}

// Git 최초/최종 커밋일(ISO) 얻기(없으면 파일 시간 fallback)
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

// Git 마지막 커밋 정보(스탬프용)
function gitShortRev(fileAbs) {
  try {
    const rel = path.relative(root, fileAbs);
    const out = execSync("git log -1 --format=%h -- " + JSON.stringify(rel), {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    return out || null;
  } catch {
    return null;
  }
}
function gitCommitTs(fileAbs) {
  try {
    const rel = path.relative(root, fileAbs);
    const out = execSync("git log -1 --format=%ct -- " + JSON.stringify(rel), {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();
    return out || null; // unix seconds
  } catch {
    return null;
  }
}
function contentHash12(fileAbs) {
  const buf = fs.readFileSync(fileAbs);
  return crypto.createHash("sha1").update(buf).digest("hex").slice(0, 12);
}
function slugifyBase(name) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function toFallbackIso(ms) {
  return new Date(ms).toISOString(); // UTC Z
}

// ISO → 분 단위(초 제거) "YYYY-MM-DDTHH:MM±TZ"
function isoToMinute(iso) {
  const m = String(iso).match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  );
  if (m) return m[1] + m[2];
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

// ISO → y/m/d/hh/mm/tz 파츠
function pickParts(iso) {
  const m = String(iso).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  );
  if (!m) return null;
  return { y: +m[1], m: +m[2], d: +m[3], hh: +m[4], mm: +m[5], tz: m[6] };
}

// 같은 소스 이미지를 중복 복사하지 않기 위한 캐시
const ASSET_CACHE = new Map(); // absPath -> url

// 파일을 /_blog/assets/<name>__<stamp>.<ext> 로 복사하고 URL 반환
function copyAssetNearby(postAbs, rel) {
  const src = path.resolve(path.dirname(postAbs), rel);
  if (!fs.existsSync(src)) return null;
  if (ASSET_CACHE.has(src)) return ASSET_CACHE.get(src);

  ensureDir(ASSETS_DIR);
  const { name, ext } = path.parse(src);

  // 스탬프 우선순위: git (시각+해시) → 내용해시 → 파일 mtime(초)
  const ts = gitCommitTs(src);
  const rev = gitShortRev(src);
  const stamp =
    (ts && rev && `${ts}-${rev}`) ||
    contentHash12(src) ||
    Math.floor(fs.statSync(src).mtimeMs / 1000);

  const safe = `${slugifyBase(name)}__${stamp}${ext}`;
  const dest = path.join(ASSETS_DIR, safe);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
  }
  const url = `/_blog/assets/${safe}`;
  ASSET_CACHE.set(src, url);
  return url;
}

// 본문 내 이미지 경로를 전부 /_blog/assets/* 로 치환(상대/"/_blog/xxx" 모두 대응)
function rewriteInlineAssets(content, postAbs) {
  let out = content;

  // 1) Markdown 이미지: ![alt](href "title")
  out = out.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (m, alt, href) => {
      // 외부 URL은 패스
      if (/^https?:\/\//i.test(href)) return m;
      // 이미 변환된 /_blog/assets/ 는 그대로
      if (href.startsWith("/_blog/assets/")) return m;

      // "/_blog/xxx" → 글 파일 기준 상대로 간주하여 복사
      const candidate = href.startsWith("/_blog/")
        ? href.replace(/^\/_blog\//, "")
        : href;

      const url = copyAssetNearby(postAbs, candidate);
      return url ? `![${alt}](${url})` : m;
    },
  );

  // 2) HTML 이미지: <img src="...">
  out = out.replace(/<img\s+[^>]*src="([^"]+)"[^>]*>/gi, (m, src) => {
    if (/^https?:\/\//i.test(src)) return m;
    if (src.startsWith("/_blog/assets/")) return m;

    const candidate = src.startsWith("/_blog/")
      ? src.replace(/^\/_blog\//, "")
      : src;

    const url = copyAssetNearby(postAbs, candidate);
    return url ? m.replace(src, url) : m;
  });

  return out;
}

// --- 빌드 시작 ---
cleanDir(OUT);
ensureDir(POSTS_DIR);

const categories = {};
const allPosts = [];

for (const cat of fs.readdirSync(SRC)) {
  const catDir = path.join(SRC, cat);
  if (!fs.statSync(catDir).isDirectory()) continue;

  // 글이 없어도 index.json에 카테고리가 나오도록 보장
  categories[cat] ||= [];

  const files = fs.readdirSync(catDir).filter(isMdx);

  for (const file of files) {
    const abs = path.join(catDir, file);
    const raw = readTextSmart(abs);

    // 프론트매터 1개만 파싱 → content(본문)과 data(메타) 분리
    const { data, content } = matter(raw);

    const slug = (data.slug || file.replace(/\.mdx?$/i, "")).toLowerCase();

    // 작성/수정 시간 (ISO, 초 포함)
    const createdIso =
      data.date ||
      gitDate("created", abs) ||
      toFallbackIso(fs.statSync(abs).ctimeMs);
    const updatedIso =
      data.updatedAt ||
      gitDate("updated", abs) ||
      toFallbackIso(fs.statSync(abs).mtimeMs);

    // 파생 필드(분/파츠/정렬키)
    const createdMinute = isoToMinute(createdIso);
    const updatedMinute = isoToMinute(updatedIso);
    const createdParts = pickParts(createdIso);
    const updatedParts = pickParts(updatedIso);
    const createdAtMs = Date.parse(createdIso);
    const updatedAtMs = Date.parse(updatedIso);

    // 커버 처리: 절대/이미 변환됨/auto/상대
    let coverUrl = null;
    if (data.cover) {
      if (
        /^https?:\/\//i.test(data.cover) ||
        data.cover.startsWith("/_blog/assets/")
      ) {
        coverUrl = data.cover;
      } else if (data.cover === "auto") {
        const m = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
        if (m) {
          coverUrl = /^https?:\/\//i.test(m[1])
            ? m[1]
            : copyAssetNearby(abs, m[1].replace(/^\/_blog\//, ""));
        }
      } else if (data.cover.startsWith("/_blog/")) {
        coverUrl = copyAssetNearby(abs, data.cover.replace(/^\/_blog\//, ""));
      } else {
        coverUrl = copyAssetNearby(abs, data.cover);
      }
    }

    // 본문 정리: 프론트매터 제거된 content만 저장 + 이미지 경로 재작성 + UTF-8 정리
    const transformed = sanitizeMdx(rewriteInlineAssets(content, abs));
    const outName = `${cat}__${slug}.mdx`;
    fs.writeFileSync(path.join(POSTS_DIR, outName), transformed, "utf8");

    // 메타(인덱스용)
    const meta = {
      category: cat,
      title: data.title || slug,
      slug,

      // 시간 필드들
      date: createdIso,
      updatedAt: updatedIso,
      dateMinute: createdMinute,
      updatedMinute: updatedMinute,
      dateParts: createdParts, // { y,m,d,hh,mm,tz }
      updatedParts: updatedParts,
      createdAtMs, // 정렬용 숫자
      updatedAtMs,

      tags: data.tags || [],
      summary: data.summary || "",

      cover: coverUrl, // null | '/_blog/assets/xxx' | 'https://...'
      coverAlt: data.coverAlt || "", // 선택 메타
      coverCaption: data.coverCaption || "", // 선택 메타

      path: `/_blog/posts/${outName}`, // 런타임에서 fetch할 MDX 경로
    };

    (categories[cat] ||= []).push(meta);
    allPosts.push(meta);
  }
}

// 정렬: 작성일(desc)
allPosts.sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
for (const c of Object.keys(categories)) {
  categories[c].sort((a, b) => (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0));
}

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
