import React from "react";
import { cn } from "@srf/ui";
import { pillClass } from "./utils";

export function PillButton({
  variant = "soft",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "soft" | "primary" | "outline";
  size?: "sm" | "md" | "xs";
}) {
  return (
    <button className={cn(pillClass(variant, size), className)} {...rest} />
  );
}
