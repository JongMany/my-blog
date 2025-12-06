import { useState, useCallback, useEffect, useRef } from "react";
import { calculateMaxTranslate, clampTranslate } from "./utils";
import type { DragState, TranslateState } from "@/components/mdx/lib/types";

export function useDiagramDrag(
  ref: React.RefObject<HTMLDivElement | null>,
  zoom: number,
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<DragState>({ x: 0, y: 0 });
  const [translate, setTranslate] = useState<TranslateState>({ x: 0, y: 0 });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      setIsDragging(true);
      setDragStart({ x: e.clientX - translate.x, y: e.clientY - translate.y });
      document.body.style.overflow = "hidden";
    },
    [translate],
  );

  const handleGlobalMouseMove = useCallback(
    (e: globalThis.MouseEvent) => {
      if (!isDragging || !ref.current?.parentElement) return;
      const rect = ref.current.parentElement.getBoundingClientRect();
      const maxX = calculateMaxTranslate(rect.width, zoom);
      const maxY = calculateMaxTranslate(rect.height, zoom);
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setTranslate({
        x: zoom > 1 ? clampTranslate(dx, maxX) : dx,
        y: zoom > 1 ? clampTranslate(dy, maxY) : dy,
      });
    },
    [isDragging, dragStart, zoom, ref],
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!isDragging) return;
    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;
      if (isModifierPressed) {
        document.body.style.overflow = "hidden";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const isModifierPressed = e.ctrlKey || e.metaKey;
      if (!isModifierPressed && !isDragging) {
        document.body.style.overflow = "";
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      document.body.style.overflow = "";
    };
  }, [isDragging]);

  const handleReset = useCallback(() => {
    setTranslate({ x: 0, y: 0 });
  }, []);

  return { isDragging, translate, handleMouseDown, handleReset };
}

