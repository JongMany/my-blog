import { cn } from "@srf/ui";
import { PortfolioLink } from "@/service";
import { LinkIcon } from "./link-icon";

interface LinkProps extends PortfolioLink {
  className?: string;
}

export function Link({ title, url, type, className }: LinkProps) {
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
        className,
      )}
    >
      <LinkIcon type={type} />
      <span>{title}</span>
    </a>
  );
}

