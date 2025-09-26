/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const { execSync } = require("node:child_process");
const chardet = require("chardet");
const iconv = require("iconv-lite");
const crypto = require("crypto");

// ============================================================================
// 상수 정의
// ============================================================================

const CONFIG = {
  // 경로 설정
  SRC_DIR: "apps/portfolio/content/projects",
  OUT_DIR: "apps/portfolio/public/_portfolio",
  PROJECTS_DIR: "projects",
  ASSETS_DIR: "assets",
  THUMBNAILS_DIR: "projects/thumbnails",

  // 파일 확장자
  MDX_EXTENSIONS: /\.mdx?$/i,

  // 인코딩 설정
  DEFAULT_ENCODING: "UTF-8",
  FALLBACK_ENCODINGS: ["CP949", "EUC-KR", "WINDOWS-1252"],

  // Git 설정
  GIT_DATE_FORMATS: {
    created: "git log --diff-filter=A --follow --format=%aI -1 -- ",
    updated: "git log --follow --format=%aI -1 -- ",
  },
  GIT_REV_FORMAT: "git log -1 --format=%h -- ",
  GIT_TIMESTAMP_FORMAT: "git log -1 --format=%ct -- ",

  // 정렬 설정
  SORT_ORDER: "desc", // 최신순
  DEFAULT_ORDER: 0, // order 필드가 없을 때 기본값
};

const ERROR_MESSAGES = {
  FILE_NOT_FOUND: "파일을 찾을 수 없습니다",
  INVALID_ENCODING: "인코딩을 감지할 수 없습니다",
  GIT_COMMAND_FAILED: "Git 명령어 실행 실패",
  ASSET_COPY_FAILED: "자산 파일 복사 실패",
  BUILD_FAILED: "빌드 실패",
};

// ============================================================================
// 타입 정의 (JSDoc)
// ============================================================================

/**
 * @typedef {Object} DateParts
 * @property {number} y - year
 * @property {number} m - month
 * @property {number} d - day
 * @property {number} hh - hour
 * @property {number} mm - minute
 * @property {string} tz - timezone
 */

/**
 * @typedef {Object} ProjectMeta
 * @property {string} title
 * @property {string} summary
 * @property {string|null} project
 * @property {string[]} tags
 * @property {string} date
 * @property {number|null} order
 * @property {string|null} cover
 * @property {string} coverAlt
 * @property {string} coverCaption
 * @property {string|null} coverType
 * @property {string} coverAspectRatio
 * @property {string} slug
 * @property {string} path
 * @property {number} createdAtMs
 */

/**
 * @typedef {Object} PortfolioIndex
 * @property {string[]} projects
 * @property {Record<string, ProjectMeta[]>} byProject
 * @property {ProjectMeta[]} all
 */

/**
 * @typedef {Object} BuildResult
 * @property {PortfolioIndex} index
 * @property {number} projectCount
 * @property {number} projectGroupCount
 */

// ============================================================================
// 유틸리티 함수들 (순수 함수)
// ============================================================================

/**
 * 파일 확장자가 MDX인지 확인
 * @param {string} filename
 * @returns {boolean}
 */
function isMdxFile(filename) {
  return CONFIG.MDX_EXTENSIONS.test(filename);
}

/**
 * 안전한 디렉토리 생성
 * @param {string} dirPath
 * @returns {void}
 */
function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * 디렉토리 정리 (기존 내용 삭제 후 재생성)
 * @param {string} dirPath
 * @returns {void}
 */
function cleanDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
  fs.mkdirSync(dirPath, { recursive: true });
}

/**
 * 파일명을 안전한 slug로 변환
 * @param {string} name
 * @returns {string}
 */
function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

/**
 * 파일 내용의 해시값 생성 (12자리)
 * @param {string} filePath
 * @returns {string}
 */
function getContentHash(filePath) {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash("sha1").update(buffer).digest("hex").slice(0, 12);
}

/**
 * UTF-8이 아닌 텍스트를 감지
 * @param {string} text
 * @returns {boolean}
 */
function hasBrokenUtf8(text) {
  return text.includes("\uFFFD");
}

// ============================================================================
// 인코딩 처리 함수들
// ============================================================================

/**
 * 파일의 인코딩을 자동 감지
 * @param {string} filePath
 * @returns {string}
 */
function detectEncoding(filePath) {
  const buffer = fs.readFileSync(filePath);
  return chardet.detect(buffer) || CONFIG.DEFAULT_ENCODING;
}

/**
 * 파일을 UTF-8로 읽기
 * @param {string} filePath
 * @returns {string}
 */
function readTextFile(filePath) {
  const buffer = fs.readFileSync(filePath);
  const encoding = detectEncoding(filePath);

  try {
    const text = iconv.decode(buffer, encoding);
    if (!hasBrokenUtf8(text)) {
      return text;
    }
  } catch (error) {
    console.warn(`인코딩 변환 실패 (${encoding}): ${filePath}`);
  }

  // fallback: UTF-8로 직접 읽기
  return buffer.toString("utf8");
}

/**
 * MDX 내용 정리 (BOM 제거, 개행 정규화 등)
 * @param {string} content
 * @returns {string}
 */
function sanitizeMdxContent(content) {
  return content
    .replace(/^\uFEFF/, "") // BOM 제거
    .replace(/\r\n/g, "\n") // CRLF → LF
    .replace(/{{/g, "\\{\\{") // 템플릿 더블 중괄호 방어
    .replace(/}}/g, "\\}\\}");
}

// ============================================================================
// Git 관련 함수들
// ============================================================================

/**
 * Git 명령어 실행 (안전한 실행)
 * @param {string} command
 * @param {string} filePath
 * @returns {string|null}
 */
function executeGitCommand(command, filePath) {
  try {
    const relativePath = path.relative(process.cwd(), filePath);
    const fullCommand = command + JSON.stringify(relativePath);

    const result = execSync(fullCommand, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    }).trim();

    return result || null;
  } catch (error) {
    return null;
  }
}

/**
 * 파일의 Git 생성일 가져오기
 * @param {string} filePath
 * @returns {string|null}
 */
function getGitCreatedDate(filePath) {
  return executeGitCommand(CONFIG.GIT_DATE_FORMATS.created, filePath);
}

/**
 * 파일의 Git 수정일 가져오기
 * @param {string} filePath
 * @returns {string|null}
 */
function getGitUpdatedDate(filePath) {
  return executeGitCommand(CONFIG.GIT_DATE_FORMATS.updated, filePath);
}

/**
 * 파일의 Git 커밋 해시 가져오기
 * @param {string} filePath
 * @returns {string|null}
 */
function getGitCommitHash(filePath) {
  return executeGitCommand(CONFIG.GIT_REV_FORMAT, filePath);
}

/**
 * 파일의 Git 커밋 타임스탬프 가져오기
 * @param {string} filePath
 * @returns {string|null}
 */
function getGitCommitTimestamp(filePath) {
  return executeGitCommand(CONFIG.GIT_TIMESTAMP_FORMAT, filePath);
}

// ============================================================================
// 날짜 처리 함수들
// ============================================================================

/**
 * 밀리초를 ISO 문자열로 변환
 * @param {number} milliseconds
 * @returns {string}
 */
function millisecondsToIso(milliseconds) {
  return new Date(milliseconds).toISOString();
}

/**
 * ISO 문자열을 분 단위로 변환 (초 제거)
 * @param {string} isoString
 * @returns {string}
 */
function isoToMinute(isoString) {
  const match = String(isoString).match(
    /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  );

  if (match) {
    return match[1] + match[2];
  }

  // fallback: Date 객체로 파싱
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return String(isoString);
  }

  const pad = (n) => String(n).padStart(2, "0");
  const timezoneOffset = -date.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const abs = Math.abs(timezoneOffset);
  const hours = pad(Math.floor(abs / 60));
  const minutes = pad(abs % 60);

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}${sign}${hours}:${minutes}`
  );
}

/**
 * ISO 문자열을 날짜 파트로 분해
 * @param {string} isoString
 * @returns {DateParts|null}
 */
function parseDateParts(isoString) {
  const match = String(isoString).match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/,
  );

  if (!match) {
    return null;
  }

  return {
    y: parseInt(match[1], 10),
    m: parseInt(match[2], 10),
    d: parseInt(match[3], 10),
    hh: parseInt(match[4], 10),
    mm: parseInt(match[5], 10),
    tz: match[6],
  };
}

// ============================================================================
// 자산 처리 함수들
// ============================================================================

/**
 * 자산 파일의 스탬프 생성
 * @param {string} filePath
 * @returns {string}
 */
function generateAssetStamp(filePath) {
  const gitTimestamp = getGitCommitTimestamp(filePath);
  const gitHash = getGitCommitHash(filePath);

  if (gitTimestamp && gitHash) {
    return `${gitTimestamp}-${gitHash}`;
  }

  const contentHash = getContentHash(filePath);
  if (contentHash) {
    return contentHash;
  }

  const stats = fs.statSync(filePath);
  return Math.floor(stats.mtimeMs / 1000).toString();
}

/**
 * 자산 파일을 안전한 이름으로 변환
 * @param {string} filePath
 * @returns {string}
 */
function generateAssetFilename(filePath) {
  const { name, ext } = path.parse(filePath);
  const stamp = generateAssetStamp(filePath);
  const safeName = slugify(name);

  return `${safeName}__${stamp}${ext}`;
}

/**
 * 자산 파일 복사 (중복 방지)
 * @param {string} sourcePath
 * @param {string} targetDir
 * @param {Map<string, string>} cache
 * @returns {string|null}
 */
function copyAsset(sourcePath, targetDir, cache) {
  if (!fs.existsSync(sourcePath)) {
    return null;
  }

  if (cache.has(sourcePath)) {
    return cache.get(sourcePath);
  }

  ensureDirectory(targetDir);
  const filename = generateAssetFilename(sourcePath);
  const targetPath = path.join(targetDir, filename);

  if (!fs.existsSync(targetPath)) {
    fs.copyFileSync(sourcePath, targetPath);
  }

  const url = `/_portfolio/assets/${filename}`;
  cache.set(sourcePath, url);
  return url;
}

/**
 * 썸네일 경로 처리 (public 폴더 기준)
 * @param {string} thumbnailPath
 * @param {string} root
 * @returns {string|null}
 */
function processThumbnailPath(thumbnailPath, root) {
  if (!thumbnailPath.startsWith(`/${CONFIG.THUMBNAILS_DIR}/`)) {
    return null;
  }

  const publicPath = path.join(root, "apps/portfolio/public", thumbnailPath);
  return fs.existsSync(publicPath) ? thumbnailPath : null;
}

/**
 * MDX 내용의 이미지 경로를 자산 URL로 변환
 * @param {string} content
 * @param {string} projectPath
 * @param {string} assetsDir
 * @param {Map<string, string>} assetCache
 * @param {string} root
 * @returns {string}
 */
function transformImagePaths(
  content,
  projectPath,
  assetsDir,
  assetCache,
  root,
) {
  let transformed = content;

  // Markdown 이미지: ![alt](href "title")
  transformed = transformed.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g,
    (match, alt, href) => {
      // 외부 URL은 그대로 유지
      if (/^https?:\/\//i.test(href)) {
        return match;
      }

      // 이미 변환된 경로는 그대로 유지
      if (href.startsWith("/_portfolio/assets/")) {
        return match;
      }

      // 썸네일 경로 처리
      if (href.startsWith(`/${CONFIG.THUMBNAILS_DIR}/`)) {
        const thumbnailUrl = processThumbnailPath(href, root);
        return thumbnailUrl ? `![${alt}](${thumbnailUrl})` : match;
      }

      // 상대 경로를 절대 경로로 변환
      const candidate = href.startsWith("/_portfolio/")
        ? href.replace(/^\/_portfolio\//, "")
        : href;

      const sourcePath = path.resolve(path.dirname(projectPath), candidate);
      const assetUrl = copyAsset(sourcePath, assetsDir, assetCache);

      return assetUrl ? `![${alt}](${assetUrl})` : match;
    },
  );

  // HTML 이미지: <img src="...">
  transformed = transformed.replace(
    /<img\s+[^>]*src="([^"]+)"[^>]*>/gi,
    (match, src) => {
      if (/^https?:\/\//i.test(src) || src.startsWith("/_portfolio/assets/")) {
        return match;
      }

      // 썸네일 경로 처리
      if (src.startsWith(`/${CONFIG.THUMBNAILS_DIR}/`)) {
        const thumbnailUrl = processThumbnailPath(src, root);
        return thumbnailUrl ? match.replace(src, thumbnailUrl) : match;
      }

      const candidate = src.startsWith("/_portfolio/")
        ? src.replace(/^\/_portfolio\//, "")
        : src;

      const sourcePath = path.resolve(path.dirname(projectPath), candidate);
      const assetUrl = copyAsset(sourcePath, assetsDir, assetCache);

      return assetUrl ? match.replace(src, assetUrl) : match;
    },
  );

  return transformed;
}

// ============================================================================
// 프로젝트 처리 함수들
// ============================================================================

/**
 * 프로젝트의 커버 이미지 URL 생성
 * @param {Object} frontmatter
 * @param {string} content
 * @param {string} projectPath
 * @param {string} assetsDir
 * @param {Map<string, string>} assetCache
 * @param {string} root
 * @returns {string|null}
 */
function generateCoverUrl(
  frontmatter,
  content,
  projectPath,
  assetsDir,
  assetCache,
  root,
) {
  const { cover } = frontmatter;

  if (!cover) {
    return null;
  }

  // 외부 URL 또는 이미 변환된 경로
  if (/^https?:\/\//i.test(cover) || cover.startsWith("/_portfolio/assets/")) {
    return cover;
  }

  // 자동 감지: 첫 번째 이미지 사용
  if (cover === "auto") {
    const imageMatch = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/);
    if (imageMatch) {
      const href = imageMatch[1];
      if (/^https?:\/\//i.test(href)) {
        return href;
      }

      // 썸네일 경로 처리
      if (href.startsWith(`/${CONFIG.THUMBNAILS_DIR}/`)) {
        return processThumbnailPath(href, root);
      }

      const candidate = href.startsWith("/_portfolio/")
        ? href.replace(/^\/_portfolio\//, "")
        : href;

      const sourcePath = path.resolve(path.dirname(projectPath), candidate);
      return copyAsset(sourcePath, assetsDir, assetCache);
    }
    return null;
  }

  // 썸네일 경로 처리
  if (cover.startsWith(`/${CONFIG.THUMBNAILS_DIR}/`)) {
    return processThumbnailPath(cover, root);
  }

  // 상대 경로 처리
  const candidate = cover.startsWith("/_portfolio/")
    ? cover.replace(/^\/_portfolio\//, "")
    : cover;

  const sourcePath = path.resolve(path.dirname(projectPath), candidate);
  return copyAsset(sourcePath, assetsDir, assetCache);
}

/**
 * 프로젝트 메타데이터 생성
 * @param {Object} frontmatter
 * @param {string} content
 * @param {string} projectPath
 * @param {string} slug
 * @param {string} assetsDir
 * @param {Map<string, string>} assetCache
 * @param {string} root
 * @returns {ProjectMeta}
 */
function createProjectMeta(
  frontmatter,
  content,
  projectPath,
  slug,
  assetsDir,
  assetCache,
  root,
) {
  const stats = fs.statSync(projectPath);

  // 날짜 정보 생성
  const createdIso =
    frontmatter.date ||
    getGitCreatedDate(projectPath) ||
    millisecondsToIso(stats.ctimeMs);

  const updatedIso =
    frontmatter.updatedAt ||
    getGitUpdatedDate(projectPath) ||
    millisecondsToIso(stats.mtimeMs);

  // 파생 필드들
  const createdMinute = isoToMinute(createdIso);
  const updatedMinute = isoToMinute(updatedIso);
  const createdParts = parseDateParts(createdIso);
  const updatedParts = parseDateParts(updatedIso);
  const createdAtMs = Date.parse(createdIso);
  const updatedAtMs = Date.parse(updatedIso);

  // 커버 이미지 URL
  const coverUrl = generateCoverUrl(
    frontmatter,
    content,
    projectPath,
    assetsDir,
    assetCache,
    root,
  );

  return {
    title: frontmatter.title || slug,
    summary: frontmatter.summary || "",
    project: frontmatter.project || null,
    tags: frontmatter.tags || [],
    date: createdIso,
    order: frontmatter.order ?? null,
    cover: coverUrl,
    coverAlt: frontmatter.coverAlt || "",
    coverCaption: frontmatter.coverCaption || "",
    coverType: frontmatter.coverType || null,
    coverAspectRatio: String(frontmatter.coverAspectRatio || "16:9"),
    slug,
    path: `/_portfolio/projects/${slug}.mdx`,
    createdAtMs,
  };
}

/**
 * 프로젝트 파일 처리
 * @param {string} projectPath
 * @param {string} projectsDir
 * @param {string} assetsDir
 * @param {Map<string, string>} assetCache
 * @param {string} root
 * @returns {ProjectMeta}
 */
function processProjectFile(
  projectPath,
  projectsDir,
  assetsDir,
  assetCache,
  root,
) {
  const rawContent = readTextFile(projectPath);
  const { data: frontmatter, content } = matter(rawContent);

  const slug = (
    frontmatter.slug || path.basename(projectPath, path.extname(projectPath))
  ).toLowerCase();

  // 메타데이터 생성
  const meta = createProjectMeta(
    frontmatter,
    content,
    projectPath,
    slug,
    assetsDir,
    assetCache,
    root,
  );

  // 콘텐츠 변환 및 저장
  const transformedContent = sanitizeMdxContent(
    transformImagePaths(content, projectPath, assetsDir, assetCache, root),
  );

  const outputFilename = `${slug}.mdx`;
  const outputPath = path.join(projectsDir, outputFilename);

  fs.writeFileSync(outputPath, transformedContent, "utf8");

  return meta;
}

// ============================================================================
// 메인 빌드 함수들
// ============================================================================

/**
 * 프로젝트 파일들 처리
 * @param {string} srcDir
 * @param {string} projectsDir
 * @param {string} assetsDir
 * @param {string} root
 * @returns {Object}
 */
function processProjects(srcDir, projectsDir, assetsDir, root) {
  const projects = {};
  const allProjects = [];
  const assetCache = new Map();

  const files = fs.readdirSync(srcDir).filter(isMdxFile);

  for (const file of files) {
    const projectPath = path.join(srcDir, file);
    const meta = processProjectFile(
      projectPath,
      projectsDir,
      assetsDir,
      assetCache,
      root,
    );

    // 프로젝트별 그룹핑
    const projectName = meta.project || "기타";
    (projects[projectName] ||= []).push(meta);
    allProjects.push(meta);
  }

  return { projects, allProjects };
}

/**
 * 프로젝트 정렬 (order 필드 우선, 날짜 순)
 * @param {ProjectMeta[]} projects
 * @returns {ProjectMeta[]}
 */
function sortProjects(projects) {
  return [...projects].sort((a, b) => {
    const orderA = a.order ?? CONFIG.DEFAULT_ORDER;
    const orderB = b.order ?? CONFIG.DEFAULT_ORDER;

    // order가 다르면 order 기준으로 정렬 (높을수록 앞에)
    if (orderA !== orderB) {
      return orderB - orderA;
    }

    // order가 같으면 날짜순 (최신이 앞)
    return (b.createdAtMs ?? 0) - (a.createdAtMs ?? 0);
  });
}

/**
 * 포트폴리오 인덱스 생성
 * @param {Object} projects
 * @param {ProjectMeta[]} allProjects
 * @returns {PortfolioIndex}
 */
function createPortfolioIndex(projects, allProjects) {
  const sortedProjects = sortProjects(allProjects);
  const sortedProjectGroups = {};

  // 프로젝트별 정렬
  for (const [projectName, projectList] of Object.entries(projects)) {
    sortedProjectGroups[projectName] = sortProjects(projectList);
  }

  return {
    projects: Object.keys(sortedProjectGroups).sort(),
    byProject: sortedProjectGroups,
    all: sortedProjects,
  };
}

/**
 * 메인 빌드 함수
 * @returns {BuildResult}
 */
function buildPortfolio() {
  const root = process.cwd();
  const srcDir = path.join(root, CONFIG.SRC_DIR);
  const outDir = path.join(root, CONFIG.OUT_DIR);
  const projectsDir = path.join(outDir, CONFIG.PROJECTS_DIR);
  const assetsDir = path.join(outDir, CONFIG.ASSETS_DIR);

  try {
    // 디렉토리 정리 및 생성
    cleanDirectory(outDir);
    ensureDirectory(projectsDir);
    ensureDirectory(assetsDir);

    // 프로젝트 파일들 처리
    const { projects, allProjects } = processProjects(
      srcDir,
      projectsDir,
      assetsDir,
      root,
    );

    // 인덱스 생성
    const index = createPortfolioIndex(projects, allProjects);

    // 인덱스 파일 저장
    const indexPath = path.join(outDir, "index.json");
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2), "utf8");

    return {
      index,
      projectCount: allProjects.length,
      projectGroupCount: Object.keys(projects).length,
    };
  } catch (error) {
    console.error(`${ERROR_MESSAGES.BUILD_FAILED}:`, error.message);
    throw error;
  }
}

// ============================================================================
// 실행
// ============================================================================

if (require.main === module) {
  try {
    const result = buildPortfolio();
    console.log(
      `[portfolio] built: ${result.projectCount} projects in ${result.projectGroupCount} project groups -> ${CONFIG.OUT_DIR}`,
    );
  } catch (error) {
    console.error("빌드 실패:", error.message);
    process.exit(1);
  }
}

module.exports = {
  buildPortfolio,
  // 테스트용 함수들
  isMdxFile,
  slugify,
  sanitizeMdxContent,
  isoToMinute,
  parseDateParts,
  sortProjects,
};
