/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");

// ============================================================================
// 상수 정의
// ============================================================================

const CONFIG = {
  // 경로 설정
  OUTPUT_DIR: "dist_ghp",
  APPS_DIR: "apps",

  // 앱별 설정
  APPS: {
    shell: {
      name: "shell",
      distPath: "apps/shell/dist",
      outputPath: "", // 루트에 배치
      skipIndex: false, // index.html 포함
      isMainApp: true, // 메인 앱 (Shell)
    },
    blog: {
      name: "blog",
      distPath: "apps/blog/dist",
      outputPath: "blog",
      skipIndex: true, // index.html 제외
      isMainApp: false,
    },
    portfolio: {
      name: "portfolio",
      distPath: "apps/portfolio/dist",
      outputPath: "portfolio",
      skipIndex: true, // index.html 제외
      isMainApp: false,
    },
    resume: {
      name: "resume",
      distPath: "apps/resume/dist",
      outputPath: "resume",
      skipIndex: true, // index.html 제외
      isMainApp: false,
    },
    home: {
      name: "home",
      distPath: "apps/home/dist",
      outputPath: "", // shell과 같은 경로에 배치
      skipIndex: true, // index.html 제외
      isMainApp: false,
    },
  },

  // GitHub Pages 설정
  REPOSITORY_NAME: "my-blog",
  JEKYLL_DISABLE_FILE: ".nojekyll",

  // 404 페이지 설정
  REDIRECT_404_TEMPLATE: `<!doctype html><meta charset="utf-8">
<script>
  // /{REPO_NAME}로 시작하는 현재 경로를 Shell에 넘긴다
  var base="/{REPO_NAME}";
  var path=location.pathname.startsWith(base)?location.pathname.slice(base.length):location.pathname;
  var to = path + location.search + location.hash;
  location.replace(base + "/?to=" + encodeURIComponent(to || "/"));
</script>`,
};

const ERROR_MESSAGES = {
  DIRECTORY_NOT_FOUND: "디렉토리를 찾을 수 없습니다",
  COPY_FAILED: "파일 복사 실패",
  BUILD_FAILED: "GitHub Pages 수집 실패",
};

// ============================================================================
// 타입 정의 (JSDoc)
// ============================================================================

/**
 * @typedef {Object} AppConfig
 * @property {string} name
 * @property {string} distPath
 * @property {string} outputPath
 * @property {boolean} skipIndex
 * @property {boolean} isMainApp
 */

/**
 * @typedef {Object} CopyOptions
 * @property {boolean} skipIndex
 */

/**
 * @typedef {Object} CollectionResult
 * @property {string[]} collectedApps
 * @property {string[]} skippedApps
 * @property {string} outputPath
 */

// ============================================================================
// 유틸리티 함수들 (순수 함수)
// ============================================================================

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
 * 디렉토리가 존재하는지 확인
 * @param {string} dirPath
 * @returns {boolean}
 */
function directoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

/**
 * 파일이 존재하는지 확인
 * @param {string} filePath
 * @returns {boolean}
 */
function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

// ============================================================================
// 파일 시스템 함수들
// ============================================================================

/**
 * 디렉토리를 재귀적으로 복사
 * @param {string} sourcePath
 * @param {string} targetPath
 * @param {CopyOptions} options
 * @returns {void}
 */
function copyDirectoryRecursively(sourcePath, targetPath, options = {}) {
  const { skipIndex = false } = options;

  ensureDirectory(targetPath);

  const items = fs.readdirSync(sourcePath);

  for (const item of items) {
    // index.html 스킵 옵션 처리
    if (skipIndex && item === "index.html") {
      continue;
    }

    const sourceItemPath = path.join(sourcePath, item);
    const targetItemPath = path.join(targetPath, item);
    const stats = fs.statSync(sourceItemPath);

    if (stats.isDirectory()) {
      copyDirectoryRecursively(sourceItemPath, targetItemPath, options);
    } else {
      fs.copyFileSync(sourceItemPath, targetItemPath);
    }
  }
}

/**
 * 404 페이지 생성 (index.html을 404.html로 복사)
 * @param {string} directoryPath
 * @returns {boolean}
 */
function create404Page(directoryPath) {
  const indexPath = path.join(directoryPath, "index.html");
  const notFoundPath = path.join(directoryPath, "404.html");

  if (fileExists(indexPath)) {
    fs.copyFileSync(indexPath, notFoundPath);
    return true;
  }

  return false;
}

/**
 * Jekyll 비활성화 파일 생성
 * @param {string} directoryPath
 * @returns {void}
 */
function createJekyllDisableFile(directoryPath) {
  const jekyllDisablePath = path.join(
    directoryPath,
    CONFIG.JEKYLL_DISABLE_FILE,
  );
  fs.writeFileSync(jekyllDisablePath, "", "utf8");
}

/**
 * GitHub Pages 404 리다이렉트 페이지 생성
 * @param {string} directoryPath
 * @param {string} repositoryName
 * @returns {void}
 */
function createRedirect404Page(directoryPath, repositoryName) {
  const redirectContent = CONFIG.REDIRECT_404_TEMPLATE.replace(
    /{REPO_NAME}/g,
    repositoryName,
  );

  const redirectPath = path.join(directoryPath, "404.html");
  fs.writeFileSync(redirectPath, redirectContent, "utf8");
}

// ============================================================================
// 앱 처리 함수들
// ============================================================================

/**
 * 앱 빌드 결과물 수집
 * @param {AppConfig} appConfig
 * @param {string} rootPath
 * @param {string} outputPath
 * @returns {boolean}
 */
function collectAppBuild(appConfig, rootPath, outputPath) {
  const sourcePath = path.join(rootPath, appConfig.distPath);

  if (!directoryExists(sourcePath)) {
    console.warn(
      `⚠️  ${appConfig.distPath} not found, skipping ${appConfig.name}`,
    );
    return false;
  }

  const targetPath = appConfig.outputPath
    ? path.join(outputPath, appConfig.outputPath)
    : outputPath;

  try {
    copyDirectoryRecursively(sourcePath, targetPath, {
      skipIndex: appConfig.skipIndex,
    });

    console.log(
      `✓ collected: ${appConfig.name} -> ${appConfig.outputPath || "root"}`,
    );
    return true;
  } catch (error) {
    console.error(`❌ failed to collect ${appConfig.name}:`, error.message);
    return false;
  }
}

/**
 * 모든 앱 빌드 결과물 수집
 * @param {string} rootPath
 * @param {string} outputPath
 * @returns {Object}
 */
function collectAllApps(rootPath, outputPath) {
  const collectedApps = [];
  const skippedApps = [];

  // 메인 앱 (Shell) 먼저 처리
  const mainApp = Object.values(CONFIG.APPS).find((app) => app.isMainApp);
  if (mainApp) {
    const success = collectAppBuild(mainApp, rootPath, outputPath);
    if (success) {
      collectedApps.push(mainApp.name);
    } else {
      skippedApps.push(mainApp.name);
    }
  }

  // 나머지 앱들 처리
  const remoteApps = Object.values(CONFIG.APPS).filter((app) => !app.isMainApp);
  for (const app of remoteApps) {
    const success = collectAppBuild(app, rootPath, outputPath);
    if (success) {
      collectedApps.push(app.name);
    } else {
      skippedApps.push(app.name);
    }
  }

  return { collectedApps, skippedApps };
}

// ============================================================================
// 메인 빌드 함수들
// ============================================================================

/**
 * GitHub Pages 배포용 파일 수집
 * @returns {CollectionResult}
 */
function collectGitHubPagesFiles() {
  const rootPath = process.cwd();
  const outputPath = path.join(rootPath, CONFIG.OUTPUT_DIR);

  try {
    // 출력 디렉토리 정리 및 생성
    cleanDirectory(outputPath);

    // 모든 앱 빌드 결과물 수집
    const { collectedApps, skippedApps } = collectAllApps(rootPath, outputPath);

    // Jekyll 비활성화 파일 생성
    createJekyllDisableFile(outputPath);

    // 404 리다이렉트 페이지 생성
    createRedirect404Page(outputPath, CONFIG.REPOSITORY_NAME);

    console.log(`✓ GitHub Pages files collected to ${CONFIG.OUTPUT_DIR}`);
    console.log(`  - Collected: ${collectedApps.join(", ")}`);
    if (skippedApps.length > 0) {
      console.log(`  - Skipped: ${skippedApps.join(", ")}`);
    }

    return {
      collectedApps,
      skippedApps,
      outputPath: CONFIG.OUTPUT_DIR,
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
    const result = collectGitHubPagesFiles();
    console.log(`\n🎉 GitHub Pages collection completed!`);
    console.log(`   Output: ${result.outputPath}`);
    console.log(
      `   Apps: ${result.collectedApps.length} collected, ${result.skippedApps.length} skipped`,
    );
  } catch (error) {
    console.error("GitHub Pages collection failed:", error.message);
    process.exit(1);
  }
}

module.exports = {
  collectGitHubPagesFiles,
  // 테스트용 함수들
  copyDirectoryRecursively,
  create404Page,
  createJekyllDisableFile,
  createRedirect404Page,
  collectAppBuild,
};
