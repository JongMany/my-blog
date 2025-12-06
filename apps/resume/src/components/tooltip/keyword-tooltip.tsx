import { InlineTooltip, cn } from "@srf/ui";
import { imageSource } from "@mfe/shared";

interface KeywordTooltipProps {
  keyword: string;
  imageUrl?: string;
}

export function KeywordTooltip({ keyword, imageUrl }: KeywordTooltipProps) {
  return (
    <InlineTooltip
      content={
        <div>
          <img
            src={imageSource("resume", {
              isDevelopment: import.meta.env.MODE === "development",
            })(imageUrl || "")}
            alt={keyword}
            className={cn(
              "max-w-[calc(28rem-24px)] min-w-[calc(28rem-24px)] min-h-48",
              "object-cover rounded",
            )}
          />
        </div>
      }
      delay={300}
    >
      <span
        className={cn(
          "font-medium cursor-help text-[var(--primary)]",
          "opacity-60 hover:opacity-100 transition-opacity",
        )}
      >
        {keyword}
      </span>
    </InlineTooltip>
  );
}
