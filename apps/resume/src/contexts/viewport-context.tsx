import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

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

const ViewportContext = createContext<ViewportValue | undefined>(undefined);

interface ViewportProviderProps {
  children: ReactNode;
}

/**
 * Provider component that tracks viewport size and breakpoints
 */
export function ViewportProvider({ children }: ViewportProviderProps) {
  const [viewport, setViewport] = useState<ViewportValue>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeDesktop: false,
    width: 0,
  });

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      setViewport({
        isMobile: width < BREAKPOINTS.sm,
        isTablet: width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.sm,
        isLargeDesktop: width >= BREAKPOINTS.lg,
        width,
      });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  return (
    <ViewportContext.Provider value={viewport}>
      {children}
    </ViewportContext.Provider>
  );
}

/**
 * Hook to access viewport state
 * @throws {Error} if used outside ViewportProvider
 */
export function useViewport() {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return context;
}

