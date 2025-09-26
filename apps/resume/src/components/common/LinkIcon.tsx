import React from "react";
import { ExternalLink, Github, FileText, Play, Link } from "lucide-react";

interface LinkIconProps {
  type?: string;
  className?: string;
}

/** 포트폴리오 링크 아이콘 컴포넌트 */
export function LinkIcon({ type, className }: LinkIconProps) {
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

// 기존 함수도 호환성을 위해 유지 (deprecated)
export function getLinkIcon(type?: string) {
  return <LinkIcon type={type} />;
}
