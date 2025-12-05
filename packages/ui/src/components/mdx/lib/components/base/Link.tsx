import type { ReactNode } from "react";
import { isExternalLink } from "../../utils";

interface LinkComponentProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: ReactNode;
  linkComponent?: React.ComponentType<{ to: string; children: ReactNode; className?: string }>;
}

/**
 * Link 컴포넌트: 외부/내부 링크를 자동으로 구분
 */
export function Link({ href, children, linkComponent, className, ...props }: LinkComponentProps) {
  if (!href) return <>{children}</>;
  
  // 외부 링크는 일반 <a> 태그 사용
  if (isExternalLink(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...props}
      >
        {children}
      </a>
    );
  }
  
  // 내부 링크는 linkComponent 사용 (없으면 일반 <a> 태그)
  if (linkComponent) {
    const LinkComponent = linkComponent;
    return (
      <LinkComponent to={href} className={className}>
        {children}
      </LinkComponent>
    );
  }
  
  return (
    <a
      href={href}
      className={className}
      {...props}
    >
      {children}
    </a>
  );
}

