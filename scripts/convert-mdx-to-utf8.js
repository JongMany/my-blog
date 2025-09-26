/* eslint-disable no-console */
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const iconv = require("iconv-lite");
const chardet = require("chardet");

// ============================================================================
// 상수 정의
// ============================================================================

const CONFIG = {
  // 경로 설정
  TARGET_DIR: "apps/blog/content/blog",

  // 파일 확장자
  MDX_EXTENSIONS: [".md", ".mdx"],

  // 인코딩 설정
  TARGET_ENCODING: "utf8",
  BROKEN_UTF8_MARKER: "\uFFFD", // U+FFFD () - 깨진 UTF-8 문자

  // 인코딩 후보 목록
  ENCODING_CANDIDATES: {
    PRIMARY: ["CP949", "EUC-KR", "WINDOWS-1252"],
    FALLBACK: ["ISO-8859-1", "ASCII"],
  },

  // Git 명령어
  GIT_STAGED_FILES_CMD: "git diff --cached --name-only --diff-filter=ACM",
};

const ERROR_MESSAGES = {
  FILE_NOT_FOUND: "파일을 찾을 수 없습니다",
  ENCODING_DETECTION_FAILED: "인코딩 감지 실패",
  CONVERSION_FAILED: "인코딩 변환 실패",
  GIT_COMMAND_FAILED: "Git 명령어 실행 실패",
};

// ============================================================================
// 타입 정의 (JSDoc)
// ============================================================================

/**
 * @typedef {Object} ConversionResult
 * @property {boolean} changed
 * @property {string} [from]
 * @property {boolean} [failed]
 * @property {string} [guess]
 */

/**
 * @typedef {Object} ProcessResult
 * @property {number} totalFiles
 * @property {number} convertedFiles
 * @property {number} failedFiles
 * @property {string[]} convertedList
 * @property {string[]} failedList
 */

// ============================================================================
// 유틸리티 함수들 (순수 함수)
// ============================================================================

/**
 * 파일 확장자가 MDX 파일인지 확인
 * @param {string} filename
 * @returns {boolean}
 */
function isMdxFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return CONFIG.MDX_EXTENSIONS.includes(ext);
}

/**
 * 파일 경로가 타겟 디렉토리 내에 있는지 확인
 * @param {string} filePath
 * @param {string} targetDir
 * @returns {boolean}
 */
function isInTargetDirectory(filePath, targetDir) {
  return filePath.startsWith(targetDir + "/");
}

/**
 * 파일이 존재하는지 확인
 * @param {string} filePath
 * @returns {boolean}
 */
function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isFile();
}

/**
 * UTF-8 텍스트가 깨져있는지 확인
 * @param {string} text
 * @returns {boolean}
 */
function hasBrokenUtf8Characters(text) {
  return text.includes(CONFIG.BROKEN_UTF8_MARKER);
}

// ============================================================================
// Git 관련 함수들
// ============================================================================

/**
 * Git staged 파일 목록을 가져옵니다
 * @returns {string[]}
 */
function getStagedFiles() {
  try {
    const output = execSync(CONFIG.GIT_STAGED_FILES_CMD, {
      stdio: ["ignore", "pipe", "ignore"],
      encoding: "utf8",
    });

    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (error) {
    console.error(`${ERROR_MESSAGES.GIT_COMMAND_FAILED}:`, error.message);
    return [];
  }
}

/**
 * 타겟 디렉토리 내의 staged MDX 파일들을 필터링합니다
 * @param {string} targetDir
 * @returns {string[]}
 */
function getStagedMdxFiles(targetDir) {
  const stagedFiles = getStagedFiles();

  return stagedFiles.filter((filePath) => {
    return isMdxFile(filePath) && isInTargetDirectory(filePath, targetDir);
  });
}

// ============================================================================
// 인코딩 관련 함수들
// ============================================================================

/**
 * 파일의 인코딩을 감지합니다
 * @param {Buffer} buffer
 * @returns {string|null}
 */
function detectFileEncoding(buffer) {
  try {
    const detected = chardet.detect(buffer);
    return detected ? detected.toString().toUpperCase() : null;
  } catch (error) {
    console.warn(`${ERROR_MESSAGES.ENCODING_DETECTION_FAILED}:`, error.message);
    return null;
  }
}

/**
 * 인코딩 후보 목록을 생성합니다
 * @param {string|null} detectedEncoding
 * @returns {string[]}
 */
function createEncodingCandidates(detectedEncoding) {
  const candidates = [];

  // 감지된 인코딩을 우선순위로 추가
  if (detectedEncoding) {
    candidates.push(detectedEncoding);
  }

  // 주요 후보들 추가
  candidates.push(...CONFIG.ENCODING_CANDIDATES.PRIMARY);

  // 중복 제거
  return [...new Set(candidates)];
}

/**
 * 버퍼를 지정된 인코딩으로 디코딩을 시도합니다
 * @param {Buffer} buffer
 * @param {string} encoding
 * @returns {string|null}
 */
function tryDecodeBuffer(buffer, encoding) {
  try {
    const decoded = iconv.decode(buffer, encoding);

    // 깨진 UTF-8 문자가 없으면 성공
    if (!hasBrokenUtf8Characters(decoded)) {
      return decoded;
    }
  } catch (error) {
    // 인코딩 실패는 무시하고 다음 후보 시도
  }

  return null;
}

/**
 * 파일을 UTF-8로 변환합니다
 * @param {string} filePath
 * @returns {ConversionResult}
 */
function convertFileToUtf8(filePath) {
  if (!fileExists(filePath)) {
    return { changed: false, failed: true };
  }

  const buffer = fs.readFileSync(filePath);

  // 1단계: UTF-8로 직접 읽기 시도
  let text = buffer.toString(CONFIG.TARGET_ENCODING);
  if (!hasBrokenUtf8Characters(text)) {
    return { changed: false };
  }

  // 2단계: 인코딩 감지 후 재디코딩 시도
  const detectedEncoding = detectFileEncoding(buffer);
  const encodingCandidates = createEncodingCandidates(detectedEncoding);

  for (const encoding of encodingCandidates) {
    const decodedText = tryDecodeBuffer(buffer, encoding);

    if (decodedText) {
      // 성공적으로 디코딩된 경우 UTF-8로 저장
      fs.writeFileSync(filePath, decodedText, {
        encoding: CONFIG.TARGET_ENCODING,
      });
      return { changed: true, from: encoding };
    }
  }

  // 모든 시도가 실패한 경우
  return {
    changed: false,
    failed: true,
    guess: detectedEncoding || "unknown",
  };
}

// ============================================================================
// 메인 처리 함수들
// ============================================================================

/**
 * 단일 파일 변환을 처리합니다
 * @param {string} relativePath
 * @param {string} rootPath
 * @returns {Object}
 */
function processFileConversion(relativePath, rootPath) {
  const absolutePath = path.join(rootPath, relativePath);

  if (!fileExists(absolutePath)) {
    return {
      success: false,
      reason: "file_not_found",
      message: `${ERROR_MESSAGES.FILE_NOT_FOUND}: ${relativePath}`,
    };
  }

  const result = convertFileToUtf8(absolutePath);

  if (result.failed) {
    return {
      success: false,
      reason: "conversion_failed",
      message: `${ERROR_MESSAGES.CONVERSION_FAILED}: ${relativePath} (guess=${result.guess})`,
    };
  }

  if (result.changed) {
    return {
      success: true,
      changed: true,
      message: `converted -> ${relativePath} (from ${result.from})`,
    };
  }

  return {
    success: true,
    changed: false,
    message: `no conversion needed: ${relativePath}`,
  };
}

/**
 * 모든 staged MDX 파일들을 변환합니다
 * @returns {ProcessResult}
 */
function convertStagedMdxFiles() {
  const rootPath = process.cwd();
  const targetDir = CONFIG.TARGET_DIR;

  // staged MDX 파일 목록 가져오기
  const stagedFiles = getStagedMdxFiles(targetDir);

  if (stagedFiles.length === 0) {
    console.log(`[utf8] no md/mdx files staged under ${targetDir}`);
    return {
      totalFiles: 0,
      convertedFiles: 0,
      failedFiles: 0,
      convertedList: [],
      failedList: [],
    };
  }

  const convertedList = [];
  const failedList = [];
  let convertedCount = 0;
  let failedCount = 0;

  // 각 파일 처리
  for (const relativePath of stagedFiles) {
    const result = processFileConversion(relativePath, rootPath);

    if (result.success) {
      if (result.changed) {
        convertedList.push(relativePath);
        convertedCount++;
        console.log(`[utf8] ${result.message}`);
      }
    } else {
      failedList.push(relativePath);
      failedCount++;
      console.warn(`[utf8] WARN: ${result.message}`);
    }
  }

  return {
    totalFiles: stagedFiles.length,
    convertedFiles: convertedCount,
    failedFiles: failedCount,
    convertedList,
    failedList,
  };
}

// ============================================================================
// 실행
// ============================================================================

if (require.main === module) {
  try {
    const result = convertStagedMdxFiles();

    if (result.totalFiles === 0) {
      process.exit(0);
    }

    console.log(
      `[utf8] done, converted ${result.convertedFiles}/${result.totalFiles}`,
    );

    if (result.failedFiles > 0) {
      console.warn(
        `[utf8] warning: ${result.failedFiles} files failed to convert`,
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("[utf8] error:", error.message);
    process.exit(1);
  }
}

module.exports = {
  convertStagedMdxFiles,
  // 테스트용 함수들
  isMdxFile,
  isInTargetDirectory,
  fileExists,
  hasBrokenUtf8Characters,
  getStagedFiles,
  getStagedMdxFiles,
  detectFileEncoding,
  createEncodingCandidates,
  tryDecodeBuffer,
  convertFileToUtf8,
  processFileConversion,
};
