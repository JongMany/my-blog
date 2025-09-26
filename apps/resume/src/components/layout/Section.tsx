import React, { PropsWithChildren } from "react";

type SectionProps = {
  title: string;
  id?: string;
};

export default function Section({
  title,
  id,
  children,
}: PropsWithChildren<SectionProps>) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-24 space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>
      <div className="grid gap-3">{children}</div>
    </section>
  );
}
