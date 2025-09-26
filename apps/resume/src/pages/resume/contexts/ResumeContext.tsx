import React, { createContext, useContext, useState, ReactNode } from "react";

type ResumeViewMode = "detailed" | "compact";

interface ResumeContextType {
  viewMode: ResumeViewMode;
  toggleViewMode: () => void;
  isDetailed: boolean;
  isCompact: boolean;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [viewMode, setViewMode] = useState<ResumeViewMode>("detailed");

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === "detailed" ? "compact" : "detailed"));
  };

  const value = {
    viewMode,
    toggleViewMode,
    isDetailed: viewMode === "detailed",
    isCompact: viewMode === "compact",
  };

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
