import type { ReactNode } from "react";
import type { Bullet, PortfolioLink } from "@/service";

export type { Bullet };

export interface BulletListProps {
  items: Bullet[];
  renderText?: (text: string) => ReactNode;
  renderLinks?: (links: PortfolioLink[]) => ReactNode;
  /** @internal */
  depth?: number;
}

const listMarker = (d: number) =>
  d === 0
    ? "list-disc marker:text-[var(--primary)]"
    : d === 1
      ? "list-[circle]"
      : "list-[square]";

export function BulletList({
  items,
  renderText = (t) => t,
  renderLinks,
  depth = 0,
}: BulletListProps) {
  if (depth > 5 || !items.length) return null;

  const isDeep = depth >= 2;

  return (
    <ul className={`${listMarker(depth)} pl-5 space-y-1.5`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className={isDeep ? "text-[11px]" : "text-[12px]"}>
            {renderText(item.text)}
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className={`ml-1.5 first:ml-2 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-fg)] ${isDeep ? "text-[9px] px-1.5 py-px" : "text-[10px] px-2 py-0.5"}`}
              >
                #{tag}
              </span>
            ))}
          </span>

          {item.description && (
            <p
              className={`mt-1.5 ${isDeep ? "text-[10px]" : "text-[11px]"} text-[var(--muted-fg)] leading-relaxed whitespace-pre-line`}
            >
              {renderText(item.description)}
            </p>
          )}

          {item.children?.length ? (
            <BulletList
              items={item.children}
              renderText={renderText}
              renderLinks={renderLinks}
              depth={depth + 1}
            />
          ) : null}

          {item.portfolioLinks?.length
            ? renderLinks?.(item.portfolioLinks)
            : null}
        </li>
      ))}
    </ul>
  );
}
