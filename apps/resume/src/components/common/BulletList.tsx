import React from "react";
import { cn, SimpleCursorTooltip } from "@srf/ui";
import { keyFor } from "../../utils/resumeUtils";
import { Emphasis } from "./Emphasis";
import { PortfolioLinks } from "./PortfolioLinks";

export interface Bullet {
  text: string;
  tags?: string[];
  children?: Bullet[];
  portfolioLinks?: Array<{
    title: string;
    url: string;
    type?: string;
  }>;
}

/** 재귀 렌더링: 레벨별 마커/여백 + 안정 키 */
export function BulletList({
  items,
  level,
  prefix,
  keywordImageMap,
}: {
  items: Bullet[];
  level: number;
  prefix: number[];
  keywordImageMap?: Record<string, string>;
}) {
  const listClass =
    level === 0
      ? "list-disc marker:text-[var(--primary)] pl-5 space-y-1.5"
      : level === 1
        ? "list-[circle] pl-5 space-y-1 text-[12px]"
        : "list-[square] pl-5 space-y-1 text-[12px]";

  return (
    <ul className={cn("text-[13px]", listClass)}>
      {items.map((b, idx) => {
        const k = keyFor([...prefix, idx], b.text);
        return (
          <li key={k}>
            <div className="flex gap-1">
              <Emphasis text={b.text} keywordImageMap={keywordImageMap} />
              {b.tags?.length ? (
                <span className="ml-2 inline-flex flex-wrap gap-1 align-middle">
                  {b.tags.map((t) => (
                    <SimpleCursorTooltip
                      key={`${k}:tag:${t}`}
                      text={`${t} 관련 작업`}
                      delay={200}
                    >
                      <span
                        className={cn(
                          "rounded-full border border-[var(--border)] bg-[var(--surface)]",
                          "px-2 py-[2px] text-[10px] text-[var(--muted-fg)]",
                          "cursor-help hover:text-[var(--primary)] transition-colors",
                        )}
                      >
                        #{t}
                      </span>
                    </SimpleCursorTooltip>
                  ))}
                </span>
              ) : null}
            </div>
            {b.children?.length ? (
              <div className="mt-1.5">
                <BulletList
                  items={b.children}
                  level={level + 1}
                  prefix={[...prefix, idx]}
                  keywordImageMap={keywordImageMap}
                />
              </div>
            ) : null}
            {b.portfolioLinks?.length ? (
              <PortfolioLinks links={b.portfolioLinks} />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
