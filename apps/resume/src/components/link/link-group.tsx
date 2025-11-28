import { PortfolioLink } from "@/service";
import { Link } from "./link";

interface LinkGroupProps {
  links: PortfolioLink[];
  className?: string;
}

export function LinkGroup({ links, className }: LinkGroupProps) {
  if (!links?.length) return null;

  return (
    <div
      className={className || "ml-2 mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5"}
    >
      {links.map((link) => (
        <Link
          key={`${link.title}-${link.url}`}
          title={link.title}
          url={link.url}
          type={link.type}
        />
      ))}
    </div>
  );
}

