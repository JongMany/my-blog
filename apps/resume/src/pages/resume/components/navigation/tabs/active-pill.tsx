import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

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

function findActiveButton(
  container: HTMLDivElement,
): HTMLButtonElement | null {
  // aria-current="page"를 가진 버튼 찾기
  const activeByAria =
    container.querySelector<HTMLButtonElement>(
      'button[aria-current="page"]',
    ) ?? container.querySelector<HTMLButtonElement>('button[aria-current="true"]');

  return activeByAria;
}

function calculatePillStyle(
  container: HTMLDivElement,
  activeButton: HTMLButtonElement,
): PillStyle {
  const containerRect = container.getBoundingClientRect();
  const buttonRect = activeButton.getBoundingClientRect();

  return {
    transform: `translateX(${buttonRect.left - containerRect.left}px)`,
    width: buttonRect.width,
    height: buttonRect.height,
    opacity: 1,
  };
}

export default function ActivePill({ containerRef }: ActivePillProps) {
  const [style, setStyle] = useState<PillStyle>(HIDDEN_STYLE);

  const updatePillPosition = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      setStyle(HIDDEN_STYLE);
      return;
    }

    const activeButton = findActiveButton(container);
    if (!activeButton) {
      setStyle(HIDDEN_STYLE);
      return;
    }

    const newStyle = calculatePillStyle(container, activeButton);
    setStyle(newStyle);
  }, [containerRef]);

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

    // MutationObserver로 버튼의 aria-current 변경 감지
    const mutationObserver = new MutationObserver(scheduleUpdate);
    if (containerRef.current) {
      mutationObserver.observe(containerRef.current, {
        attributes: true,
        attributeFilter: ["aria-current"],
        subtree: true,
      });
    }

    return () => {
      window.removeEventListener("resize", scheduleUpdate);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [updatePillPosition, containerRef]);

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 z-0 rounded-full transition-[transform,width] duration-200 will-change-transform bg-[rgba(8,24,48,0.08)] dark:bg-[rgba(255,255,255,0.12)]"
      style={style as CSSProperties}
    />
  );
}

