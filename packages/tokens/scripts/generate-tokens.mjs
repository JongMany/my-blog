/**
 * 통합 토큰 생성기
 * TypeScript 소스에서 semantic 및 Tailwind 토큰 CSS 생성
 *
 * 기능:
 * - Single Source of Truth: TypeScript 정의
 * - 자동 CSS 생성
 * - 타입 안전한 토큰 참조
 */

import path from "path";
import {
  loadConfig,
  ensureDir,
  writeFile,
  loadModule,
  Logger,
} from "./utils/build-utils.mjs";

const config = loadConfig();
const logger = new Logger();

// ============================================================================
// 토큰 생성기 함수들
// ============================================================================

/**
 * 토큰 생성기 모듈 로드
 * @returns {Promise<Object>} 토큰 생성기 함수들
 */
async function loadTokenGenerator() {
  const generator = await loadModule("dist/build/token-generator.js");
  return {
    generateSemanticCSS: generator.generateSemanticCSS,
    generateTailwindThemeCSS: generator.generateTailwindThemeCSS,
    defaultTailwindMappings: generator.defaultTailwindMappings,
  };
}

/**
 * semantic CSS 파일 생성
 * @param {Function} generateSemanticCSS - CSS 생성 함수
 * @returns {Promise<void>}
 */
async function generateSemanticFile(generateSemanticCSS) {
  const task = logger.startTask("semantic.css");
  try {
    const css = generateSemanticCSS();
    const outputPath = path.join(config.outputDir, "semantic.css");
    writeFile(outputPath, css);
    logger.endTask("semantic.css", true);
  } catch (error) {
    logger.endTask("semantic.css", false);
    throw error;
  }
}

/**
 * Tailwind theme CSS 파일 생성
 * @param {Function} generateTailwindThemeCSS - CSS 생성 함수
 * @param {Object} mappings - Tailwind 매핑들
 * @returns {Promise<void>}
 */
async function generateTailwindFile(generateTailwindThemeCSS, mappings) {
  const task = logger.startTask("tailwind-theme.css");
  try {
    const css = generateTailwindThemeCSS(mappings);
    const outputPath = path.join(config.cssOutputDir, "tailwind-theme.css");
    writeFile(outputPath, css);
    logger.endTask("tailwind-theme.css", true);
  } catch (error) {
    logger.endTask("tailwind-theme.css", false);
    throw error;
  }
}

// ============================================================================
// 메인 생성 함수
// ============================================================================

/**
 * 모든 토큰 CSS 파일 생성
 */
async function generateAllTokens() {
  await ensureDir(config.cssOutputDir);

  logger.info("토큰 생성기 로드 중...");
  const generator = await loadTokenGenerator();

  logger.info("semantic 및 Tailwind CSS 생성 중...\n");

  await generateSemanticFile(generator.generateSemanticCSS);
  await generateTailwindFile(
    generator.generateTailwindThemeCSS,
    generator.defaultTailwindMappings,
  );

  logger.summary();
  console.log("🎉 모든 토큰 CSS 파일이 성공적으로 생성되었습니다!");
}

// ============================================================================
// 진입점
// ============================================================================

generateAllTokens().catch((error) => {
  logger.error("토큰 생성 실패", error);
  logger.summary();
  process.exit(1);
});
