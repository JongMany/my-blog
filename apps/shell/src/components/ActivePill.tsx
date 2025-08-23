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

    // 1) 가장 신뢰도 높은: aria-current="page"
    let el =
      (root.querySelector(
        'a[aria-current="page"]'
      ) as HTMLAnchorElement | null) ??
      (root.querySelector(
        'a[aria-current="true"]'
      ) as HTMLAnchorElement | null);

    // 2) 폴백: pathname 기준으로 가장 긴 prefix 매칭
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
    // 최초 + 라우트 변경 시
    requestAnimationFrame(measure);

    // 리사이즈/폰트로드 대응
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);

    const ro = new ResizeObserver(() => requestAnimationFrame(measure));
    if (containerRef.current) ro.observe(containerRef.current);

    // 폰트 로드 후 폭이 달라지는 경우
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
      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-0 rounded-full transition-[transform,width] duration-200 will-change-transform bg-[var(--primary)]"
      style={style}
    />
  );
}
