// apps/resume/src/components/TopTabs.tsx
import { cn } from "@srf/ui";
import React from "react";

export default function TopTabs({
  items,
  offset = 96, // sticky 탭/헤더 높이만큼 보정 (필요시 조절)
  updateHash = true, // 클릭 시 URL 해시 갱신 여부
}: {
  items: { id: string; label: string }[];
  offset?: number;
  updateHash?: boolean;
}) {
  const [active, setActive] = React.useState(items[0]?.id);
  const lockRef = React.useRef<number | null>(null); // 클릭/스크롤 중 IO 업데이트 잠금

  // IO: 화면 상단 기준선(오프셋 보정)에 가장 가까운 섹션을 active로
  React.useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (lockRef.current) return; // 스크롤 애니 중에는 IO 무시(깜빡임 방지)

        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - offset) -
              Math.abs(b.boundingClientRect.top - offset)
          )[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: `-${offset}px 0px -70% 0px`, threshold: [0] }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items, offset]);

  // 초기 해시(#section) 처리(있다면 그 섹션을 active로)
  React.useEffect(() => {
    const hash =
      typeof window !== "undefined" ? window.location.hash.slice(1) : "";
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
    // 1) 클릭 즉시 active 반영(낙관적 업데이트)
    setActive(id);

    // 2) 오프셋 보정 스크롤
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }

    // 3) 해시 갱신(선택)
    if (updateHash) history.replaceState(null, "", `#${id}`);

    // 4) 스크롤 안정될 때까지 IO 잠금
    if (lockRef.current) window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => {
      lockRef.current = null;
    }, 700); // 필요 시 400~800ms로 조절
  };

  return (
    <div className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--bg),transparent)] shadow-[0_1px_0_0_var(--border)]">
      <div className="mx-auto max-w-screen-xl px-4 py-2">
        <nav
          aria-label="섹션 탭"
          className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1"
        >
          {items.map((it) => {
            const on = active === it.id;
            return (
              <button
                key={it.id}
                onClick={() => go(it.id)}
                className={cn(
                  "px-3.5 py-1.5 text-sm rounded-full transition",
                  on
                    ? "bg-[var(--primary)] text-[var(--primary-ink)]"
                    : "hover:bg-[var(--hover-bg)]"
                )}
                aria-current={on ? "page" : undefined}
              >
                {it.label}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
