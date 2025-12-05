import type { MDXRuntimeConfig } from "../../../types";

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
  children: React.ReactNode;
  runtimeConfig: MDXRuntimeConfig;
}

export function Link({ href, children, runtimeConfig, className, ...props }: LinkProps) {
  const LinkComponent = runtimeConfig.LinkComponent;
  
  // 외부 링크인 경우
  if (
    href?.startsWith("http://") ||
    href?.startsWith("https://") ||
    href?.startsWith("//")
  ) {
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

  // 내부 링크인 경우 주입받은 Link 컴포넌트 사용
  return (
    <LinkComponent to={href ?? "#"} className={className} {...props}>
      {children}
    </LinkComponent>
  );
}

