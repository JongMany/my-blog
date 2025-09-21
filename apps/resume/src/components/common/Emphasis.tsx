import React from "react";
import { InlineTooltip } from "@srf/ui";
import { imageSource } from "@mfe/shared";

/** 대괄호 키워드 툴팁 */
export function Emphasis({
  text,
  keywordImageMap,
}: {
  text: string;
  keywordImageMap?: Record<string, string>;
}) {
  // 대괄호 패턴: [키워드] 형태
  const bracketPattern = /\[([^\]]+)\]/g;

  // 대괄호를 먼저 처리
  let processedText = text;
  const bracketMatches: Array<{ keyword: string; placeholder: string }> = [];

  let match;
  let matchIndex = 0;
  while ((match = bracketPattern.exec(text)) !== null) {
    const placeholder = `__BRACKET_${matchIndex}__`;
    bracketMatches.push({
      keyword: match[1],
      placeholder: placeholder,
    });
    processedText = processedText.replace(match[0], placeholder);
    matchIndex++;
  }

  // 플레이스홀더를 툴팁 마커로 교체
  bracketMatches.forEach((bracketMatch) => {
    if (keywordImageMap?.[bracketMatch.keyword]) {
      const marker = `__TOOLTIP_${bracketMatch.keyword}__`;
      processedText = processedText.replace(bracketMatch.placeholder, marker);
    } else {
      processedText = processedText.replace(
        bracketMatch.placeholder,
        bracketMatch.keyword,
      );
    }
  });

  // 툴팁 마커 패턴으로 분할
  const tooltipPattern = /__TOOLTIP_[^_]+__/g;
  const matches = Array.from(processedText.matchAll(tooltipPattern));
  const parts: string[] = [];
  let lastIndex = 0;

  matches.forEach((match) => {
    if (match.index !== undefined) {
      // 매칭 전 텍스트 추가
      if (match.index > lastIndex) {
        parts.push(processedText.slice(lastIndex, match.index));
      }
      // 매칭된 부분 추가
      parts.push(match[0]);
      lastIndex = match.index + match[0].length;
    }
  });

  // 마지막 남은 텍스트 추가
  if (lastIndex < processedText.length) {
    parts.push(processedText.slice(lastIndex));
  }

  return (
    <>
      {parts.map((p, i) => {
        if (!p) return null;

        // 툴팁 마커인 경우
        const tooltipMatch = p.match(/^__TOOLTIP_(.+)__$/);
        if (tooltipMatch) {
          const keyword = tooltipMatch[1];
          return (
            <InlineTooltip
              key={i}
              content={
                <div>
                  <img
                    src={imageSource(
                      keywordImageMap?.[keyword] || "",
                      "resume",
                      "http://localhost:3003",
                    )}
                    alt={keyword}
                    className="max-w-[calc(28rem-24px)] min-w-[calc(28rem-24px)] min-h-48 object-cover rounded"
                  />
                </div>
              }
              delay={300}
            >
              <span className="font-medium cursor-help text-[var(--primary)] opacity-60 hover:opacity-100 transition-opacity">
                {keyword}
              </span>
            </InlineTooltip>
          );
        }

        // 일반 텍스트
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
