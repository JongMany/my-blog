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

  return <span>{part.content}</span>;
}
