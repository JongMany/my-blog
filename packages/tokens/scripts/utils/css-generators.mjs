/**
 * CSS 생성기 유틸리티
 * 토큰 데이터에서 CSS를 생성하기 위한 재사용 가능한 함수들
 */

import path from "path";
import { ensureDir, writeFile, loadModule } from "./build-utils.mjs";

/**
 * 키-값 쌍에서 CSS 생성
 * @param {Object<string, number|string>} values - 토큰 값들
 * @param {string} prefix - CSS 변수 접두사 (예: 'space', 'radius')
 * @param {string} selector - CSS 선택자 (기본값: ':root')
 * @returns {string} 생성된 CSS
 */
export function generateCSSFromValues(values, prefix, selector = ":root") {
  const rules = Object.entries(values)
    .map(([key, value]) => {
      const cssKey = `--${prefix}-${key}`;
      const cssValue = typeof value === "number" ? `${value}px` : value;
      return `  ${cssKey}: ${cssValue};`;
    })
    .join("\n");

  return `${selector} {\n${rules}\n}`;
}

/**
 * CSS 생성기 함수 생성
 * @param {Object} options - 생성기 옵션
 * @param {string} options.name - 생성기 이름
 * @param {string} options.modulePath - 로드할 모듈 경로
 * @param {string} options.dataPath - 모듈 내 데이터 경로 (예: 'spaceBaseValues')
 * @param {string} options.outputSubdir - 출력 하위 디렉토리
 * @param {Function} [options.transform] - 선택적 변환 함수
 * @returns {Function} 생성기 함수
 */
export function createCSSGenerator({
  name,
  modulePath,
  dataPath,
  outputSubdir,
  transform = (data) => data,
}) {
  return async (config) => {
    const module = await loadModule(modulePath);
    const data = module[dataPath];
    const transformedData = transform(data);
    const outputDir = path.join(config.cssOutputDir, outputSubdir);

    await ensureDir(outputDir);

    const css = generateCSSFromValues(transformedData, name);
    writeFile(path.join(outputDir, "index.css"), css);
  };
}

/**
 * 커스텀 템플릿으로 CSS 생성
 * @param {string} template - CSS 템플릿 문자열
 * @param {Object} replacements - 템플릿 치환 값들
 * @returns {string} 생성된 CSS
 */
export function generateCSSFromTemplate(template, replacements = {}) {
  let css = template;
  for (const [key, value] of Object.entries(replacements)) {
    css = css.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), value);
  }
  return css;
}
