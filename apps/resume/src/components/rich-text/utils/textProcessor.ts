/**
 * 텍스트 처리 관련 순수함수들
 */

export interface BracketMatch {
  keyword: string;
  placeholder: string;
}

export interface TextPart {
  type: "text" | "tooltip";
  content: string;
  keyword?: string;
}

/**
 * 대괄호 패턴을 찾아서 플레이스홀더로 교체
 */
export function extractBracketMatches(text: string): {
  processedText: string;
  bracketMatches: BracketMatch[];
} {
  const bracketPattern = /\[([^\]]+)\]/g;
  let processedText = text;
  const bracketMatches: BracketMatch[] = [];

  let match;
  let matchIndex = 0;

  while ((match = bracketPattern.exec(text)) !== null) {
    const placeholder = `__BRACKET_${matchIndex}__`;
    bracketMatches.push({
      keyword: match[1],
      placeholder,
    });
    processedText = processedText.replace(match[0], placeholder);
    matchIndex++;
  }

  return { processedText, bracketMatches };
}

/**
 * 플레이스홀더를 툴팁 마커나 일반 텍스트로 교체
 */
export function replacePlaceholders(
  processedText: string,
  bracketMatches: BracketMatch[],
  keywordImageMap?: Record<string, string>,
): string {
  let result = processedText;

  bracketMatches.forEach((bracketMatch) => {
    if (keywordImageMap?.[bracketMatch.keyword]) {
      const marker = `__TOOLTIP_${bracketMatch.keyword}__`;
      result = result.replace(bracketMatch.placeholder, marker);
    } else {
      result = result.replace(bracketMatch.placeholder, bracketMatch.keyword);
    }
  });

  return result;
}

/**
 * 텍스트를 툴팁 마커와 일반 텍스트로 분할
 */
export function splitTextIntoParts(text: string): TextPart[] {
  const tooltipPattern = /__TOOLTIP_[^_]+__/g;
  const matches = Array.from(text.matchAll(tooltipPattern));
  const parts: TextPart[] = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    if (match.index !== undefined) {
      // 매칭 전 텍스트 추가
      if (match.index > lastIndex) {
        const textContent = text.slice(lastIndex, match.index);
        if (textContent) {
          parts.push({ type: "text", content: textContent });
        }
      }

      // 툴팁 마커 추가
      const tooltipMatch = match[0].match(/^__TOOLTIP_(.+)__$/);
      if (tooltipMatch) {
        parts.push({
          type: "tooltip",
          content: match[0],
          keyword: tooltipMatch[1],
        });
      }

      lastIndex = match.index + match[0].length;
    }
  });

  // 마지막 남은 텍스트 추가
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      parts.push({ type: "text", content: remainingText });
    }
  }

  return parts;
}

/**
 * 전체 텍스트 처리 파이프라인
 */
export function processRichText(
  text: string,
  keywordImageMap?: Record<string, string>,
): TextPart[] {
  const { processedText, bracketMatches } = extractBracketMatches(text);
  const finalText = replacePlaceholders(
    processedText,
    bracketMatches,
    keywordImageMap,
  );
  return splitTextIntoParts(finalText);
}

