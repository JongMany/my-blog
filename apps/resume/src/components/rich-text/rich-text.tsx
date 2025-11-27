import { TextSegment } from "./text-segment";
import { processRichText } from "./utils";

interface RichTextProps {
  text: string;
  keywordImageMap?: Record<string, string>;
}

/** 대괄호 키워드 툴팁 */
export function RichText({ text, keywordImageMap }: RichTextProps) {
  const textParts = processRichText(text, keywordImageMap);

  return (
    <>
      {textParts.map((part) => (
        <TextSegment
          key={part.id}
          part={part}
          keywordImageMap={keywordImageMap}
        />
      ))}
    </>
  );
}
