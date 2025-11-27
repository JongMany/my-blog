import { useState, useCallback, useEffect } from "react";
import { clampZoom } from "./utils";

const ZOOM_CONFIG = {
  min: 0.1,
  max: 3,
  step: 1.2,
  wheelDelta: 0.1,
} as const;

export function useDiagramZoom(ref: React.RefObject<HTMLElement | null>) {
  const [zoom, setZoom] = useState(1);

  // wheel 이벤트를 직접 등록하여 passive: false 옵션 사용
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleWheel = (e: WheelEvent) => {
      // Ctrl 또는 Cmd 키가 눌려있을 때만 줌 처리
      if (!e.ctrlKey && !e.metaKey) return;
      
      e.preventDefault(); // passive: false로 등록했으므로 preventDefault 가능
      const delta = e.deltaY > 0 ? 1 - ZOOM_CONFIG.wheelDelta : 1 + ZOOM_CONFIG.wheelDelta;
      setZoom((prev) => clampZoom(prev * delta, ZOOM_CONFIG.min, ZOOM_CONFIG.max));
    };

    // passive: false 옵션으로 등록하여 preventDefault 사용 가능
    element.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      element.removeEventListener("wheel", handleWheel);
    };
  }, [ref]);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => clampZoom(prev * ZOOM_CONFIG.step, ZOOM_CONFIG.min, ZOOM_CONFIG.max));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => clampZoom(prev / ZOOM_CONFIG.step, ZOOM_CONFIG.min, ZOOM_CONFIG.max));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
  }, []);

  return { zoom, handleZoomIn, handleZoomOut, handleReset };
}

