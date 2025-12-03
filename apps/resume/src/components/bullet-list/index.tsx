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

const MARKER = [
  "list-disc marker:text-[var(--primary)]",
  "list-[circle]",
  "list-[square]",
];
const SIZES = {
  shallow: {
    text: "text-[12px]",
    desc: "text-[11px]",
    tag: "text-[10px] px-2 py-0.5",
  },
  deep: {
    text: "text-[11px]",
    desc: "text-[10px]",
    tag: "text-[9px] px-1.5 py-px",
  },
};

export function BulletList({
  items,
  renderText = (t) => t,
  renderLinks,
  depth = 0,
}: BulletListProps) {
  if (depth > 5 || !items.length) return null;

  const s = SIZES[depth >= 2 ? "deep" : "shallow"];

  return (
    <ul className={`${MARKER[Math.min(depth, 2)]} pl-5 space-y-1.5`}>
      {items.map((item, i) => (
        <li key={i}>
          <span className={s.text}>
            {renderText(item.text)}
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className={`ml-1.5 first:ml-2 inline-flex rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--muted-fg)] ${s.tag}`}
              >
                #{tag}
              </span>
            ))}
          </span>

          {item.description && (
            <p
              className={`mt-1.5 ${s.desc} text-[var(--muted-fg)] leading-relaxed whitespace-pre-line`}
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
