/**
 * 통합 CSS 빌드 스크립트
 * TypeScript 소스에서 모든 CSS 파일 생성
 *
 * 기능:
 * - 독립적인 작업의 병렬 실행
 * - 순차 작업의 의존성 해결
 * - 타이밍을 포함한 구조화된 로깅
 * - 모듈화된 생성기 함수들
 */

import { loadConfig, Logger } from "./utils/build-utils.mjs";
import { executeTasks } from "./utils/task-executor.mjs";
import * as generators from "./generators/index.mjs";

const config = loadConfig();

// ============================================================================
// 빌드 작업 정의
// ============================================================================

/**
 * 의존성 및 실행 모드를 포함한 모든 빌드 작업 정의
 */
function createBuildTasks() {
  return [
    // Primitive 토큰 (병렬 실행 가능)
    {
      name: "spacing",
      fn: () => generators.generateSpacingCSS(config),
      parallel: true,
    },
    {
      name: "radius",
      fn: () => generators.generateRadiusCSS(config),
      parallel: true,
    },
    {
      name: "typography",
      fn: () => generators.generateTypographyCSS(config),
      parallel: true,
    },
    {
      name: "scaling",
      fn: () => generators.generateScalingCSS(config),
      parallel: true,
    },
    {
      name: "cursor",
      fn: () => generators.generateCursorCSS(config),
      parallel: true,
    },
    {
      name: "shadow",
      fn: () => generators.generateShadowCSS(config),
      parallel: true,
    },
    // 집계 파일 (primitive 이후에 실행되어야 함)
    {
      name: "base",
      fn: () => generators.generateBaseCSS(config),
      deps: ["spacing", "radius", "typography", "scaling", "cursor", "shadow"],
      parallel: false,
    },
    {
      name: "index",
      fn: () => generators.generateIndexCSS(config),
      deps: ["base"],
      parallel: false,
    },
  ];
}

// ============================================================================
// 메인 빌드 함수
// ============================================================================

/**
 * 병렬 실행 및 의존성 해결을 포함한 모든 CSS 파일 빌드
 */
async function buildAllCSS() {
  const logger = new Logger();
  logger.info("CSS 빌드 프로세스 시작...\n");

  const tasks = createBuildTasks();

  try {
    await executeTasks(tasks, logger);
    logger.summary();
    console.log("🎉 모든 CSS 파일이 성공적으로 빌드되었습니다!");
  } catch (error) {
    logger.error("빌드 실패", error);
    logger.summary();
    process.exit(1);
  }
}

// 빌드 실행
buildAllCSS();
