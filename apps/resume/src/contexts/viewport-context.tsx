import React, { useState, useEffect, useMemo } from "react";
import { createContext } from "@mfe/shared";

/**
 * Breakpoint constants (matching Tailwind CSS defaults)
 */
const BREAKPOINTS = {
  sm: 640,
  lg: 1024,
} as const;

/**
 * Viewport state type
 */
interface ViewportValue {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
}

const [ViewportProviderBase, useViewportBase] =
  createContext<ViewportValue>("Viewport");

interface ViewportProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that tracks viewport size and breakpoints
 */
export function ViewportProvider({ children }: ViewportProviderProps) {
  const [width, setWidth] = useState(() => {
    // SSR-safe: only access window in browser
    if (typeof window !== "undefined") {
      return window.innerWidth;
    }
    return 0;
  });

  const viewport = useMemo<ViewportValue>(
    () => ({
      isMobile: width < BREAKPOINTS.sm,
      isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
      isDesktop: width >= BREAKPOINTS.sm,
      isLargeDesktop: width >= BREAKPOINTS.lg,
      width,
    }),
    [width],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateViewport = () => {
      setWidth(window.innerWidth);
    };

    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return <ViewportProviderBase {...viewport}>{children}</ViewportProviderBase>;
}

/**
 * Hook to access viewport state
 * @throws {Error} if used outside ViewportProvider
 */
export function useViewport() {
  return useViewportBase("useViewport");
}
