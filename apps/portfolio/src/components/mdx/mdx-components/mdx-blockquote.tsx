import React from "react";
import { cn } from "@srf/ui";

export function Blockquote(
  props: React.HTMLAttributes<HTMLQuoteElement>,
) {
  return (
    <blockquote
      {...props}
      className={cn(
        "border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-4 text-gray-600 dark:text-gray-400",
        props.className,
      )}
    />
  );
}

