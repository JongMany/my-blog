import { ExternalLink, Github, FileText, Play, Link } from "lucide-react";
import { PortfolioLink } from "../../service";

interface LinkIconProps {
  type?: PortfolioLink["type"];
}

export function LinkIcon({ type }: LinkIconProps) {
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

