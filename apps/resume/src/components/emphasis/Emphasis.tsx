import { TextSegment } from "./text-segment";
import { processEmphasisText } from "./utils/textProcessor";

interface EmphasisProps {
  text: string;
  keywordImageMap?: Record<string, string>;
}

/** 대괄호 키워드 툴팁 */
export function Emphasis({ text, keywordImageMap }: EmphasisProps) {
  const textParts = processEmphasisText(text, keywordImageMap);

  return (
    <>
      {textParts.map((part, index) => (
        <TextSegment
          key={index}
          part={part}
          keywordImageMap={keywordImageMap}
        />
      ))}
    </>
  );
}
