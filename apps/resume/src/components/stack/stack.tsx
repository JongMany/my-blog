import { cn } from "@srf/ui";
import React, { PropsWithChildren } from "react";

type StackProps = {
  title: string;
  id?: string;
  className?: string;
};

export function Stack({
  title,
  id,
  className,
  children,
}: PropsWithChildren<StackProps>) {
  const headingId = id
    ? `${id}-heading`
    : `section-${title.toLowerCase().replace(/\s+/g, "-")}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("scroll-mt-24 space-y-3", className)}
    >
      <div className="flex items-center gap-3">
        <h3 id={headingId} className="text-base font-semibold tracking-tight">
          {title}
        </h3>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
