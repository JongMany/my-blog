import * as React from "react";

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-sm text-[var(--muted-fg)]">
      {children}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm " +
        "outline-none ring-0 focus-visible:[box-shadow:var(--ring)] " +
        (props.className ?? "")
      }
    />
  );
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={
        "w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm " +
        "outline-none ring-0 focus-visible:[box-shadow:var(--ring)] " +
        (props.className ?? "")
      }
    />
  );
}

export function SmallButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement>
) {
  return (
    <button
      {...props}
      className={
        "rounded-md border border-[var(--border)] bg-[var(--card-bg)] px-2.5 py-1 text-xs " +
        "transition hover:bg-[var(--hover-bg)] " +
        (props.className ?? "")
      }
    />
  );
}
