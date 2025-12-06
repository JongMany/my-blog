import React from "react";
import { cn } from "@srf/ui";
import { hasImage } from "./utils";

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

export function Paragraph(props: ParagraphProps) {
  const className = cn(
    "mb-4 leading-relaxed text-gray-700 dark:text-gray-300",
    props.className,
  );

  if (hasImage(props.children)) {
    const { children, className: _unusedClassName, ...divProps } = props;
    return (
      <div {...divProps} className={className}>
        {children}
      </div>
    );
  }

  return <p {...props} className={className} />;
}
