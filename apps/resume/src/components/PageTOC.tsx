// apps/resume/src/components/PageTOC.tsx
import React from "react";
import { Card } from "./ui";
import { cn } from "@srf/ui";

type TocItem = { id: string; label: string };

export default function PageTOC({
  items,
  offset = 96, // sticky 보정
  updateHash = true, // ← 해시 업데이트 on/off
}: {
  items: TocItem[];
  offset?: number;
  updateHash?: boolean;
}) {
  const [active, setActive] = React.useState(items[0]?.id);
  const lockRef = React.useRef<number | null>(null);

  const setHash = (id: string) => {
    if (!updateHash) return;
    // replaceState: 히스토리 누적 방지
    history.replaceState(null, "", `#${id}`);
  };

  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return; // 스크롤 애니 중 IO 무시
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - offset) -
              Math.abs(b.boundingClientRect.top - offset)
          )[0];
        if (visible?.target?.id) {
          const id = visible.target.id;
          if (id !== active) {
            setActive(id);
            setHash(id); // ← 스크롤로 활성화될 때도 해시 반영
          }
        }
      },
      { rootMargin: `-${offset}px 0px -70% 0px`, threshold: [0] }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, offset, updateHash, active]);

  // 초기 #hash 처리 (있으면 해당 섹션으로 점프)
  React.useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && items.some((i) => i.id === hash)) {
      setActive(hash);
      const el = document.getElementById(hash);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "instant" as ScrollBehavior });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const go = (id: string) => {
    setActive(id); // 클릭 즉시 활성
    setHash(id); // ← 클릭 시 해시 반영

    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
    if (lockRef.current) window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => (lockRef.current = null), 700);
  };

  return (
    <Card className="p-3">
      <div className="mb-2 text-sm font-medium text-[var(--muted-fg)]">
        목차
      </div>
      <div className="flex flex-col gap-1.5">
        {items.map((it) => {
          const is = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => go(it.id)}
              className={cn(
                "w-full rounded-full px-3 py-1.5 text-left text-sm transition",
                is
                  ? "bg-[var(--primary)] text-[var(--primary-ink)]"
                  : "bg-[var(--surface)] hover:bg-[var(--hover-bg)]"
              )}
              aria-current={is ? "true" : undefined}
            >
              {it.label}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
