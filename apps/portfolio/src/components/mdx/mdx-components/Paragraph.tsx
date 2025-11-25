import React from "react";
import { cn } from "@srf/ui";
import { hasImage } from "./utils";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function Paragraph(p: ParagraphProps) {
  const className = cn(
    "mb-4 leading-relaxed text-gray-700 dark:text-gray-300",
    p.className,
  );
  return hasImage(p.children) ? (
    <div
      {...(p as React.HTMLAttributes<HTMLDivElement>)}
      className={className}
    >
      {p.children}
    </div>
  ) : (
    <p {...p} className={className} />
  );
}


