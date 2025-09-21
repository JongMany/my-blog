import { ExternalLink, Github, FileText, Play, Link } from "lucide-react";

/** 포트폴리오 링크 아이콘 */
export function getLinkIcon(type?: string) {
  switch (type) {
    case "github":
      return <Github className="w-3 h-3" />;
    case "demo":
      return <Play className="w-3 h-3" />;
    case "blog":
      return <FileText className="w-3 h-3" />;
    case "portfolio":
      return <ExternalLink className="w-3 h-3" />;
    default:
      return <Link className="w-3 h-3" />;
  }
}
