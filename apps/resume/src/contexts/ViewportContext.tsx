import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ViewportContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  width: number;
}

const ViewportContext = createContext<ViewportContextType | undefined>(
  undefined,
);

interface ViewportProviderProps {
  children: ReactNode;
}

export function ViewportProvider({ children }: ViewportProviderProps) {
  const [viewport, setViewport] = useState({
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
        isMobile: width < 640, // sm
        isTablet: width >= 640 && width < 1024, // sm to lg
        isDesktop: width >= 640, // sm+
        isLargeDesktop: width >= 1024, // lg+
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

export function useViewport() {
  const context = useContext(ViewportContext);
  if (context === undefined) {
    throw new Error("useViewport must be used within a ViewportProvider");
  }
  return context;
}
