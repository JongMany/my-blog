import React from "react";
import { LinkIcon } from "./LinkIcon";

export interface PortfolioLink {
  title: string;
  url: string;
  type?: string;
}

/** 포트폴리오 링크들 */
export function PortfolioLinks({ links }: { links: PortfolioLink[] }) {
  if (!links?.length) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2 py-1 text-[11px] text-[var(--fg)] transition-all duration-150 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]"
        >
          <div className="flex items-center justify-center text-[var(--muted-fg)] transition-colors group-hover:text-[var(--primary)]">
            <LinkIcon type={link.type} />
          </div>
          <span className="font-medium">{link.title}</span>
        </a>
      ))}
    </div>
  );
}
