import { ExternalLink, Github, FileText, Play, Link } from "lucide-react";
import { cn } from "@srf/ui";
import { PortfolioLink } from "../../service";

interface PortfolioLinksProps {
  links: PortfolioLink[];
}

/** 포트폴리오 링크들 */
export function PortfolioLinks({ links }: PortfolioLinksProps) {
  if (!links?.length) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1.5">
      {links.map((link) => (
        <PortfolioLinkItem
          key={`${link.title}-${link.url}`}
          title={link.title}
          url={link.url}
          type={link.type}
        />
      ))}
    </div>
  );
}

export type PortfolioLinkItemProps = PortfolioLink;

function PortfolioLinkItem({ title, url, type }: PortfolioLinkItemProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md",
        "border border-[var(--border)] bg-[var(--surface)]",
        "px-2 py-1 text-[11px] text-[var(--fg)]",
        "transition-all duration-150",
        "hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 hover:text-[var(--primary)]",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center",
          "text-[var(--muted-fg)] transition-colors",
          "group-hover:text-[var(--primary)]",
        )}
      >
        <LinkIcon type={type} />
      </div>
      <span className="font-medium">{title}</span>
    </a>
  );
}

interface LinkIconProps {
  type?: PortfolioLink["type"];
  className?: string;
}

/** 포트폴리오 링크 아이콘 컴포넌트 */
function LinkIcon({ type, className }: LinkIconProps) {
  const iconProps = { className: `w-3 h-3 ${className || ""}` };

  switch (type) {
    case "github":
      return <Github {...iconProps} />;
    case "demo":
      return <Play {...iconProps} />;
    case "blog":
      return <FileText {...iconProps} />;
    case "portfolio":
      return <ExternalLink {...iconProps} />;
    default:
      return <Link {...iconProps} />;
  }
}
