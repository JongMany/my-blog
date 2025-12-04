/**
 * 빌드 유틸리티
 * CSS 빌드 스크립트를 위한 공유 유틸리티
 * Vite, Tailwind CSS 등 현대적인 빌드 도구에서 영감을 받음
 */

import { writeFileSync, readFileSync } from "fs";
import { mkdir } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// 설정
// ============================================================================

/**
 * @typedef {Object} BuildConfig
 * @property {string} outputDir - 출력 디렉토리 경로
 * @property {string} cssOutputDir - CSS 출력 디렉토리 경로
 * @property {string} projectRoot - 프로젝트 루트 디렉토리
 */

/**
 * 빌드 설정 로드
 * @returns {BuildConfig}
 */
export function loadConfig() {
  const projectRoot = path.join(__dirname, "../..");
  const tsconfig = JSON.parse(
    readFileSync(path.join(projectRoot, "tsconfig.json"), "utf-8"),
  );
  const outputDir = path.join(projectRoot, tsconfig.compilerOptions.outDir);
  const cssOutputDir = path.join(outputDir, "css");

  return {
    outputDir,
    cssOutputDir,
    projectRoot,
  };
}

// ============================================================================
// 파일 시스템 유틸리티
// ============================================================================

/**
 * 디렉토리가 존재하는지 확인하고 없으면 생성 (에러 핸들링 포함)
 * @param {string} dirPath - 디렉토리 경로
 * @returns {Promise<void>}
 */
export async function ensureDir(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    throw new Error(`디렉토리 생성 실패 ${dirPath}: ${error.message}`);
  }
}

/**
 * 파일 쓰기 (에러 핸들링 및 검증 포함)
 * @param {string} filePath - 파일 경로
 * @param {string} content - 파일 내용
 * @returns {boolean} 성공 여부
 */
export function writeFile(filePath, content) {
  try {
    if (typeof content !== "string") {
      throw new TypeError(
        `내용은 문자열이어야 합니다. 받은 타입: ${typeof content}`,
      );
    }
    writeFileSync(filePath, content, "utf-8");
    return true;
  } catch (error) {
    throw new Error(`파일 쓰기 실패 ${filePath}: ${error.message}`);
  }
}

/**
 * 컴파일된 모듈 로드 (더 나은 에러 메시지 포함)
 * @param {string} modulePath - 모듈 경로 (dist 기준 상대 경로)
 * @returns {Promise<any>}
 */
export async function loadModule(modulePath) {
  try {
    const fullPath = path.isAbsolute(modulePath)
      ? modulePath
      : path.join(__dirname, "../..", modulePath);
    return await import(fullPath);
  } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND") {
      throw new Error(
        `모듈을 찾을 수 없습니다: ${modulePath}\n` +
          "💡 TypeScript를 먼저 빌드하세요: pnpm build (CSS 생성 없이)",
      );
    }
    throw new Error(`모듈 로드 실패 ${modulePath}: ${error.message}`);
  }
}

// ============================================================================
// 로깅 유틸리티
// ============================================================================

/**
 * 타이밍 및 구조화된 출력을 포함한 로거
 */
export class Logger {
  constructor() {
    this.startTime = Date.now();
    this.tasks = [];
  }

  /**
   * 작업 시작 로그
   * @param {string} name - 작업 이름
   */
  startTask(name) {
    const task = { name, startTime: Date.now() };
    this.tasks.push(task);
    return task;
  }

  /**
   * 작업 완료 로그
   * @param {string} name - 작업 이름
   * @param {boolean} success - 성공 여부
   */
  endTask(name, success = true) {
    const task = this.tasks.find((t) => t.name === name);
    if (task) {
      const duration = Date.now() - task.startTime;
      const icon = success ? "✅" : "❌";
      console.log(`${icon} ${name} (${duration}ms)`);
      task.duration = duration;
      task.success = success;
    }
  }

  /**
   * 정보 메시지 로그
   * @param {string} message - 메시지
   */
  info(message) {
    console.log(`ℹ️  ${message}`);
  }

  /**
   * 경고 메시지 로그
   * @param {string} message - 메시지
   */
  warn(message) {
    console.warn(`⚠️  ${message}`);
  }

  /**
   * 에러 메시지 로그
   * @param {string} message - 메시지
   * @param {Error} [error] - 에러 객체
   */
  error(message, error = null) {
    console.error(`❌ ${message}`);
    if (error) {
      console.error(error.stack || error.message);
    }
  }

  /**
   * 요약 로그
   */
  summary() {
    const totalTime = Date.now() - this.startTime;
    const successful = this.tasks.filter((t) => t.success).length;
    const failed = this.tasks.filter((t) => !t.success).length;

    console.log("\n" + "=".repeat(50));
    console.log(`📊 빌드 요약`);
    console.log(`   전체 작업: ${this.tasks.length}`);
    console.log(`   ✅ 성공: ${successful}`);
    if (failed > 0) {
      console.log(`   ❌ 실패: ${failed}`);
    }
    console.log(`   ⏱️  총 시간: ${totalTime}ms`);
    console.log("=".repeat(50) + "\n");
  }
}

// ============================================================================
// 빌드 파이프라인 유틸리티
// ============================================================================

/**
 * 실행 시간 측정
 * @param {string} label - 타이밍 레이블
 * @param {() => Promise<void>} fn - 측정할 함수
 * @returns {Promise<void>}
 */
export async function measureTime(label, fn) {
  const start = Date.now();
  try {
    await fn();
    const duration = Date.now() - start;
    console.log(`⏱️  ${label}: ${duration}ms`);
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`❌ ${label} 실패 (${duration}ms 후):`, error);
    throw error;
  }
}
