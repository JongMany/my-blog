import type { ComponentType, ReactNode } from "react";
import { isExternalLink } from "../../utils";
import type { LinkProps as InternalLinkProps } from "../../../types";

interface LinkComponentProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: ReactNode;
}

/**
 * 외부 링크 컴포넌트
 */
const ExternalLink = ({
  href,
  children,
  className,
  ...props
}: LinkComponentProps) => (
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

/**
 * 내부 링크 컴포넌트
 */
const InternalLink = ({
  href,
  children,
  className,
  ...props
}: LinkComponentProps) => (
  <a
    href={href ?? "#"}
    target="_blank"
    rel="noopener noreferrer"
    className={className}
    {...props}
  >
    {children}
  </a>
);

/**
 * Link 컴포넌트: 외부/내부 링크를 자동으로 구분
 */
export function Link(props: LinkComponentProps) {
  const { href } = props;
  
  return isExternalLink(href) ? (
    <ExternalLink {...props} />
  ) : (
    <InternalLink {...props} />
  );
}

