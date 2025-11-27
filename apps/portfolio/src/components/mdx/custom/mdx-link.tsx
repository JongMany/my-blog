import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { isExternalUrl } from "../lib/utils";

interface MDXLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

export function MDXLink({
  href,
  children,
  ...props
}: MDXLinkProps) {
  return isExternalUrl(href) ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
      {...props}
    >
      {children}
    </a>
  ) : (
    <Link
      to={href ?? "#"}
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
      {...props}
    >
      {children}
    </Link>
  );
}

