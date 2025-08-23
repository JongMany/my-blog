import React from "react";
import { cn } from "@srf/ui";

export function Card(p: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = p;
  return (
    <div
      className={cn(
        "rounded-2xl border border-[var(--border)] bg-[var(--card-bg)]",
        "shadow-[var(--shadow-soft)] transition will-change-transform",
        "hover:-translate-y-[1px] hover:shadow-lg", // hover 통일
        className
      )}
      {...rest}
    />
  );
}

export function Button({
  variant = "default",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "primary" | "ghost";
  size?: "sm" | "md";
}) {
  const base =
    "inline-flex items-center gap-1.5 rounded-xl transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:[box-shadow:var(--ring)]";
  const vs =
    variant === "primary"
      ? "bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-105"
      : variant === "ghost"
        ? "text-[var(--fg)] hover:bg-[var(--hover-bg)]"
        : "border border-[var(--border)] bg-[var(--card-bg)] text-[var(--fg)] hover:bg-[var(--hover-bg)]";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";
  return <button className={cn(base, vs, sz, className)} {...rest} />;
}

function pillClass(variant: "soft" | "primary" | "outline", size: "sm" | "md") {
  const base =
    "inline-flex items-center gap-1.5 rounded-full focus-visible:outline-none focus-visible:[box-shadow:var(--ring)] " +
    "transition will-change-transform hover:-translate-y-0.5";
  const v =
    variant === "primary"
      ? "bg-[var(--primary)] text-[var(--primary-ink)] hover:brightness-105"
      : variant === "outline"
        ? "bg-transparent border border-[var(--border)] text-[var(--fg)] hover:bg-[var(--hover-bg)]"
        : // soft
          "border border-[var(--border)] text-[var(--fg)] " +
          "[background:linear-gradient(180deg,rgba(255,255,255,.65),rgba(255,255,255,.0))_padding-box,linear-gradient(var(--card-bg),var(--card-bg))_border-box] " +
          "bg-[var(--card-bg)] hover:bg-[var(--hover-bg)]";
  const s = size === "sm" ? "px-3 py-1.5 text-xs" : "px-3.5 py-2 text-sm";

  return `${base} ${v} ${s}`;
}

export function PillButton({
  variant = "soft",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "soft" | "primary" | "outline";
  size?: "sm" | "md";
}) {
  return (
    <button className={cn(pillClass(variant, size), className)} {...rest} />
  );
}
export function PillLink({
  variant = "soft",
  size = "md",
  className,
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: "soft" | "primary" | "outline";
  size?: "sm" | "md";
}) {
  return (
    <a
      className={cn("no-underline", pillClass(variant, size), className)}
      {...rest}
    />
  );
}

/* Segmented 그룹 (칩/버튼을 하나의 긴 알약처럼) */
export function Segmented({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex overflow-hidden rounded-full border border-[var(--border)] bg-[var(--surface)]",
        className
      )}
    >
      {React.Children.map(children, (c, i) => (
        <div className="relative -ml-px first:ml-0">
          {/* 분할선 */}
          <span className="pointer-events-none absolute left-0 top-1 bottom-1 w-px bg-[color-mix(in_oklab,var(--border),transparent_55%)] first:hidden" />
          {/* 내부 아이템은 라운딩 없이 붙임 */}
          {React.isValidElement(c)
            ? React.cloneElement(c as any, {
                className: cn(
                  "rounded-none first:rounded-s-full last:rounded-e-full",
                  (c as any).props?.className
                ),
              })
            : c}
        </div>
      ))}
    </div>
  );
}

/* 메타/뱃지 (작은 칩) */
export function Meta(p: React.HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = p;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-[2px] text-[11px] [font-variant-numeric:tabular-nums] text-[var(--muted-fg)]",
        className
      )}
      {...rest}
    />
  );
}
export function Badge(p: React.HTMLAttributes<HTMLSpanElement>) {
  const { className, ...rest } = p;
  return (
    <span
      className={cn(
        "rounded-full border border-[var(--border)] bg-[var(--surface)] px-2 py-[2px] text-[10px] text-[var(--muted-fg)]",
        className
      )}
      {...rest}
    />
  );
}
