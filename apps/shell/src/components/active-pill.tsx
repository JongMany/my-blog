import React from "react";
import { useLocation } from "react-router-dom";

export default function ActivePill({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { pathname } = useLocation();
  const [style, setStyle] = React.useState<React.CSSProperties>({
    transform: "translateX(0px)",
    width: 0,
    height: 0,
    opacity: 0,
  });

  const measure = React.useCallback(() => {
    const root = containerRef.current;
    if (!root) return;

    // 1) aria-current="page"
    let el =
      (root.querySelector(
        'a[aria-current="page"]'
      ) as HTMLAnchorElement | null) ??
      (root.querySelector(
        'a[aria-current="true"]'
      ) as HTMLAnchorElement | null);

    // 2) fallback: prefix match by pathname
    if (!el) {
      const anchors = Array.from(
        root.querySelectorAll<HTMLAnchorElement>('a[href^="/"]')
      );
      let best: HTMLAnchorElement | null = null;
      let bestLen = -1;
      for (const a of anchors) {
        const p = new URL(a.href, window.location.origin).pathname;
        if (
          pathname === p ||
          pathname.startsWith(p.endsWith("/") ? p : p + "/")
        ) {
          if (p.length > bestLen) {
            best = a;
            bestLen = p.length;
          }
        }
      }
      el = best;
    }

    if (!el) {
      setStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }

    const parentRect = root.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const x = r.left - parentRect.left;
    const w = r.width;
    const h = r.height;

    setStyle({
      transform: `translateX(${x}px)`,
      width: w,
      height: h,
      opacity: 1,
    });
  }, [containerRef, pathname]);

  React.useEffect(() => {
    requestAnimationFrame(measure);

    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    if (containerRef.current) ro.observe(containerRef.current);

    (document as any).fonts?.ready?.then?.(() =>
      requestAnimationFrame(measure)
    );

    return () => {
      window.removeEventListener("resize", onResize);
      ro.disconnect();
    };
  }, [measure]);

  return (
    <span
      aria-hidden
      className="shell:pointer-events-none shell:absolute shell:left-0 shell:top-1/2 shell:-translate-y-1/2 shell:z-0 shell:rounded-full shell:transition-[transform,width] shell:duration-200 shell:will-change-transform shell:bg-[var(--primary)]"
      style={style}
    />
  );
}
