/**
 * 브라우저 호환 frontmatter 파서
 *
 * gray-matter는 Node.js의 Buffer를 사용하므로 브라우저에서 동작하지 않습니다.
 * 이 함수는 간단한 YAML frontmatter를 파싱합니다.
 */

interface ParseResult {
  data: Record<string, unknown>;
  content: string;
}

/**
 * MDX/Markdown 파일에서 frontmatter를 파싱합니다.
 *
 * @param source 원본 파일 내용
 * @returns frontmatter와 content를 포함한 객체
 */
export function parseFrontmatter(source: string): ParseResult {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = source.match(frontmatterRegex);

  if (!match) {
    // frontmatter가 없으면 전체를 content로 반환
    return { data: {}, content: source };
  }

  const [, frontmatterStr, content] = match;
  const data = parseYaml(frontmatterStr);

  return { data, content };
}

/**
 * Record에서 문자열 값을 추출합니다.
 * @param data - 데이터 객체
 * @param key - 키
 * @param defaultValue - 기본값
 */
export function getString(
  data: Record<string, unknown>,
  key: string,
  defaultValue = "",
): string {
  return (data[key] as string) || defaultValue;
}

/**
 * Record에서 선택적 문자열 값을 추출합니다.
 * @param data - 데이터 객체
 * @param key - 키
 */
export function getOptionalString(
  data: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = data[key];
  return value ? String(value) : undefined;
}

/**
 * 간단한 YAML 파서 (기본적인 키-값 쌍만 지원)
 *
 * 복잡한 YAML 구조는 지원하지 않지만, 일반적인 frontmatter 사용에는 충분합니다.
 */
function parseYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = yaml.split("\n");

  let currentKey: string | null = null;
  let currentValue: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // 빈 줄은 무시
    if (!trimmed) continue;

    // 배열 항목 (- 로 시작, 들여쓰기 가능)
    if (trimmed.startsWith("- ")) {
      const arrayValue = trimmed.slice(2).trim();
      if (currentKey) {
        if (!Array.isArray(result[currentKey])) {
          result[currentKey] = [];
        }
        (result[currentKey] as unknown[]).push(parseValue(arrayValue));
      } else {
        // 키 없이 배열이 시작되는 경우는 무시 (일반적이지 않음)
      }
      continue;
    }

    // 키-값 쌍 (key: value 형식)
    const keyValueMatch = trimmed.match(/^([^:]+):\s*(.+)$/);
    if (keyValueMatch) {
      // 이전 키-값 저장
      if (currentKey) {
        result[currentKey] = parseValue(currentValue.join("\n"));
      }

      const [, key, value] = keyValueMatch;
      currentKey = key.trim();
      const valueStr = value.trim();

      // 값이 비어있으면 배열로 초기화 (다음 줄에 - 가 올 수 있음)
      if (!valueStr) {
        currentValue = [];
      } else {
        currentValue = [valueStr];
      }
      continue;
    }

    // 들여쓰기된 값 (이전 키의 연속)
    if (currentKey && (trimmed.startsWith("  ") || trimmed.startsWith("\t"))) {
      currentValue.push(trimmed);
      continue;
    }

    // 새로운 키로 시작 (들여쓰기 없음)
    if (currentKey) {
      result[currentKey] = parseValue(currentValue.join("\n"));
      currentKey = null;
      currentValue = [];
    }
  }

  // 마지막 키-값 저장
  if (currentKey) {
    result[currentKey] = parseValue(currentValue.join("\n"));
  }

  return result;
}

/**
 * 값을 적절한 타입으로 변환
 */
function parseValue(value: string): unknown {
  const trimmed = value.trim();

  // 배열 (인라인)
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    if (!inner) return [];

    return inner
      .split(",")
      .map((item) => parseValue(item.trim()))
      .filter((item) => item !== "");
  }

  // 불리언
  if (trimmed === "true") return true;
  if (trimmed === "false") return false;

  // null
  if (trimmed === "null" || trimmed === "~") return null;

  // 숫자
  if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
  if (/^-?\d*\.\d+$/.test(trimmed)) return parseFloat(trimmed);

  // 문자열 (따옴표 제거)
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}
