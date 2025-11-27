import { ExternalLink, Github, FileText, Play, Link } from "lucide-react";
import { cn } from "@srf/ui";
import { PortfolioLink } from "../../service";

interface PortfolioLinksProps {
  links: PortfolioLink[];
}

export function PortfolioLinks({ links }: PortfolioLinksProps) {
  if (!links?.length) return null;

  return (
    <div className="ml-2 mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
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

function PortfolioLinkItem({ title, url, type }: PortfolioLink) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex items-center gap-1 text-[11px]",
        "text-[var(--muted-fg)] transition-colors duration-150",
        "hover:text-[var(--primary)] hover:underline",
        "underline-offset-2 decoration-1",
      )}
    >
      <LinkIcon type={type} />
      <span>{title}</span>
    </a>
  );
}

function LinkIcon({ type }: { type?: PortfolioLink["type"] }) {
  const iconProps = { className: "w-2.5 h-2.5" };

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
