import React from "react";
import { cn } from "@srf/ui";
import { PROTOCOLS } from "@/constants/protocols";

export function Anchor(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const { href, target, rel, ...restProps } = props;
  const isExternalLink =
    href?.startsWith(PROTOCOLS.HTTP) ||
    href?.startsWith(PROTOCOLS.HTTPS) ||
    href?.startsWith(PROTOCOLS.PROTOCOL_RELATIVE);
  const linkTarget = target ?? (isExternalLink ? "_blank" : undefined);
  const linkRel = rel ?? (isExternalLink ? "noopener noreferrer" : undefined);

  return (
    <a
      {...restProps}
      href={href}
      target={linkTarget}
      rel={linkRel}
      className={cn(
        "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline",
        props.className,
      )}
    />
  );
}

export function HorizontalRule(props: React.HTMLAttributes<HTMLHRElement>) {
  return (
    <hr
      {...props}
      className={cn(
        "my-8 border-gray-300 dark:border-gray-700",
        props.className,
      )}
    />
  );
}

export function Strong(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <strong
      {...props}
      className={cn(
        "font-semibold text-gray-900 dark:text-gray-100",
        props.className,
      )}
    />
  );
}

export function Emphasis(props: React.HTMLAttributes<HTMLElement>) {
  return <em {...props} className={cn("italic", props.className)} />;
}

