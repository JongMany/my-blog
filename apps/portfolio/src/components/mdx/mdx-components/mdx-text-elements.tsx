import React from "react";
import { cn } from "@srf/ui";

export function Anchor(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      className={cn(
        "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline",
        props.className,
      )}
      target="_blank"
      rel="noopener noreferrer"
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


