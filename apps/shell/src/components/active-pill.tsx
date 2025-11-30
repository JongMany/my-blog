import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import { useLocation } from "react-router-dom";

type ActivePillProps = {
  containerRef: RefObject<HTMLDivElement | null>;
};

type PillStyle = {
  transform: string;
  width: number;
  height: number;
  opacity: number;
};

const HIDDEN_STYLE: PillStyle = {
  transform: "translateX(0px)",
  width: 0,
  height: 0,
  opacity: 0,
};

function findActiveAnchor(
  container: HTMLDivElement,
  pathname: string,
): HTMLAnchorElement | null {
  // React Router NavLink는 active일 때 aria-current="page"를 설정
  const activeByAria =
    container.querySelector<HTMLAnchorElement>('a[aria-current="page"]') ??
    container.querySelector<HTMLAnchorElement>('a[aria-current="true"]');

  if (activeByAria) return activeByAria;

  // Fallback: pathname으로 매칭
  const anchors = Array.from(
    container.querySelectorAll<HTMLAnchorElement>('a[href^="/"]'),
  );

  let bestMatch: HTMLAnchorElement | null = null;
  let longestMatchLength = -1;

  for (const anchor of anchors) {
    const anchorPath = new URL(anchor.href, window.location.origin).pathname;
    const normalizedPath = anchorPath.endsWith("/")
      ? anchorPath
      : `${anchorPath}/`;

    const isExactMatch = pathname === anchorPath;
    const isPrefixMatch = pathname.startsWith(normalizedPath);

    if (
      (isExactMatch || isPrefixMatch) &&
      anchorPath.length > longestMatchLength
    ) {
      bestMatch = anchor;
      longestMatchLength = anchorPath.length;
    }
  }

  return bestMatch;
}

function calculatePillStyle(
  container: HTMLDivElement,
  activeAnchor: HTMLAnchorElement,
): PillStyle {
  const containerRect = container.getBoundingClientRect();
  const anchorRect = activeAnchor.getBoundingClientRect();

  return {
    transform: `translateX(${anchorRect.left - containerRect.left}px)`,
    width: anchorRect.width,
    height: anchorRect.height,
    opacity: 1,
  };
}

export default function ActivePill({ containerRef }: ActivePillProps) {
  const { pathname } = useLocation();
  const [style, setStyle] = useState<PillStyle>(HIDDEN_STYLE);

  const updatePillPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      setStyle(HIDDEN_STYLE);
      return;
    }

    const activeAnchor = findActiveAnchor(container, pathname);
    if (!activeAnchor) {
      setStyle(HIDDEN_STYLE);
      return;
    }

    const newStyle = calculatePillStyle(container, activeAnchor);
    setStyle(newStyle);
  }, [containerRef, pathname]);

  useEffect(() => {
    const scheduleUpdate = () => requestAnimationFrame(updatePillPosition);
    scheduleUpdate();

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener("resize", scheduleUpdate);

    const fontsReady = document.fonts?.ready;
    fontsReady?.then(scheduleUpdate);

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
    };
  }, [updatePillPosition, containerRef]);

  return (
    <span
      aria-hidden
      className="shell:pointer-events-none shell:absolute shell:left-0 shell:top-1/2 shell:-translate-y-1/2 shell:z-0 shell:rounded-full shell:transition-[transform,width] shell:duration-200 shell:will-change-transform shell:bg-[rgba(8,24,48,0.08)] dark:shell:bg-[rgba(255,255,255,0.12)]"
      style={style as CSSProperties}
    />
  );
}
