// /* eslint-disable no-console */
// const fs = require("fs");
// const path = require("path");
// const matter = require("gray-matter");
// const { execSync } = require("node:child_process");
// const chardet = require("chardet");
// const iconv = require("iconv-lite");
// const crypto = require("crypto");

// // ============================================================================
// // 상수 정의
// // ============================================================================

// const CONFIG = {
//   // 경로 설정
//   SRC_DIR: "apps/blog/content/blog",
//   OUT_DIR: "apps/blog/public/_blog",
//   POSTS_DIR: "posts",
//   ASSETS_DIR: "assets",

//   // 파일 확장자
//   MDX_EXTENSIONS: /\.mdx?$/i,

//   // 인코딩 설정
//   DEFAULT_ENCODING: "UTF-8",
//   FALLBACK_ENCODINGS: ["CP949", "EUC-KR", "WINDOWS-1252"],

//   // Git 설정
//   GIT_DATE_FORMATS: {
//     created: "git log --diff-filter=A --follow --format=%aI -1 -- ",
//     updated: "git log --follow --format=%aI -1 -- ",
//   },
//   GIT_REV_FORMAT: "git log -1 --format=%h -- ",
//   GIT_TIMESTAMP_FORMAT: "git log -1 --format=%ct -- ",

//   // 정렬 설정
//   SORT_ORDER: "desc", // 최신순
// };

// const ERROR_MESSAGES = {
//   FILE_NOT_FOUND: "파일을 찾을 수 없습니다",
//   INVALID_ENCODING: "인코딩을 감지할 수 없습니다",
//   GIT_COMMAND_FAILED: "Git 명령어 실행 실패",
//   ASSET_COPY_FAILED: "자산 파일 복사 실패",
//   BUILD_FAILED: "빌드 실패",
// };

// // ============================================================================
// // 타입 정의 (JSDoc)
// // ============================================================================

// /**
//  * @typedef {Object} DateParts
//  * @property {number} y - year
//  * @property {number} m - month
//  * @property {number} d - day
//  * @property {number} hh - hour
//  * @property {number} mm - minute
//  * @property {string} tz - timezone
//  */

// /**
//  * @typedef {Object} BlogPostMeta
//  * @property {string} category
//  * @property {string} title
//  * @property {string} slug
//  * @property {string} summary
//  * @property {string[]} tags
//  * @property {string|null} cover
//  * @property {string} path
//  * @property {string} date
//  * @property {string} updatedAt
//  * @property {string} dateMinute
//  * @property {string} updatedMinute
//  * @property {DateParts|null} dateParts
//  * @property {DateParts|null} updatedParts
//  * @property {number} createdAtMs
//  * @property {number} updatedAtMs
//  */

// /**
//  * @typedef {Object} BlogIndex
//  * @property {string[]} categories
//  * @property {Record<string, BlogPostMeta[]>} byCategory
//  * @property {BlogPostMeta[]} all
//  */

// /**
//  * @typedef {Object} BuildResult
//  * @property {BlogIndex} index
//  * @property {number} postCount
//  * @property {number} categoryCount
//  */

// // ============================================================================
// // 유틸리티 함수들 (순수 함수)
// // ============================================================================

// /**
//  * 파일 확장자가 MDX인지 확인
//  * @param {string} filename
//  * @returns {boolean}
//  */
// function isMdxFile(filename) {
//   return CONFIG.MDX_EXTENSIONS.test(filename);
// }

// /**
//  * 안전한 디렉토리 생성
//  * @param {string} dirPath
//  * @returns {void}
//  */
// function ensureDirectory(dirPath) {
//   if (!fs.existsSync(dirPath)) {
//     fs.mkdirSync(dirPath, { recursive: true });
//   }
// }

// /**
//  * 디렉토리 정리 (기존 내용 삭제 후 재생성)
//  * @param {string} dirPath
//  * @returns {void}
//  */
// function cleanDirectory(dirPath) {
//   if (fs.existsSync(dirPath)) {
//     fs.rmSync(dirPath, { recursive: true, force: true });
//   }
//   fs.mkdirSync(dirPath, { recursive: true });
// }

// /**
//  * 파일명을 안전한 slug로 변환
//  * @param {string} name
//  * @returns {string}
//  */
// function slugify(name) {
//   return name
//     .normalize("NFKD")
//     .replace(/[^\w.-]+/g, "-")
//     .replace(/-+/g, "-")
//     .replace(/^-|-$/g, "")
//     .toLowerCase();
// }

// /**
//  * 파일 내용의 해시값 생성 (12자리)
//  * @param {string} filePath
//  * @returns {string}
//  */
// function getContentHash(filePath) {
//   const buffer = fs.readFileSync(filePath);
//   return crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 12);
// }

// /**
//  * UTF-8이 아닌 텍스트를 감지
//  * @param {string} text
//  * @returns {boolean}
//  */
// function hasBrokenUtf8(text) {
//   return text.includes("\uFFFD");
// }

// // ============================================================================
// // 인코딩 처리 함수들
// // ============================================================================

// /**
//  * 파일의 인코딩을 자동 감지
//  * @param {string} filePath
//  * @returns {string}
//  */
// function detectEncoding(filePath) {
//   const buffer = fs.readFileSync(filePath);
//   return chardet.detect(buffer) || CONFIG.DEFAULT_ENCODING;
// }

// /**
//  * 파일을 UTF-8로 읽기
//  * @param {string} filePath
//  * @returns {string}
//  */
// function readTextFile(filePath) {
//   const buffer = fs.readFileSync(filePath);
//   const encoding = detectEncoding(filePath);

//   try {
//     const text = iconv.decode(buffer, encoding);
//     if (!hasBrokenUtf8(text)) {
//       return text;
//     }
//   } catch (error) {
//     console.warn(`인코딩 변환 실패 (${encoding}): ${filePath}`);
//   }

//   // fallback: UTF-8로 직접 읽기
//   return buffer.toString("utf8");
// }

// /**
//  * MDX 내용 정리 (BOM 제거, 개행 정규화 등)
//  * @param {string} content
//  * @returns {string}
//  */
// function sanitizeMdxContent(content) {
//   return content
//     .replace(/^\uFEFF/, "") // BOM 제거
//     .replace(/\r\n/g, "\n") // CRLF → LF
//     .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
//     .replace(/}}/g, "\\}\\}");
// }

// // ============================================================================
// // Git 관련 함수들
// // ============================================================================

// /**
//  * Git 명령어 실행 (안전한 실행)
//  * @param {string} command
//  * @param {string} filePath
//  * @returns {string|null}
//  */
// function executeGitCommand(command, filePath) {
//   try {
//     const relativePath = path.relative(process.cwd(), filePath);
//     const fullCommand = command + JSON.stringify(relativePath);

//     const result = execSync(fullCommand, {
//       stdio: ["ignore", "pipe", "ignore"],
//       encoding: "utf8",
//     }).trim();

//     return result || null;
//   } catch (error) {
//     return null;
//   }
// }

// /**
//  * 파일의 Git 생성일 가져오기
//  * @param {string} filePath
//  * @returns {string|null}
//  */
// function getGitCreatedDate(filePath) {
//   return executeGitCommand(CONFIG.GIT_DATE_FORMATS.created, filePath);
// }

// /**
//  * 파일의 Git 수정일 가져오기
//  * @param {string} filePath
//  * @returns {string|null}
//  */
// function getGitUpdatedDate(filePath) {
//   return executeGitCommand(CONFIG.GIT_DATE_FORMATS.updated, filePath);
// }

// /**
//  * 파일의 Git 커밋 해시 가져오기
//  * @param {string} filePath
//  * @returns {string|null}
//  */
// function getGitCommitHash(filePath) {
//   return executeGitCommand(CONFIG.GIT_REV_FORMAT, filePath);
// }

// /**
//  * 파일의 Git 커밋 타임스탬프 가져오기
//  * @param {string} filePath
//  * @returns {string|null}
//  */
// function getGitCommitTimestamp(filePath) {
//   return executeGitCommand(CONFIG.GIT_TIMESTAMP_FORMAT, filePath);
// }

// // ============================================================================
// // 날짜 처리 함수들
// // ============================================================================

// /**
//  * 밀리초를 ISO 문자열로 변환
//  * @param {number} milliseconds
//  * @returns {string}
//  */
// function millisecondsToIso(milliseconds) {
//   return new Date(milliseconds).toISOString();
// }

// /**
//  * ISO 문자열을 분 단위로 변환 (초 제거)
//  * @param {string} isoString
//  * @returns {string}
//  */
// function isoToMinute(isoString) {
//   const match = String(isoString).match(
//     /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
//   );

//   if (match) {
//     return match[1] + match[2];
//   }

//   // fallback: Date 객체로 파싱
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     return String(isoString);
//   }

//   const pad = (n) => String(n).padStart(2, "0");
//   const timezoneOffset = -date.getTimezoneOffset();
//   const sign = timezoneOffset >= 0 ? "+" : "-";
//   const abs = Math.abs(timezoneOffset);
//   const hours = pad(Math.floor(abs / 60));
//   const minutes = pad(abs % 60);

//   return (
//     `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
//     `T${pad(date.getHours())}:${pad(date.getMinutes())}${sign}${hours}:${minutes}`
//   );
// }

// /**
//  * ISO 문자열을 날짜 파트로 분해
//  * @param {string} isoString
//  * @returns {DateParts|null}
//  */
// function parseDateParts(isoString) {
//   const match = String(isoString).match(
//     /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
//   );

//   if (!match) {
//     return null;
//   }

//   return {
//     y: parseInt(match[1], 10),
//     m: parseInt(match[2], 10),
//     d: parseInt(match[3], 10),
//     hh: parseInt(match[4], 10),
//     mm: parseInt(match[5], 10),
//     tz: match[6],
//   };
// }

// // ============================================================================
// // 자산 처리 함수들
// // ============================================================================

// /**
//  * 자산 파일의 스탬프 생성
//  * @param {string} filePath
//  * @returns {string}
//  */
// function generateAssetStamp(filePath) {
//   const gitTimestamp = getGitCommitTimestamp(filePath);
//   const gitHash = getGitCommitHash(filePath);

//   if (gitTimestamp && gitHash) {
//     return `${gitTimestamp}-${gitHash}`;
//   }

//   const contentHash = getContentHash(filePath);
//   if (contentHash) {
//     return contentHash;
//   }

//   const stats = fs.statSync(filePath);
//   return Math.floor(stats.mtimeMs / 1000).toString();
// }

// /**
//  * 자산 파일을 안전한 이름으로 변환
//  * @param {string} filePath
//  * @returns {string}
//  */
// function generateAssetFilename(filePath) {
//   const { name, ext } = path.parse(filePath);
//   const stamp = generateAssetStamp(filePath);
//   const safeName = slugify(name);

//   return `${safeName}__${stamp}${ext}`;
// }

// /**
//  * 자산 파일 복사 (중복 방지)
//  * @param {string} sourcePath
//  * @param {string} targetDir
//  * @param {Map<string, string>} cache
//  * @returns {string|null}
//  */
// function copyAsset(sourcePath, targetDir, cache) {
//   if (!fs.existsSync(sourcePath)) {
//     return null;
//   }

//   if (cache.has(sourcePath)) {
//     return cache.get(sourcePath);
//   }

//   ensureDirectory(targetDir);
//   const filename = generateAssetFilename(sourcePath);
//   const targetPath = path.join(targetDir, filename);

//   if (!fs.existsSync(targetPath)) {
//     fs.copyFileSync(sourcePath, targetPath);
//   }

//   const url = `/_blog/assets/${filename}`;
//   cache.set(sourcePath, url);
//   return url;
// }

// /**
//  * MDX 내용의 이미지 경로를 자산 URL로 변환
//  * @param {string} content
//  * @param {string} postPath
//  * @param {string} assetsDir
//  * @param {Map<string, string>} assetCache
//  * @returns {string}
//  */
// function transformImagePaths(content, postPath, assetsDir, assetCache) {
//   let transformed = content;

//   // Markdown 이미지: ![alt](href "title")
//   transformed = transformed.replace(
//     /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
//     (match, alt, href) => {
//       // 외부 URL은 그대로 유지
//       if (/^https?:\/\//i.test(href)) {
//         return match;
//       }

//       // 이미 변환된 경로는 그대로 유지
//       if (href.startsWith("/_blog/assets/")) {
//         return match;
//       }

//       // 상대 경로를 절대 경로로 변환
//       const candidate = href.startsWith("/_blog/")
//         ? href.replace(/^\/_blog\//, "")
//         : href;

//       const sourcePath = path.resolve(path.dirname(postPath), candidate);
//       const assetUrl = copyAsset(sourcePath, assetsDir, assetCache);

//       return assetUrl ? `![${alt}](${assetUrl})` : match;
//     },
//   );

//   // HTML 이미지: <img src="...">
//   transformed = transformed.replace(
//     /<img\s+[^>]*src="([^"]+)"[^>]*>/gi,
//     (match, src) => {
//       if (/^https?:\/\//i.test(src) || src.startsWith("/_blog/assets/")) {
//         return match;
//       }

//       const candidate = src.startsWith("/_blog/")
//         ? src.replace(/^\/_blog\//, "")
//         : src;

//       const sourcePath = path.resolve(path.dirname(postPath), candidate);
//       const assetUrl = copyAsset(sourcePath, assetsDir, assetCache);

//       return assetUrl ? match.replace(src, assetUrl) : match;
//     },
//   );

//   return transformed;
// }

// // ============================================================================
// // 포스트 처리 함수들
// // ============================================================================

// /**
//  * 포스트의 커버 이미지 URL 생성
//  * @param {Object} frontmatter
//  * @param {string} content
//  * @param {string} postPath
//  * @param {string} assetsDir
//  * @param {Map<string, string>} assetCache
//  * @returns {string|null}
//  */
// function generateCoverUrl(
//   frontmatter,
//   content,
//   postPath,
//   assetsDir,
//   assetCache,
// ) {
//   const { cover } = frontmatter;

//   if (!cover) {
//     return null;
//   }

//   // 외부 URL 또는 이미 변환된 경로
//   if (/^https?:\/\//i.test(cover) || cover.startsWith("/_blog/assets/")) {
//     return cover;
//   }

//   // 자동 감지: 첫 번째 이미지 사용
//   if (cover === "auto") {
//     const imageMatch = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
//     if (imageMatch) {
//       const href = imageMatch[1];
//       if (/^https?:\/\//i.test(href)) {
//         return href;
//       }

//       const candidate = href.startsWith("/_blog/")
//         ? href.replace(/^\/_blog\//, "")
//         : href;

//       const sourcePath = path.resolve(path.dirname(postPath), candidate);
//       return copyAsset(sourcePath, assetsDir, assetCache);
//     }
//     return null;
//   }

//   // 상대 경로 처리
//   const candidate = cover.startsWith("/_blog/")
//     ? cover.replace(/^\/_blog\//, "")
//     : cover;

//   const sourcePath = path.resolve(path.dirname(postPath), candidate);
//   return copyAsset(sourcePath, assetsDir, assetCache);
// }

// /**
//  * 포스트 메타데이터 생성
//  * @param {Object} frontmatter
//  * @param {string} content
//  * @param {string} postPath
//  * @param {string} category
//  * @param {string} slug
//  * @param {string} assetsDir
//  * @param {Map<string, string>} assetCache
//  * @returns {BlogPostMeta}
//  */
// function createPostMeta(
//   frontmatter,
//   content,
//   postPath,
//   category,
//   slug,
//   assetsDir,
//   assetCache,
// ) {
//   const stats = fs.statSync(postPath);

//   // 날짜 정보 생성
//   const createdIso =
//     frontmatter.date ||
//     getGitCreatedDate(postPath) ||
//     millisecondsToIso(stats.ctimeMs);

//   const updatedIso =
//     frontmatter.updatedAt ||
//     getGitUpdatedDate(postPath) ||
//     millisecondsToIso(stats.mtimeMs);

//   // 파생 필드들
//   const createdMinute = isoToMinute(createdIso);
//   const updatedMinute = isoToMinute(updatedIso);
//   const createdParts = parseDateParts(createdIso);
//   const updatedParts = parseDateParts(updatedIso);
//   const createdAtMs = Date.parse(createdIso);
//   const updatedAtMs = Date.parse(updatedIso);

//   // 커버 이미지 URL
//   const coverUrl = generateCoverUrl(
//     frontmatter,
//     content,
//     postPath,
//     assetsDir,
//     assetCache,
//   );

//   return {
//     category,
//     title: frontmatter.title || slug,
//     slug,
//     summary: frontmatter.summary || "",
//     tags: frontmatter.tags || [],
//     cover: coverUrl,
//     path: `/_blog/posts/${category}__${slug}.mdx`,
//     date: createdIso,
//     updatedAt: updatedIso,
//     dateMinute: createdMinute,
//     updatedMinute: updatedMinute,
//     dateParts: createdParts,
//     updatedParts: updatedParts,
//     createdAtMs,
//     updatedAtMs,
//   };
// }

// /**
//  * 포스트 파일 처리
//  * @param {string} postPath
//  * @param {string} category
//  * @param {string} postsDir
//  * @param {string} assetsDir
//  * @param {Map<string, string>} assetCache
//  * @returns {BlogPostMeta}
//  */
// function processPostFile(postPath, category, postsDir, assetsDir, assetCache) {
//   const rawContent = readTextFile(postPath);
//   const { data: frontmatter, content } = matter(rawContent);

//   const slug = (
//     frontmatter.slug || path.basename(postPath, path.extname(postPath))
//   ).toLowerCase();

//   // 메타데이터 생성
//   const meta = createPostMeta(
//     frontmatter,
//     content,
//     postPath,
//     category,
//     slug,
//     assetsDir,
//     assetCache,
//   );

//   // 콘텐츠 변환 및 저장
//   const transformedContent = sanitizeMdxContent(
//     transformImagePaths(content, postPath, assetsDir, assetCache),
//   );

//   const outputFilename = `${category}__${slug}.mdx`;
//   const outputPath = path.join(postsDir, outputFilename);

//   fs.writeFileSync(outputPath, transformedContent, "utf8");

//   return meta;
// }

// // ============================================================================
// // 메인 빌드 함수들
// // ============================================================================

// /**
//  * 카테고리별 포스트 처리
//  * @param {string} srcDir
//  * @param {string} postsDir
//  * @param {string} assetsDir
//  * @returns {Object}
//  */
// function processCategories(srcDir, postsDir, assetsDir) {
//   const categories = {};
//   const allPosts = [];
//   const assetCache = new Map();

//   const categoryDirs = fs.readdirSync(srcDir).filter((item) => {
//     const itemPath = path.join(srcDir, item);
//     return fs.statSync(itemPath).isDirectory();
//   });

//   for (const category of categoryDirs) {
//     const categoryDir = path.join(srcDir, category);
//     const files = fs.readdirSync(categoryDir).filter(isMdxFile);

//     categories[category] = [];

//     for (const file of files) {
//       const postPath = path.join(categoryDir, file);
//       const meta = processPostFile(
//         postPath,
//         category,
//         postsDir,
//         assetsDir,
//         assetCache,
//       );

//       categories[category].push(meta);
//       allPosts.push(meta);
//     }
//   }

//   return { categories, allPosts };
// }

// /**
//  * 포스트 정렬
//  * @param {BlogPostMeta[]} posts
//  * @returns {BlogPostMeta[]}
//  */
// function sortPosts(posts) {
//   return [...posts].sort((a, b) => {
//     if (CONFIG.SORT_ORDER === "desc") {
//       return (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0);
//     }
//     return (a.createdAtMs ?? 0) - (b.createdAtMs ?? 0);
//   });
// }

// /**
//  * 블로그 인덱스 생성
//  * @param {Object} categories
//  * @param {BlogPostMeta[]} allPosts
//  * @returns {BlogIndex}
//  */
// function createBlogIndex(categories, allPosts) {
//   const sortedPosts = sortPosts(allPosts);
//   const sortedCategories = {};

//   // 카테고리별 정렬
//   for (const [category, posts] of Object.entries(categories)) {
//     sortedCategories[category] = sortPosts(posts);
//   }

//   return {
//     categories: Object.keys(sortedCategories).sort(),
//     byCategory: sortedCategories,
//     all: sortedPosts,
//   };
// }

// /**
//  * 메인 빌드 함수
//  * @returns {BuildResult}
//  */
// function buildBlog() {
//   const root = process.cwd();
//   const srcDir = path.join(root, CONFIG.SRC_DIR);
//   const outDir = path.join(root, CONFIG.OUT_DIR);
//   const postsDir = path.join(outDir, CONFIG.POSTS_DIR);
//   const assetsDir = path.join(outDir, CONFIG.ASSETS_DIR);

//   try {
//     // 디렉토리 정리 및 생성
//     cleanDirectory(outDir);
//     ensureDirectory(postsDir);
//     ensureDirectory(assetsDir);

//     // 카테고리별 포스트 처리
//     const { categories, allPosts } = processCategories(
//       srcDir,
//       postsDir,
//       assetsDir,
//     );

//     // 인덱스 생성
//     const index = createBlogIndex(categories, allPosts);

//     // 인덱스 파일 저장
//     const indexPath = path.join(outDir, "index.json");
//     fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");

//     return {
//       index,
//       postCount: allPosts.length,
//       categoryCount: Object.keys(categories).length,
//     };
//   } catch (error) {
//     console.error(`${ERROR_MESSAGES.BUILD_FAILED}:`, error.message);
//     throw error;
//   }
// }

// // ============================================================================
// // 실행
// // ============================================================================

// if (require.main === module) {
//   try {
//     const result = buildBlog();
//     console.log(
//       `[blog] built: ${result.postCount} posts in ${result.categoryCount} categories -> ${CONFIG.OUT_DIR}`,
//     );
//   } catch (error) {
//     console.error("빌드 실패:", error.message);
//     process.exit(1);
//   }
// }

// module.exports = {
//   buildBlog,
//   // 테스트용 함수들
//   isMdxFile,
//   slugify,
//   sanitizeMdxContent,
//   isoToMinute,
//   parseDateParts,
// };
