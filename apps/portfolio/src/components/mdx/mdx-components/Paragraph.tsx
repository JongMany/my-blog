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

  if (hasImage(p.children)) {
    // div 요소에 전달할 수 있는 속성만 추출
    const { children, className: _className, ...divProps } = p;
    return (
      <div {...divProps} className={className}>
        {children}
      </div>
    );
  }

  return <p {...p} className={className} />;
}
