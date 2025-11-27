import { ComponentPropsWithoutRef } from "react";
import { cn } from "@srf/ui";
import { HEADING_STYLES } from "../constants/styles";

type HeadingLevel = keyof typeof HEADING_STYLES;

export function createHeading(level: HeadingLevel) {
  return (
    props: ComponentPropsWithoutRef<HeadingLevel> & { className?: string },
  ) => {
    const Tag = level;
    return (
      <Tag {...props} className={cn(HEADING_STYLES[level], props.className)} />
    );
  };
}
