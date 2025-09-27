import React from "react";
import { KeywordTooltip } from "./KeywordTooltip";
import type { TextPart } from "./utils/textProcessor";

interface TextPartRendererProps {
  part: TextPart;
  keywordImageMap?: Record<string, string>;
}

export function TextPartRenderer({
  part,
  keywordImageMap,
}: TextPartRendererProps) {
  if (part.type === "tooltip" && part.keyword) {
    return (
      <KeywordTooltip
        keyword={part.keyword}
        imageUrl={keywordImageMap?.[part.keyword]}
      />
    );
  }

  // \n을 <br> 태그로 변환하여 줄바꿈 처리
  const renderTextWithLineBreaks = (text: string) => {
    return text.split("\n").map((line, index, array) => (
      <React.Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return <span>{renderTextWithLineBreaks(part.content)}</span>;
}
