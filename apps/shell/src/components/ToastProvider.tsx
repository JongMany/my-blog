import React from "react";

type Toast = {
  id: number;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error";
};
const evtName = "app:toast";

export function fireToast(detail: Omit<Toast, "id">) {
  window.dispatchEvent(new CustomEvent(evtName, { detail }));
}

export default function ToastProvider() {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  React.useEffect(() => {
    function onToast(e: Event) {
      const d = (e as CustomEvent).detail as Omit<Toast, "id">;
      setToasts((prev) => [...prev, { id: Date.now() + Math.random(), ...d }]);
    }
    window.addEventListener(evtName, onToast as any);
    return () => window.removeEventListener(evtName, onToast as any);
  }, []);

  React.useEffect(() => {
    const t = setInterval(() => setToasts((p) => p.slice(1)), 3200);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 left-1/2 z-[1000] -translate-x-1/2 space-y-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto t-card flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg"
          role="status"
        >
          <span
            className={
              t.variant === "error"
                ? "mt-0.5 size-2 rounded-full bg-red-500"
                : t.variant === "success"
                  ? "mt-0.5 size-2 rounded-full bg-emerald-500"
                  : "mt-0.5 size-2 rounded-full bg-[var(--primary)]"
            }
          />
          <div>
            <div className="font-semibold">{t.title}</div>
            {t.description && (
              <div className="text-[var(--muted-fg)] text-xs">
                {t.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
