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
      className="shell:pointer-events-none shell:fixed shell:bottom-4 shell:left-1/2 shell:z-[1000] shell:-translate-x-1/2 shell:space-y-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="shell:pointer-events-auto shell:t-card shell:flex shell:items-start shell:gap-3 shell:rounded-xl shell:px-4 shell:py-3 shell:shadow-lg"
          role="status"
        >
          <span
            className={
              t.variant === "error"
                ? "shell:mt-0.5 shell:size-2 shell:rounded-full shell:bg-red-500"
                : t.variant === "success"
                  ? "shell:mt-0.5 shell:size-2 shell:rounded-full shell:bg-emerald-500"
                  : "shell:mt-0.5 shell:size-2 shell:rounded-full shell:bg-[var(--primary)]"
            }
          />
          <div>
            <div className="shell:font-semibold">{t.title}</div>
            {t.description && (
              <div className="shell:text-[var(--muted-fg)] shell:text-xs">
                {t.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
