import type { RuntimeConfig } from "../../../types";
import { isExternalLink } from "../../utils";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: React.ReactNode;
  runtimeConfig: RuntimeConfig;
}

/**
 * 외부 링크 컴포넌트 (순수 함수적 접근)
 */
const ExternalLink = ({
  href,
  children,
  className,
  ...props
}: Omit<LinkProps, "runtimeConfig">) => (
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
  runtimeConfig,
  className,
  ...props
}: LinkProps) => {
  const LinkComponent = runtimeConfig.LinkComponent;
  return (
    <LinkComponent to={href ?? "#"} className={className} {...props}>
      {children}
    </LinkComponent>
  );
};

/**
 * Link 컴포넌트: 외부/내부 링크를 자동으로 구분
 * 함수형 프로그래밍: 조건부 렌더링을 순수 함수로 분리
 */
export function Link(props: LinkProps) {
  const { href } = props;
  
  return isExternalLink(href) ? (
    <ExternalLink {...props} />
  ) : (
    <InternalLink {...props} />
  );
}

