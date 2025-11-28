import { Fragment } from "react";
import { KeywordTooltip } from "@/components/tooltip";
import type { TextPart } from "./utils";

interface TextSegmentProps {
  part: TextPart;
  keywordImageMap?: Record<string, string>;
}

export function TextSegment({ part, keywordImageMap }: TextSegmentProps) {
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
      <Fragment key={index}>
        {line}
        {index < array.length - 1 && <br />}
      </Fragment>
    ));
  };

  return <span>{renderTextWithLineBreaks(part.content)}</span>;
}
