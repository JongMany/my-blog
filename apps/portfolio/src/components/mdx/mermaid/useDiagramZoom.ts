import { useState, useCallback } from "react";
import { clampZoom } from "./utils";

const ZOOM_CONFIG = {
  min: 0.1,
  max: 3,
  step: 1.2,
  wheelDelta: 0.1,
} as const;

export function useDiagramZoom() {
  const [zoom, setZoom] = useState(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 - ZOOM_CONFIG.wheelDelta : 1 + ZOOM_CONFIG.wheelDelta;
    setZoom((prev) => clampZoom(prev * delta, ZOOM_CONFIG.min, ZOOM_CONFIG.max));
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => clampZoom(prev * ZOOM_CONFIG.step, ZOOM_CONFIG.min, ZOOM_CONFIG.max));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => clampZoom(prev / ZOOM_CONFIG.step, ZOOM_CONFIG.min, ZOOM_CONFIG.max));
  }, []);

  const handleReset = useCallback(() => {
    setZoom(1);
  }, []);

  return { zoom, handleWheel, handleZoomIn, handleZoomOut, handleReset };
}

